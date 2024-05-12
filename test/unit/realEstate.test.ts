import { deployments, ethers, network, getNamedAccounts } from "hardhat"
import { Signer } from "ethers"
import { developmentChains, ENGINE_CA } from "../../helper-hardhat-config"
import { RealEstate, RealEstateEngine } from "../../typechain-types"
import { assert, expect } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("realEstate", async () => {
          let deployer: Signer, realEstate: RealEstate, realEstateEngine: RealEstateEngine
          const nftId: number = 1
          const TOKEN_URI: string =
              "https://ipfs.io/ipfs/QmZ6HpSkr5VAJW1SsWfZTFq44gJjT5Wshh349hi5vfQme2"
          const PURCHASE_PRICE = ethers.utils.parseEther("10")
          const WHAT_IT_COSTS = ethers.utils.parseEther("5")
          const [seller, buyer, inspector, lender] = await ethers.getSigners()

          beforeEach(async () => {
              await deployments.fixture(["all"])
              realEstate = await ethers.getContract("RealEstate", seller)
              realEstateEngine = await ethers.getContract("RealEstateEngine", seller)
              const response = await realEstateEngine.connect(seller).mint(TOKEN_URI)
              await response.wait(1)
              realEstateEngine.approve(realEstate.address, nftId)
          })

          describe("constructor", () => {
              it("initializes the engine contract, lender address, inspector address, and seller", async () => {
                  const nftAddress = await realEstate.getEngineContract()
                  assert.equal(nftAddress, ENGINE_CA)

                  const lenderAddress = await realEstate.getLender()
                  assert.equal(lenderAddress, lender.address)

                  const inspectorAddress = await realEstate.getInspector()
                  assert.equal(inspectorAddress, inspector.address)

                  const sellerAddress = await realEstate.getSeller()
                  assert.equal(sellerAddress, seller.address)
              })
          })
          describe("list", () => {
              beforeEach(async () => {
                  const response = await realEstate
                      .connect(seller)
                      .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                  await response.wait(1)
              })
              it("mints and transfers the nft from the seller to the contract", async () => {
                  const owner = await realEstateEngine.ownerOf(1)
                  assert.equal(realEstate.address, owner)
              })
              it("updates the purchasePrice, cost, approval status, buyer, and inspection status", async () => {
                  const isListed = await realEstate.isListed(nftId)
                  assert.equal(isListed, true)

                  await expect((await realEstate.purchasePrice(nftId)).toString()).to.equal(
                      PURCHASE_PRICE
                  )

                  await expect((await realEstate.whatItCosts(nftId)).toString()).to.equal(
                      WHAT_IT_COSTS
                  )

                  await expect((await realEstate.buyer(nftId)).toString()).to.equal(buyer.address)

                  await expect(await realEstate.inspectionPassed(nftId)).to.equal(true)
              })

              it("reverts if another address calls it except the seller", async () => {
                  await expect(
                      realEstate
                          .connect(buyer)
                          .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                  ).to.be.revertedWith("only seller can call function")
              })
          })

          describe("deposition", () => {
              beforeEach(async () => {
                  const response = await realEstate
                      .connect(seller)
                      .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                  await response.wait(1)
              })

              it("only buyer can call the function", async () => {
                  await expect(realEstate.connect(seller).deposition(nftId)).to.be.revertedWith(
                      "only buyer can call function"
                  )
              })

              it("reverts if what it costs is higher than what buyer deposits", async () => {
                  await expect(
                      realEstate
                          .connect(buyer)
                          .deposition(nftId, { value: ethers.utils.parseEther("2") })
                  ).to.be.revertedWith("insufficient amount deposited")
              })

              it("increases the balance of the the contract after  deposition", async () => {
                  const startingContractBalance = await ethers.provider.getBalance(
                      realEstate.address
                  )
                  await realEstate.connect(buyer).deposition(nftId, { value: WHAT_IT_COSTS })
                  const closingContractBalance = await ethers.provider.getBalance(
                      realEstate.address
                  )
                  assert.equal(
                      startingContractBalance.add(WHAT_IT_COSTS).toString(),
                      closingContractBalance.toString()
                  )
              })
          })
          describe("updateInspectionPassed", () => {
              it("reverts if inspection has not been passed", async () => {
                  await expect(
                      realEstate.connect(inspector).updateInspectionPassed(nftId)
                  ).to.be.revertedWith("inspection failed")
              })
          })
          //   describe("approveSale", () => {})

          describe("finalizeSale", () => {
              it("reverts if purchase price is greater than or equal to contract balance ", async () => {
                  const response = await realEstate
                      .connect(seller)
                      .list(nftId, ethers.utils.parseEther("5"), WHAT_IT_COSTS, buyer.address)
                  await response.wait(1)

                  await realEstate.connect(buyer).deposition(nftId, { value: WHAT_IT_COSTS })

                  await expect(realEstate.finalizeSale(nftId)).to.be.reverted
              })

              describe("finalizeSale", () => {
                  beforeEach(async () => {
                      const response = await realEstate
                          .connect(seller)
                          .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                      await response.wait(1)

                      await realEstate.connect(buyer).deposition(nftId, { value: WHAT_IT_COSTS })
                  })

                  it("reverts if any of the approval has not been granted", async () => {
                      await expect(realEstate.finalizeSale(nftId)).to.be.reverted
                  })
              })

              describe("finalizeSale continued", () => {
                  beforeEach(async () => {
                      const response = await realEstate
                          .connect(seller)
                          .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                      await response.wait(1)
                      const res = await realEstate
                          .connect(buyer)
                          .deposition(nftId, { value: WHAT_IT_COSTS })

                      await res.wait()
                      await realEstate.connect(seller).approveSale(nftId)
                      await realEstate.connect(buyer).approveSale(nftId)
                      await realEstate.connect(lender).approveSale(nftId)
                  })

                  it("finalizes the sale and sends funds to seller and nft to buyer", async () => {
                      const startingSellerBalance = await ethers.provider.getBalance(seller.address)

                      const response = await realEstate.finalizeSale(nftId)
                      const responseReceipt = await response.wait()

                      const { gasUsed, effectiveGasPrice } = responseReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)

                      const closingSellerBalance = await ethers.provider.getBalance(seller.address)

                      assert.equal(
                          startingSellerBalance.add(WHAT_IT_COSTS.sub(gasCost)).toString(),
                          closingSellerBalance.toString()
                      )

                      const res = await realEstateEngine.ownerOf(1)
                      assert.equal(res, buyer.address)
                      assert.equal(await realEstate.isListed(nftId), false)
                  })
              })
          })

          describe("cancelSale", () => {
              it("refunds buyer if inspection fails", async () => {

                  const response = await realEstate
                      .connect(seller)
                      .list(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                  await response.wait(1)
                  const tx = await realEstate.connect(buyer).deposition(nftId, { value: WHAT_IT_COSTS })
                  await tx.wait()

                  const startingSellerBalance = await ethers.provider.getBalance(seller.address)

                  const contractBalance = await ethers.provider.getBalance(realEstate.address)

                  const res = await realEstate.connect(inspector).cancelSale(nftId)
                  await res.wait()

                  const closingSellerBalance = await ethers.provider.getBalance(seller.address)

                  assert.equal(startingSellerBalance.add(contractBalance).toString(), closingSellerBalance.toString())
              })
          })
      })

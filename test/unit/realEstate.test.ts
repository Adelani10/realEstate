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
          describe("mintAndList", () => {
              it("mints the nft to the seller and transfers it to the contract", async () => {
                  const response = await realEstate
                      .connect(seller)
                      .mintAndlist(nftId, PURCHASE_PRICE, WHAT_IT_COSTS, buyer.address)
                  await response.wait(1)
                  await expect(realEstateEngine.ownerOf(1), realEstate.address)
              })
          })
          describe("deposition", () => {})
          describe("updateInspectionPassed", () => {})
          describe("approveSale", () => {})
          describe("finalizeSale", () => {})
          describe("cancelSale", () => {})
      })

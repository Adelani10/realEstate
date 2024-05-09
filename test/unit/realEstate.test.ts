import { deployments, ethers, network } from "hardhat"
import { developmentChains, ENGINE_CA,lender,seller, inspector } from "../../helper-hardhat-config"
import { RealEstate } from "../../typechain-types"
import { Signer } from "ethers"
import { assert } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("realEstate", () => {
          let deployer: Signer, realEstate: RealEstate
          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["all"])
              realEstate = await ethers.getContract("RealEstate", deployer)
          })

          describe("constructor", () => {
            it("initializes the engine contract, lender address, inspector address, and seller", async () => {

                const nftAddress = await realEstate.getEngineContract()
                assert.equal(nftAddress, ENGINE_CA)

                const lenderAddress = await realEstate.getLender()
                assert.equal(lenderAddress, lender)

                const inspectorAddress = await realEstate.getInspector()
                assert.equal(inspectorAddress, inspector)

                const sellerAddress = await realEstate.getSeller()
                assert.equal(sellerAddress, seller)
            })
          })
          describe("mintAndList", () => {
            it("mints the nft to the seller", async () => {

            })
          })
          describe("deposition", () => {})
          describe("updateInspectionPassed", () => {})
          describe("approveSale", () => {})
          describe("finalizeSale", () => {})
          describe("cancelSale", () => {})
          
      })

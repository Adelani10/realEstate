import { network, ethers, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { RealEstateEngine } from "../../typechain-types"
import { Signer } from "ethers"
import { assert, expect } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RealEstateEngine", () => {
          let realEstateEngine: RealEstateEngine, deployer: Signer

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["all"])
              realEstateEngine = await ethers.getContract("RealEstateEngine", deployer)
          })

          describe("constructor", () => {
            it("properly sets the name and symbol of the nft", async () => {
              const name = await realEstateEngine.name()
              const symbol = await realEstateEngine.symbol()

              assert.equal(name, "RealEstate")
              assert.equal(symbol, "EST")
            })
          })

          describe("mint", () => {
            it("mints the nft to the seller", async () => {
              // const transaction = await realEstateEngine.mint(uri, 1)
              
            })
          })
      })

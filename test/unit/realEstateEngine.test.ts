import { network, ethers, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { RealEstateEngine } from "../../typechain-types"
import { Signer } from "ethers"
import { assert, expect } from "chai"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RealEstateEngine", () => {
          let realEstateEngine: RealEstateEngine, deployer: Signer
          const TOKEN_URI: string = "https://ipfs.io/ipfs/QmZ6HpSkr5VAJW1SsWfZTFq44gJjT5Wshh349hi5vfQme2"
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
            it("increments the tokenIds, mints the nft to the seller and returns the current tokenId", async () => {
              const transaction = await realEstateEngine.mint(TOKEN_URI)
              await transaction.wait(1)
              const res = await realEstateEngine.currentId()
              const response = await realEstateEngine.tokenURI(1)
              const owner = await realEstateEngine.ownerOf(1)
              assert.equal(owner, (await deployer.getAddress()).toString())
              assert.equal(res.toString(), "1")
              assert.equal(response, TOKEN_URI)
              
            })
          })
      })

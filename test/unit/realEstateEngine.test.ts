import { network, ethers, deployments } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { RealEstateEngine } from "../../typechain-types"
import { Signer } from "ethers"
import { assert, expect } from "chai"

const uri = {
  "name": "Luxury NYC Penthouse",
  "address": "157 W 57th St APT 498, New York NY 10019",
  "description": "Luxury Penthouse located in the heart of NYC",
  "image": "https://ipfs.io/ipfs/QmQUozr1iLAusXDxrvsBSJ3PYB3rUeUuBAvVWw6nop2uu7c/1.png",
  "id": "1",
  "attributes": [
    {
      "trait_type": "Purchase Price",
      "value": 20
    },
    {
      "trait_type": "Type of Residence",
      "value": "Condo"
    },
    {
      "trait_type": "Bed Roons",
      "value": 2
    },
    {
      "trait_type": "Bathroons",
      "value": 3
    },
    {
      "trait_type": "Square Feet",
      "value": 2200
    },
    {
      "trait_type": "Year Built",
      "value": 2013
    },
  ]
}

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

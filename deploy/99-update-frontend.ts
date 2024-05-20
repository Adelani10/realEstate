import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import fs from "fs"
import "dotenv/config"
import {
    frontEndAbiLocation,
    frontEndAbiLocation2,
    frontEndContractsFile,
} from "../helper-hardhat-config"

const updateFrontEnd: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to frontend..")
        await updateAbi()
        await updateContractAddresses()
        console.log("frontEnd written")
    }
}

const updateAbi = async () => {
    const realEstateEngine = await ethers.getContract("RealEstateEngine")
    const realEstate = await ethers.getContract("RealEstate")

    fs.writeFileSync(
        frontEndAbiLocation,
        realEstateEngine.interface.format(ethers.utils.FormatTypes.json).toString()
    )

    fs.writeFileSync(
        frontEndAbiLocation2,
        realEstate.interface.format(ethers.utils.FormatTypes.json).toString()
    )

    console.log(network.config.chainId)
}

const updateContractAddresses = async () => {
    const chainId = network.config.chainId!.toString()
    const realEstate = await ethers.getContract("RealEstate")
    const realEstateEngine = await ethers.getContract("RealEstateEngine")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf-8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["realEstateEngine"].includes[realEstateEngine.address]) {
            contractAddresses[chainId]["realEstateEngine"].push(realEstateEngine.address)
        }

        if (!contractAddresses[chainId]["realEstate"].includes[realEstate.address]) {
            contractAddresses[chainId]["realEstate"].push(realEstate.address)
        }
    } else {
        contractAddresses[chainId] = { realEstateEngine: [realEstateEngine.address], realEstate: [realEstate.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
export default updateFrontEnd

updateFrontEnd.tags = ["all", "frontend"]

import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    ENGINE_CA,
} from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployRealEstate: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers, network } = hre

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const [seller, buyer, inspector, lender] = await ethers.getSigners()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("---------------")
    log("deploying pls wait")

    const args: any[] = [ENGINE_CA, seller.address, inspector.address, lender.address]

    const realEstate = await deploy("RealEstate", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    if (developmentChains.includes(network.name) && process.env.SEPOLIA_RPC_URL) {
        await verify(realEstate.address, args)
        log("verification done")
    }
}

export default deployRealEstate

deployRealEstate.tags = ["all", "realEstate"]

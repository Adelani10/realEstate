import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS,  } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployRealEstateEngine: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers, network} = hre
    
    const {deploy, log} = deployments
    const {deployer } = await getNamedAccounts()


    log("---------------")
    log("deploying pls wait")

    const args: [] = []

    const realEstateEngine = await deploy("RealEstateEngine", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS
    })

    if(developmentChains.includes(network.name) && process.env.SEPOLIA_RPC_URL){
        await verify(realEstateEngine.address, args)
        log("verification done")
    }
}

export default deployRealEstateEngine

deployRealEstateEngine.tags = ["all", "realEstateEngine"]
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS,  } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployRealEstateEngine: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers, network} = hre
    
    const {deploy, log} = deployments
    const {deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS


    log("---------------")
    log("deploying pls wait")

    const args: any[] = []

    const realEstateEngine = await deploy("RealEstateEngine", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations
    })

    if(developmentChains.includes(network.name) && process.env.SEPOLIA_RPC_URL){
        await verify(realEstateEngine.address, args)
        log("verification done")
    }
}

export default deployRealEstateEngine

deployRealEstateEngine.tags = ["all", "realEstateEngine"]
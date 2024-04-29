import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS,  } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployRealEstate: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers, network} = hre
    
    const {deploy, log} = deployments
    const {deployer } = await getNamedAccounts()


    log("---------------")
    log("deploying pls wait")

    const args: [] = []

    const realEstate = await deploy("RealEstate", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: VERIFICATION_BLOCK_CONFIRMATIONS
    })

    if(developmentChains.includes(network.name) && process.env.SEPOLIA_RPC_URL){
        await verify(realEstate.address, args)
        log("verification done")
    }
}

export default deployRealEstate

deployRealEstate.tags = ["all", "realEstate"]
import { run } from "hardhat";

const verify = async (contractAddress: string, args: any[]) => {
    console.log("verifying contract...")
    try{
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
            // console.log("TRYING")
        })
    } catch(e: any){
        if(e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

export default verify


// async function updateAbi() {
//     const nftMarketplace = await ethers.getContract("NftMarketplace")
//     fs.writeFileSync(
//         `${frontEndAbiLocation}NftMarketplace.json`,
//         nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
//     )
//     fs.writeFileSync(
//         `${frontEndAbiLocation2}NftMarketplace.json`,
//         nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
//     )

//     const basicNft = await ethers.getContract("BasicNft")
//     fs.writeFileSync(
//         `${frontEndAbiLocation}BasicNft.json`,
//         basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
//     )
//     fs.writeFileSync(
//         `${frontEndAbiLocation2}BasicNft.json`,
//         basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
//     )
// }

// async function updateContractAddresses() {
//     const chainId = network.config.chainId!.toString()
//     const nftMarketplace = await ethers.getContract("NftMarketplace")
//     const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
//     if (chainId in contractAddresses) {
//         if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
//             contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
//         }
//     } else {
//         contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
//     }
//     fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
//     fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
// }
// export default updateFrontEnd
// updateFrontEnd.tags = ["all", "frontend"]
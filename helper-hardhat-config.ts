export interface networkConfigItem {
    name?: string
    subscriptionId?: string 
    keepersUpdateInterval?: string 
    raffleEntranceFee?: string 
    callbackGasLimit?: string 
    vrfCoordinatorV2?: string
    gasLane?: string 
    ethUsdPriceFeed?: string
    mintFee?: string
  }
  
export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig:networkConfigInfo = {
    31337: {
        name: "localhost",
        subscriptionId: "588",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    11155111: {
        name: "sepolia",
        subscriptionId: "588",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        keepersUpdateInterval: "30",
        raffleEntranceFee: "100000000000000000", // 0.1 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    1: {
        name: "mainnet",
        keepersUpdateInterval: "30",
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
export const ENGINE_CA = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const seller = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
export const buyer = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
export const inspector = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
export const lender = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"

// export const frontEndContractsFile = "../nextjs-nft-marketplace-moralis-fcc/constants/networkMapping.json"
// export const frontEndContractsFile2 =
//     "../nextjs-nft-marketplace-thegraph-fcc/constants/networkMapping.json"
// export const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis-fcc/constants/"
// export const frontEndAbiLocation2 = "../nextjs-nft-marketplace-thegraph-fcc/constants/"
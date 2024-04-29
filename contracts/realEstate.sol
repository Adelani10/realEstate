// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./realEstateEngine.sol";


contract RealEstate  {
    address public seller;
    address public buyer;

    string tokenURI = "" ;

    RealEstateEngine realEstateEngine;

    constructor (address _realEstateEngine) {
        realEstateEngine = RealEstateEngine(_realEstateEngine);
    }

    modifier onlySeller() {
        require(msg.sender == seller, "only seller can mint nft");
        _;
    }

    function initiateTransaction () public onlySeller {
        // require()
        realEstateEngine.mint(tokenURI, msg.sender);


        require(realEstateEngine.ownerOf(1) == seller, "seller don't own nft");

        realEstateEngine.transferFrom(seller, address(this), 1);
    }

}

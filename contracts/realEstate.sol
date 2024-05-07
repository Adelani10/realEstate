// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./realEstateEngine.sol";

contract RealEstate {
    // state variables
    address public seller;
    address private lender;
    address private inspector;
    RealEstateEngine realEstateEngine;

    constructor(
        address _realEstateEngine,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        realEstateEngine = RealEstateEngine(_realEstateEngine);
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    // modifiers
    modifier onlySeller() {
        require(msg.sender == seller, "only seller can call function");
        _;
    }

    modifier onlyBuyer(uint256 nftId) {
        require(msg.sender == buyer[nftId], "only buyer can call function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "only inspector can call function");
        _;
    }

    // mappings
    mapping(uint256 => address) public buyer;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public whatItCosts;
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => mapping(address => bool)) private approval;
    mapping(uint256 => bool) public inspectionPassed;


    function list(
        uint256 nftId,
        uint256 _purchasePrice,
        uint256 _whatItCosts,
        address _buyer
    ) public onlySeller {
        realEstateEngine.mint("https://ipfs.io/ipfs/QmZ6HpSkr5VAJW1SsWfZTFq44gJjT5Wshh349hi5vfQme2");
        
        realEstateEngine.transferFrom(msg.sender, address(this), nftId);

        isListed[nftId] = true;

        purchasePrice[nftId] = _purchasePrice;
        whatItCosts[nftId] = _whatItCosts;
        approval[nftId][msg.sender] = true;
        buyer[nftId] = _buyer;
        inspectionPassed[nftId] = true;

    }


    function deposition(uint256 nftId) public payable onlyBuyer(nftId) {
        require(msg.value >= whatItCosts[nftId], "insufficient amount deposited");
    }

    function updateInspectionPassed(uint256 nftId) public view onlyInspector {
        require(inspectionPassed[nftId] == true, "inspection failed");
    }

    function approvalSale(uint256 nftId) private {
        approval[nftId][msg.sender] = true;
    }

    function finalizeSale(uint256 nftId) public {
        require(inspectionPassed[nftId] == true);
        require(purchasePrice[nftId] >= address(this).balance);
        require(approval[nftId][seller] == true);
        require(approval[nftId][buyer[nftId]] == true);
        require(approval[nftId][lender] == true);

        isListed[nftId] = false;

        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);

        realEstateEngine.transferFrom(address(this), buyer[nftId], nftId);

    }


    function cancelSale(uint256 nftId) public {
        if(inspectionPassed[nftId] == false) {
            (bool success,) = payable(buyer[nftId]).call{value: address(this).balance}("");
            require(success);
        } else {
            (bool success,) = payable(seller).call{value: address(this).balance}("");
            require(success);
        }
    }

    receive() external payable{}


}

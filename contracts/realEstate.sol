// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./realEstateEngine.sol";

contract RealEstate {
    // state variables
    address public nftAddress;
    address public seller;
    address private lender;
    address private inspector;

    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
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
    mapping(uint256 => mapping(address => bool)) public approval;
    mapping(uint256 => bool) public inspectionPassed;

    function list(
        uint256 nftId,
        uint256 _purchasePrice,
        uint256 _whatItCosts,
        address _buyer
    ) public onlySeller {

        IERC721(nftAddress).transferFrom(msg.sender, address(this), nftId);

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

    function approveSale(uint256 nftId) public {
        approval[nftId][msg.sender] = true;
    }

    function finalizeSale(uint256 nftId) public {
        require(inspectionPassed[nftId] == true);
        require(purchasePrice[nftId] >= address(this).balance);
        require(approval[nftId][seller] == true, "seller not approved");
        require(approval[nftId][buyer[nftId]] == true, "buyer not approved");
        require(approval[nftId][lender] == true, "lender not approved");

        isListed[nftId] = false;

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);

        IERC721(nftAddress).approve(buyer[nftId], nftId);

        IERC721(nftAddress).transferFrom(address(this), buyer[nftId], nftId);
    }

    function cancelSale(uint256 nftId) public {
        if (inspectionPassed[nftId] == false) {
            (bool success, ) = payable(buyer[nftId]).call{value: address(this).balance}("");
            require(success);
        } else {
            (bool success, ) = payable(seller).call{value: address(this).balance}("");
            require(success);
        }
    }

    receive() external payable {}

    // GETTERS

    function getSeller() public view returns (address) {
        return seller;
    }

    function getInspector() public view returns (address) {
        return inspector;
    }

    function getLender() public view returns (address) {
        return lender;
    }

    function getEngineContract() public view returns (address) {
        return nftAddress;
    }
}

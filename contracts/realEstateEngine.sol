// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstateEngine is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public currentId;

    constructor() ERC721("RealEstate", "EST") {}

    function mint(string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        currentId = _tokenIds.current();
        _mint(msg.sender, currentId);
        _setTokenURI(currentId, _tokenURI);
        return currentId;
    }
}

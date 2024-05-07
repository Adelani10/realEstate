// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstateEngine is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RealEstate", "EST") {}

    function mint(string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 currentId = _tokenIds.current();
        _mint(msg.sender, currentId);
        _setTokenURI(currentId, _tokenURI);
        return currentId;
    }
}

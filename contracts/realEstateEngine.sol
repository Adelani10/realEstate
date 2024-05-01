// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstateEngine is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RealEstate", "EST") {}

    function mint(string memory _tokenURI, address seller) public  {
        uint256 currentId = _tokenIds.current();
        _mint(seller, currentId);
        _setTokenURI(currentId, _tokenURI);
        _tokenIds.increment();
    }
}

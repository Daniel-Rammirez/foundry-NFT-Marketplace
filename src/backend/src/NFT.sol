// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("New NFT", "NFT") {}

    function mint(string memory _tokenURI) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }
}

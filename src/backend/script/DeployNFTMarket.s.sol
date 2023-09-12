//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract DeployNFTMarket is Script {
    function run() external returns (NFT, Marketplace) {
        vm.startBroadcast();
        NFT nft = new NFT();
        Marketplace marketplace = new Marketplace(1);
        vm.stopBroadcast();
        console.log("Contracts deployed!");
        console.log("Contract address of NFT: ", address(nft));
        console.log("Contract address of Marketplcae: ", address(marketplace));
        return (nft, marketplace);
    }
}

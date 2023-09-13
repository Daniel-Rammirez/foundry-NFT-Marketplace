//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployNFTMarket} from "../../script/DeployNFTMarket.s.sol";
import {NFT} from "../../src/NFT.sol";
import {Marketplace} from "../../src/Marketplace.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DeployMoodNftTest is Test {
    DeployNFTMarket public deployer;
    uint256 constant FEE_PERCENT = 1;
    uint256 constant FIRST_NFT_COUNT = 1;
    NFT nft;
    Marketplace marketplace;

    address USER = makeAddr("user");
    string public constant URI =
        "{'image':'https://nmarketplace.infura-ipfs.io/ipfs/QmWknRXhFJoVLX6hXywpiSYTCojNwhV86CeJ2NendhntDu','price':'200','name':'Zoro','description':'El mejor espadachin de one piece'}";

    function setUp() public {
        deployer = new DeployNFTMarket();
        (nft, marketplace) = deployer.run();
    }

    //////////////////////////////////
    ///// Testing NFT contract ///////
    //////////////////////////////////

    function testMintNFT() public {
        vm.prank(USER);
        nft.mint(URI);
        assert(nft.tokenCount() == FIRST_NFT_COUNT);
        assert(nft.balanceOf(USER) == 1);
    }

    //////////////////////////////////
    // Testing Marketplace contract //
    //////////////////////////////////

    function testFeePercent() public view {
        assert(FEE_PERCENT == marketplace.feePercent());
    }

    function testGetingTheTotalPrice() public {
        uint256 initial_price = 10 ether;
        uint256 expected_total_price = initial_price * (100 + FEE_PERCENT) / 100;
        uint256 token_id = 1;

        vm.startPrank(USER);
        nft.mint(URI);
        nft.setApprovalForAll(address(marketplace), true);
        marketplace.makeItem(IERC721(address(nft)), token_id, initial_price);
        vm.stopPrank();
        assert(marketplace.getTotalPrice(token_id) == expected_total_price);
    }

    function testMakeItem() public {}
}

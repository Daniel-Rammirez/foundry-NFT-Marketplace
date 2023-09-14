//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployNFTMarket} from "../../script/DeployNFTMarket.s.sol";
import {NFT} from "../../src/NFT.sol";
import {Marketplace} from "../../src/Marketplace.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DeployNFTMarketTest is Test {
    DeployNFTMarket public deployer;
    uint256 constant FEE_PERCENT = 1;
    uint256 constant FIRST_NFT_COUNT = 1;
    uint256 constant BALANCE_OF_FIRST_TRANSFER = 1;
    uint256 constant INITIAL_BALANCE = 100 ether;
    NFT nft;
    Marketplace marketplace;

    event Offered(uint256 itemId, address indexed nft, uint256 tokenId, uint256 price, address indexed seller);

    // struct Item {
    //     uint256 itemId;
    //     IERC721 nft;
    //     uint256 tokenId;
    //     uint256 price;
    //     address payable seller;
    //     bool sold;
    // }

    address USER = makeAddr("user");
    address USER2 = makeAddr("user2");
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

    uint256 initial_price = 10 ether;
    uint256 expected_total_price = initial_price * (100 + FEE_PERCENT) / 100;
    uint256 token_id;

    modifier userMintAndMakeItem() {
        vm.startPrank(USER);
        nft.mint(URI);
        token_id = nft.tokenCount();
        nft.setApprovalForAll(address(marketplace), true);
        marketplace.makeItem(IERC721(address(nft)), token_id, initial_price);
        vm.stopPrank();
        _;
    }

    function testGetingTheTotalPrice() public userMintAndMakeItem {
        assert(marketplace.getTotalPrice(token_id) == expected_total_price);
    }

    function testMakeItem() public userMintAndMakeItem {
        // check:
        // itemCount
        assert(token_id == FIRST_NFT_COUNT);
        // transferFrom
        assert(nft.balanceOf(address(marketplace)) == BALANCE_OF_FIRST_TRANSFER);
        assert(nft.ownerOf(token_id) == address(marketplace));
        // mappgin items[itemCount]
        uint256 itemCount = marketplace.itemCount();
        (uint256 _itemCount, IERC721 _nft, uint256 _tokenId, uint256 _price, address seller, bool sold) =
            marketplace.items(itemCount);
        assert(_itemCount == itemCount);
        assert(_nft == nft);
        assert(_tokenId == token_id);
        assert(_price == initial_price);
        assert(seller == address(USER));
        assert(sold == false);
    }

    function testEventMakeItem() public {
        vm.startPrank(USER);
        nft.mint(URI);
        token_id = nft.tokenCount();
        uint256 itemCount = marketplace.itemCount();
        nft.setApprovalForAll(address(marketplace), true);
        vm.expectEmit(true, true, false, false);
        emit Offered(itemCount, address(nft), token_id, initial_price, address(USER));
        marketplace.makeItem(IERC721(address(nft)), token_id, initial_price);
        vm.stopPrank();
    }

    function testRevertPriceNotEnough() public {
        uint256 PRIZE_ZERO = 0;
        vm.startPrank(USER);
        nft.mint(URI);
        token_id = nft.tokenCount();
        nft.setApprovalForAll(address(marketplace), true);
        vm.expectRevert();
        marketplace.makeItem(IERC721(address(nft)), token_id, PRIZE_ZERO);
        vm.stopPrank();
    }

    function testRevertErrorItemDoesNotExist() public userMintAndMakeItem {
        uint256 FAKE_ITEM_ID = 10;
        vm.prank(USER2);
        vm.expectRevert("item doesn't exist");
        marketplace.purchaseItem(FAKE_ITEM_ID);
    }

    function testRevertErrorNotEnoughETH() public userMintAndMakeItem {
        // vm.prank(USER2);
        hoax(USER2, INITIAL_BALANCE); // prank but with a fund user
        vm.expectRevert("not enough ether to cover item price and market fee");
        marketplace.purchaseItem{value: 5 ether}(token_id);
    }
}

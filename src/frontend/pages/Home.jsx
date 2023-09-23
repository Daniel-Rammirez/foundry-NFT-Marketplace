// import { ethers } from "ethers";
// import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ListItems } from "../components/ListItems";

/* eslint-disable react/prop-types */
export function Home({ marketplace, nft }) {
  const [loading, setLoading] = useState(true);
  const [NFTs, setNFTs] = useState([]);

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    const items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (item.sold) return;
      // Get URI URL from nft Contract
      const uri = await nft.tokenURI(item.tokenId);
      // console.log(uri);
      // Use uri to fetch the nft metadata stored on ipfs
      const response = await fetch(uri);
      const metadata = await response.json();
      // console.log(metadata);
      // Get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(item.itemId);
      // const totalPrice = Number(totalPriceData);
      // Add item to items array
      items.push({
        totalPrice: totalPrice,
        itemId: item.itemId,
        seller: item.seller,
        name: metadata.NFT_name,
        description: metadata.NFT_description,
        image: metadata.NFT_image,
      });
    }
    setLoading(false);
    setNFTs(items);
  };
  // console.log("NFTs", NFTs[0]);
  // const hope = NFTs[0].totalPrice;
  // console.log("Nfts ", hope.toString());
  // console.log(ethers.formatEther("1010000000000000000"));

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  if (loading)
    return (
      <main>
        <h2>Loading...</h2>
      </main>
    );

  return (
    <div>
      {NFTs.length > 0 ? (
        <ListItems itemsArray={NFTs} />
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}

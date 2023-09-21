// import { ethers } from "ethers";
// import { ethers } from "ethers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

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
        <ul>
          {NFTs.map((NFT) => {
            return (
              <li key={NFT.itemId}>
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="place-content-center item-center">
                    <img
                      className="p-8 rounded-t-lg"
                      src={NFT.image}
                      alt={`image of ${NFT.name}`}
                    />
                  </div>

                  <div className="px-5 pb-5">
                    <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {NFT.name}
                    </h5>
                    <p className=" tracking-tight text-gray-500 dark:text-white">
                      {NFT.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${ethers.formatEther(NFT.totalPrice.toString())}
                      </span>
                      <a
                        href="#"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Buy
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}

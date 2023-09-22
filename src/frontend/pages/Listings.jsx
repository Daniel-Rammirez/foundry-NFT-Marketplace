import { ethers } from "ethers";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const SoldItems = ({ soldNFT }) => {
  return (
    <div>
      <h2 className="text-2xl my-4">Sold Items</h2>
      {soldNFT.length > 0 ? (
        <ul className="flex flex-row gap-4 mx-4 my-4">
          {soldNFT.map((NFT) => {
            return (
              <li key={NFT.itemId}>
                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="place-content-center item-center">
                    <img
                      className="p-8 rounded-t-lg object-contain h-96 w-96"
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
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>{"You don't have sold items yet"}</h2>
        </main>
      )}
    </div>
  );
};

/* eslint-disable react/prop-types */
export function Listings({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedNFT, setListedNFT] = useState([]);
  const [soldNFT, setSoldNFT] = useState([]);

  async function loadListedItems() {
    const listedItems = [];
    const soldItems = [];
    /* eslint-disable react/prop-types */
    const itemCount = await marketplace.itemCount();
    for (let indx = 1; indx <= itemCount; indx++) {
      console.log(indx);
      // Get the NFT info for that id
      const nftItem = await marketplace.items(indx);
      // console.log("account: ", account);
      // Verify the NFT owner
      if (nftItem.seller.toLowerCase() !== account) return;
      // Get NFT uri
      const nftUri = await nft.tokenURI(nftItem.tokenId);
      // fetch to get the response
      const response = await fetch(nftUri);
      // Transform to json
      const metadata = await response.json();
      console.log(metadata);
      // Get totalPrice
      const totalPrice = await marketplace.getTotalPrice(nftItem.itemId);
      // Create item and add it to array
      let item = {
        totalPrice: totalPrice,
        name: metadata.NFT_name,
        description: metadata.NFT_description,
        image: metadata.NFT_image,
        price: metadata.price,
        itemId: nftItem.itemId,
      };
      listedItems.push(item);
      // And if is sold, add it to the other array too
      if (nftItem.sold) soldItems.push(item);
    }
    // Set both states with the final items arrays
    setListedNFT(listedItems);
    setSoldNFT(soldItems);
    setLoading(false);
  }
  console.log(listedNFT);

  useEffect(() => {
    loadListedItems();
  }, []);

  if (loading) {
    return (
      <main className="text-2xl my-4">
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div>
      {listedNFT.length > 0 ? (
        <>
          <h2 className="text-2xl my-4">Listed Items</h2>
          <ul className="flex flex-row gap-4 mx-4 my-4">
            {listedNFT.map((NFT) => {
              return (
                <li key={NFT.itemId}>
                  <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="place-content-center item-center">
                      <img
                        className="p-8 rounded-t-lg object-contain h-96 w-96"
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
          <div>
            <SoldItems soldNFT={soldNFT} />
          </div>
        </>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>{"You don't have listed assets"}</h2>
        </main>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { ListItems } from "../components/ListItems";

/* eslint-disable react/prop-types */
export function Purchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchasedNFTs, setPurchasedNfts] = useState([]);

  const purchaseItems = async () => {
    // const purchasedItems = [];
    // Create the filter for the event Bought in marketplace
    const filter = await marketplace.filters.Bought(
      null,
      null,
      null,
      null,
      null,
      account
    );
    // Now we filter using queryFilter and obtain an array of events that match with the filter
    const results = await marketplace.queryFilter(filter);
    // Now we can map through the array and return a new array with the nft items
    const items = await Promise.all(
      results.map(async (element) => {
        element = element.args;
        // console.log(element);
        const uri = await nft.tokenURI(element.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketplace.getTotalPrice(element.itemId);
        return {
          totalPrice: totalPrice,
          itemId: element.itemId,
          name: metadata.NFT_name,
          description: metadata.NFT_description,
          image: metadata.NFT_image,
        };
      })
    );
    setPurchasedNfts(items);
    setLoading(false);
  };
  useEffect(() => {
    purchaseItems();
  }, []);

  return (
    <>
      {loading ? (
        <main>
          <p>Loading...</p>
        </main>
      ) : (
        <ListItems itemsArray={purchasedNFTs} isHomePage={false} />
      )}
    </>
  );
}

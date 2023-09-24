import { useEffect, useState } from "react";
import { ListItems } from "../components/ListItems";

/* eslint-disable react/prop-types */
const SoldItems = ({ soldNFT }) => {
  return (
    <div>
      <h2 className="text-2xl my-4">Sold Items</h2>
      {soldNFT.length > 0 ? (
        <ListItems itemsArray={soldNFT} />
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
      // Get the NFT info for that id
      const nftItem = await marketplace.items(indx);
      // console.log("account: ", account);
      // Verify the NFT owner
      if (nftItem.seller.toLowerCase() == account) {
        // Get NFT uri
        const nftUri = await nft.tokenURI(nftItem.tokenId);
        // fetch to get the response
        const response = await fetch(nftUri);
        // Transform to json
        const metadata = await response.json();
        // console.log(metadata);
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
        if (nftItem.sold) soldItems.push(item);
        // And if is sold, add it to the other array too
      }
    }
    // Set both states with the final items arrays
    setListedNFT(listedItems);
    setSoldNFT(soldItems);
    setLoading(false);
  }
  // console.log(listedNFT);

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
      {listedNFT.length > 0 || soldNFT.length ? (
        <>
          <h2 className="text-2xl my-4">My Listed Items</h2>
          <ListItems itemsArray={listedNFT} isHomePage={false} />
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

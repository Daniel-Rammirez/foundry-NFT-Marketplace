import { useState } from "react";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

const REACT_APP_API_KEY = "2VBl0610uzMx4lxoP5NDgrIqcdQ";
const REACT_APP_API_KEY_SECRET = "a5cca43e3b4e6cd5ea1c29ffa7d6135b";
// console.log(import.meta.env);

const auth =
  "Basic " +
  Buffer.from(REACT_APP_API_KEY + ":" + REACT_APP_API_KEY_SECRET).toString(
    "base64"
  );

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

/* eslint-disable react/prop-types */
export function Create({ marketplace, nft }) {
  const [data, setData] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
  });
  const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        console.log(result);
        setData((prevState) => ({
          ...prevState,
          image: `https://nmarketplace.infura-ipfs.io/ipfs/${result.path}`,
        }));
        // setImage(`https://nmarketplace.infura-ipfs.io/ipfs/${result.path}`);
      } catch (error) {
        console.log("ipfs image upload error: ", error);
      }
    }
  };
  const createNFT = async () => {
    if (!data.image || !data.price || !data.name || !data.description) return;
    const NFT_image = data.image;
    const NFT_price = data.price;
    const NFT_name = data.name;
    const NFT_description = data.description;
    try {
      const result = await client.add(
        JSON.stringify({ NFT_image, NFT_price, NFT_name, NFT_description })
      );
      console.log("NFT created! ", result);
      mintThenList(result);
    } catch (error) {
      console.log("ipfs uri upload error: ", error);
    }
  };

  const mintThenList = async (result) => {
    const uri = `https://nmarketplace.infura-ipfs.io/ipfs/${result.path}`;
    // mint nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.target, true)).wait();
    // add nft to marketplace
    const NFT_price = data.price;
    const listingPrice = ethers.parseEther(NFT_price.toString());
    await (await marketplace.makeItem(nft.target, id, listingPrice)).wait();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const { jsonMetadata } = await loadImage(data);
    // console.log(jsonMetadata);
    createNFT();
  };

  const handleChange = (event) => {
    const inputName = event.target.name;
    setData((prevState) => ({ ...prevState, [inputName]: event.target.value }));
  };
  // console.log(data);

  return (
    <>
      <h1>Create NFT</h1>
      <form className="px-4 py-3 rounded-full" onSubmit={handleSubmit}>
        <section className="form-input">
          <input type="file" onChange={uploadToIPFS} />
        </section>
        <section className="rounded text-pink-500">
          <label>Name</label>
          <input
            className="rounded text-pink-500"
            autoComplete="off"
            name="name"
            value={data.name}
            onChange={handleChange}
            type="text"
          />
        </section>
        <section className="form-input">
          <label>Description</label>
          <input
            autoComplete="off"
            name="description"
            value={data.description}
            onChange={handleChange}
            type="text"
          />
        </section>
        <section className="form-input">
          <label>ETH price</label>
          <input
            autoComplete="off"
            name="price"
            value={data.price}
            onChange={handleChange}
            type="number"
          />
        </section>
        <button>Create NFT</button>
      </form>
    </>
  );
}

import { useState } from "react";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.image || !data.price || !data.name || !data.description) return;
    try {
      createNFT();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const inputName = event.target.name;
    setData((prevState) => ({ ...prevState, [inputName]: event.target.value }));
  };
  // console.log(data);

  return (
    <div className="flex justify-center">
      {/* <p className="text-2xl">Create NFT</p> */}
      <form
        className="border w-96 rounded-lg px-4 py-3 flex flex-col gap-3 m-4 justify-center"
        onSubmit={handleSubmit}
      >
        <section className="form-input">
          <input type="file" onChange={uploadToIPFS} />
        </section>
        <section className="text-500 text-2xl">
          <label>Name</label>
        </section>
        <input
          className="rounded-lg h-8"
          autoComplete="off"
          name="name"
          value={data.name}
          onChange={handleChange}
          type="text"
        />
        <section className="form-input text-2xl">
          <label>Description</label>
        </section>
        <textarea
          className="rounded-lg"
          autoComplete="off"
          name="description"
          value={data.description}
          onChange={handleChange}
          type="text"
        />
        <section className="form-input text-2xl">
          <label>ETH price</label>
        </section>
        <input
          className="rounded-lg h-8"
          autoComplete="off"
          name="price"
          value={data.price}
          onChange={handleChange}
          type="number"
        />
        <button>Create NFT</button>
      </form>
    </div>
  );
}

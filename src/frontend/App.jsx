import "./App.css";
import { NavBar } from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Purchases } from "./pages/Purchases";
import { Listings } from "./pages/Listings";
import { Create } from "./pages/Create";
import MarketplaceAbi from "../frontend/contractsData/Marketplace.json";
import NFTAbi from "../frontend/contractsData/NFT.json";
import MarketplaceAddress from "../frontend/contractsData/Marketplace-address.json";
import NFTAddress from "../frontend/contractsData/NFT-address.json";
import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [loading, setloading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNft] = useState({});
  const [marketplace, setMarketplace] = useState({});

  // Metamask Login/Connect
  const web3Handler = async () => {
    if (typeof window === "undefined") {
      // We are on the server, exit early.
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      // Get provider from Metamask
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Set signer
      const signer = await provider.getSigner();

      window.ethereum.on("accountsChanged", async function (accounts) {
        setAccount(accounts[0]);
        await web3Handler();
      });
      loadContracts(signer);
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    setMarketplace(marketplace);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNft(nft);
    setloading(false);
  };
  // console.log("funcionando market ", marketplace);
  // console.log("funcionando nft ", nft);

  return (
    <>
      <div className="p-5 bg-zinc-600 shadow flex-wrap">
        <NavBar web3Handler={web3Handler} account={account} />
      </div>
      {loading ? (
        <p className="my-5 text-2xl">Awaiting Metamask Connection...</p>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<Home marketplace={marketplace} nft={nft} />}
          />
          <Route
            path="/Create"
            element={<Create marketplace={marketplace} nft={nft} />}
          />
          <Route
            path="/Listings"
            element={
              <Listings marketplace={marketplace} nft={nft} account={account} />
            }
          />
          <Route path="/Purchases" element={<Purchases />} />
        </Routes>
      )}
    </>
  );
}

export default App;

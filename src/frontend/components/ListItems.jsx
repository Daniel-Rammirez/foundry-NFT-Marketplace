// TODO: refactoring list items to show nft
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

/* eslint-disable react/prop-types */

const FooterCard = ({ sold, NFT, buyItem }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  if (currentPath == "/Listings") {
    if (sold) {
      return (
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          Item sold for {NFT.price} ETH
        </span>
      );
    } else {
      return (
        <>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {ethers.formatEther(NFT.totalPrice.toString())} ETH
          </span>
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Cancel
          </button>
        </>
      );
    }
  } else if (currentPath == "/") {
    return (
      <>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {ethers.formatEther(NFT.totalPrice.toString())} ETH
        </span>
        <button
          onClick={() => buyItem(NFT)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Buy
        </button>
      </>
    );
  } else {
    return (
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        Item purchased for {ethers.formatEther(NFT.totalPrice.toString())} ETH
      </span>
    );
  }
};

export function ListItems({ itemsArray, sold, buyItem }) {
  return (
    <ul className="flex flex-row gap-4 mx-4 my-4">
      {itemsArray.map((NFT) => {
        return (
          <li key={NFT.itemId}>
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <img
                className="p-8 rounded-t-lg object-contain h-96 w-96"
                src={NFT.image}
                alt={`image of ${NFT.name}`}
              />

              <div className="px-5 pb-5">
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {NFT.name}
                </h5>
                <p className=" tracking-tight text-gray-500 dark:text-white">
                  {NFT.description}
                </p>

                <div className="flex items-center justify-between">
                  <FooterCard NFT={NFT} sold={sold} buyItem={buyItem} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

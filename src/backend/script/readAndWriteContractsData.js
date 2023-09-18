import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathContractAddressJSON = path.join(
  __dirname,
  "../broadcast/DeployNFTMarket.s.sol/31337/run-latest.json"
);
const pathContractJSON = (contractName) => {
  return path.join(
    __dirname,
    `../out/${contractName}.sol/${contractName}.json`
  );
};
const readAddressContractJSON = async () => {
  const addressData = await fs.readFileSync(pathContractAddressJSON, "utf-8");
  const addressDataJSON = JSON.parse(addressData);
  const tx = addressDataJSON.transactions;
  const contractAddressNFT = tx[0].contractAddress;
  const contractAddressMarketplace = tx[1].contractAddress;
  return { contractAddressNFT, contractAddressMarketplace };
};

const readContractDataJSON = async () => {
  const contractNFTData = await fs.readFileSync(
    pathContractJSON("NFT"),
    "utf-8"
  );
  const contractNFTJSON = JSON.parse(contractNFTData);

  const contractMarketplaceData = await fs.readFileSync(
    pathContractJSON("Marketplace"),
    "utf-8"
  );
  const contractMarketplaceJSON = JSON.parse(contractMarketplaceData);
  return { contractNFTJSON, contractMarketplaceJSON };
};

function saveFrontendFilesAddress(contractAddress, fileName) {
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${fileName}-address.json`,
    JSON.stringify({ address: contractAddress }, undefined, 2)
  );

  // const contractArtifact = artifacts.readArtifactSync(name);
}

const saveFrontendFilesContract = (contractData, fileName) => {
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${fileName}.json`,
    JSON.stringify(contractData, null, 2)
  );
};

const showDataAndWriteFile = async () => {
  const { contractAddressNFT, contractAddressMarketplace } =
    await readAddressContractJSON();
  const { contractNFTJSON, contractMarketplaceJSON } =
    await readContractDataJSON();
  console.log("NFT address: ", contractAddressNFT);
  saveFrontendFilesAddress(contractAddressNFT, "NFT");
  saveFrontendFilesContract(contractNFTJSON, "NFT");
  console.log("Marketplace address: ", contractAddressMarketplace);
  saveFrontendFilesAddress(contractAddressMarketplace, "Marketplace");
  saveFrontendFilesContract(contractMarketplaceJSON, "Marketplace");
};

showDataAndWriteFile();

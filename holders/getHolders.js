const axios = require("axios").default;
const ethers = require("ethers");
const {
  tokenIds,
  addresses,
  alchemyKey,
  ethAlchemyKey,
} = require("./variables.js");
const fs = require("fs/promises");

const main = async () => {
  // initialize headers for csv file
  await fs.appendFile("./numberHeldByAddress.csv", "address,numHeld\n");
  const openseaContract = "0x2953399124F0cBB46d2CbACD8A89cF0599974963";
  const baseURL = `https://polygon-mainnet.g.alchemyapi.io/v2/${alchemyKey}/getNFTs/`;

  // initialize provider to resovle ens names
  const ethProvider = new ethers.providers.AlchemyProvider(
    (network = "homestead"),
    ethAlchemyKey
  );

  // loop over all the addresses
  for (i = 0; i < addresses.length; i++) {
    if (addresses[i].slice(-4) == ".eth") {
      addresses[i] = await ethProvider.resolveName(addresses[i]);
    }

    const config = {
      method: "get",
      url: `${baseURL}?owner=${addresses[i]}&contractAddresses[]=${openseaContract}`,
    };

    try {
      // query alchemy node for all token transactions
      let response = await axios(config);
      if (response) {
        response = response.data.ownedNfts;
      }

      let numHeld = 0;

      // loop over number of ERC1155 transactions for each asset
      for (j = 0; j < response.length; j++) {
        let id = response[j].id.tokenId;

        // check if token id returned is in the list of blockchain guild token ids
        if (tokenIds.includes(id.toUpperCase())) {
          numHeld++;
        }
      }
      console.log(`${addresses[i]} holds ${numHeld} blockchain guild tokens`);

      // write to csv file
      await fs.appendFile(
        "./numberHeldByAddress.csv",
        `${addresses[i]},${numHeld}\n`
      );
    } catch (error) {
      console.log(error);
      fs.appendFile("./numberHeldByAddress.csv", `${addresses[i]},${null}\n`);
    }
  }
};

main();

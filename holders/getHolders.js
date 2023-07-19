const axios = require("axios").default
const ethers = require("ethers")
const { tokenIds, addresses } = require("./holderVariables.js")
const fs = require("fs/promises")
require("dotenv").config({ path: require("find-config")(".env") })

const main = async () => {
  // grab .env vars
  const alchemyPolygonKey = process.env.ALCHEMY_POLYGON_KEY
  const alchemyEthKey = process.env.ALCHEMY_ETH_KEY

  // initialize headers for csv file
  await fs.appendFile("./numberHeldByAddress.csv", "address,numHeld\n")
  const openseaContract = process.env.OPENSEA_1155_ADDRESS
  const baseURL = `https://polygon-mainnet.g.alchemyapi.io/v2/${alchemyPolygonKey}/getNFTs/`

  // initialize provider to resovle ens names
  const ethProvider = new ethers.providers.AlchemyProvider((network = "homestead"), alchemyEthKey)

  // loop over all the addresses
  for (i = 0; i < addresses.length; i++) {
    await fs.appendFile("./numberHeldByAddress.csv", `${addresses[i]},`)

    // resolve ens names to address
    if (addresses[i].slice(-4) == ".eth") {
      addresses[i] = await ethProvider.resolveName(addresses[i])
    }

    // build request body
    const config = {
      method: "get",
      url: `${baseURL}?owner=${addresses[i]}&contractAddresses[]=${openseaContract}`,
    }

    try {
      // query alchemy nft api for tokens owned by address
      let response = await axios(config)
      if (response) {
        response = response.data.ownedNfts
      }

      let numHeld = 0

      // loop over number of ERC1155 tokens owned by address
      for (j = 0; j < response.length; j++) {
        let id = response[j].id.tokenId

        // check if token id returned is in the list of blockchain guild token ids
        if (tokenIds.includes(id.toUpperCase())) {
          numHeld++
        }
      }
      // write to csv file
      await fs.appendFile("./numberHeldByAddress.csv", `${numHeld}\n`)

      console.log(`${addresses[i]} holds ${numHeld} blockchain guild tokens`)
    } catch (error) {
      console.error(error)
      fs.appendFile("./numberHeldByAddress.csv", `${null}\n`)
    }
  }
}

main()

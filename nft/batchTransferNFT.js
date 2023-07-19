const ethers = require("ethers")
const fs = require("fs/promises")
const { addresses } = require("./nftVariables.js")
const { abi } = require("./opensea1155Abi")
require("dotenv").config({ path: require("find-config")(".env") })

const main = async () => {
  const alchemyPolygonKey = process.env.ALCHEMY_POLYGON_KEY
  const alchemyEthKey = process.env.ALCHEMY_ETH_KEY
  const privateKey = process.env.PRIVATE_KEY
  const address = process.env.OPENSEA_1155_ADDRESS
  const tokenId = process.env.TOKEN_ID

  // Connect to Alchemy, initialize wallet, and create signer by connecting to provider
  const polygonProvider = new ethers.providers.AlchemyProvider(
    (network = "matic"),
    alchemyPolygonKey
  )
  const wallet = new ethers.Wallet(privateKey)
  const walletSigner = wallet.connect(polygonProvider)

  // ETH provider used to resolve ENS names
  const ethProvider = new ethers.providers.AlchemyProvider((network = "homestead"), alchemyEthKey)

  // Get contract abi and initialize contract instance with signer
  const contract = new ethers.Contract(address, abi, walletSigner)

  // Grab first nonce to be used in transactions and increment it at the bottom of each loop
  let nonce = await polygonProvider.getTransactionCount(wallet.address, "latest")

  let numSent = 0
  for (i = 0; i < addresses.length; i++) {
    // resolve ens names to address
    if (addresses[i].slice(-4) == ".eth") {
      addresses[i] = await ethProvider.resolveName(addresses[i].toString())
    }

    const gas = await polygonProvider.getGasPrice()
    console.log(gas)
    const overrides = {
      value: ethers.utils.parseUnits("0", "ether"),
      gasPrice: gas,
      nonce: nonce,
    }

    try {
      // Transfer token to address
      const transaction = await contract.safeTransferFrom(
        wallet.address,
        addresses[i],
        tokenId,
        1,
        "0x00",
        overrides
      )
      console.log(transaction)
      numSent++
    } catch (err) {
      console.log(err)
      fs.appendFile("./errors.txt", `Token transfer to address ${addresses[i]} failed.\n`)
    }
    nonce++

    // Sleep for half a second at the bottom of the loop to avoid Alchemy rate limits
    await new Promise((r) => setTimeout(r, 500))
  }
  console.log("--------------DONE-------------")
  console.log(`Airdropped ${numSent} NFTs`)
}

main()

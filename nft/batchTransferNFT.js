const ethers = require("ethers")
const fs = require("fs/promises")
const { addresses } = require("./nftVariables.js")
const { getABI } = require("../utils/helpers.js")
require("dotenv").config({ path: require("find-config")(".env") })

const main = async () => {
  const alchemyPolygonKey = process.env.ALCHEMY_POLYGON_KEY
  const alchemyEthKey = process.env.ALCHEMY_ETH_KEY
  const privateKey = process.env.PRIVATE_KEY
  const address = "0x2953399124F0cBB46d2CbACD8A89cF0599974963" // Opensea ERC1155 contract
  // const tokenId = "19131355645574737609070377326422335114467302896084141022817982401458271683060" // super holder nft
  // const tokenId = ""

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
  const abi = await getABI(address)
  const contract = new ethers.Contract(address, abi, walletSigner)

  // Grab first nonce to be used in transactions and increment it at the bottom of each loop
  let nonce = await polygonProvider.getTransactionCount(wallet.address, "latest")

  for (i = 0; i < addresses.length; i++) {
    // resolve ens names to address
    if (addresses[i].slice(-4) == ".eth") {
      addresses[i] = await ethProvider.resolveName(addresses[i])
    }

    const gas = await polygonProvider.getGasPrice()

    console.log(gas)
    const overrides = {
      value: ethers.utils.parseUnits("0", "ether"),
      gasPrice: gas,
      gasLimit: ethers.utils.hexlify(100000),
      nonce: nonce,
    }

    // try {
    //   // Transfer token to address
    //   const transaction = await contract.safeTransferFrom(
    //     wallet.address,
    //     addresses[i],
    //     tokenId,
    //     1,
    //     "0x00",
    //     overrides
    //   )
    //   console.log(transaction)
    // } catch (err) {
    //   console.log(err)
    //   fs.appendFile("./errors.txt", `Token transfer to address ${addresses[i]} failed.\n`)
    // }
    // nonce++
  }
}

main()

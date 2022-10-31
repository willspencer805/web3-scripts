const ethers = require("ethers")
require("dotenv").config({ path: require("find-config")(".env") })
const fs = require("fs/promises")

const main = async () => {
  var key

  process.argv[2] == "homestead"
    ? (key = process.env.ALCHEMY_ETH_KEY)
    : (key = process.env.ALCHEMY_POLYGON_KEY)

  const provider = new ethers.providers.AlchemyProvider((network = process.argv[2]), key)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  let nonce = await provider.getTransactionCount(wallet.address, "latest")
  for (i = 0; i < addresses.length; i++) {
    const gas = await provider.getGasPrice()
    const tx = {
      from: wallet.address,
      to: addresses[i],
      value: ethers.utils.parseUnits(process.argv[3], "ether"),
      gasPrice: gas,
      gasLimit: ethers.utils.hexlify(100000),
      nonce: nonce,
    }

    try {
      const transaction = await wallet.sendTransaction(tx)
      console.log(transaction)
      nonce++
    } catch (err) {
      console.log(err)
      fs.appendFile(
        "./errors.txt",
        `Transfer to address ${addresses[i]} failed with error: \n${err}\n,`
      )
    }
  }
}

main()

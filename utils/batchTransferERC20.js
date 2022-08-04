const ethers = require("ethers")
const { addresses, privateKey, infuraKey } = require("./variables.js")

const main = async () => {
  const provider = new ethers.providers.InfuraProvider((network = "matic"), infuraKey)
  const wallet = new ethers.Wallet(privateKey)
  const walletSigner = wallet.connect(provider)

  let nonce = await provider.getTransactionCount(wallet.address, "latest")
  for (i = 0; i < addresses.length; i++) {
    const gas = await provider.getGasPrice()
    const tx = {
      from: wallet.address,
      to: addresses[i],
      value: ethers.utils.parseUnits("25", "ether"),
      gasPrice: gas,
      gasLimit: ethers.utils.hexlify(100000),
      nonce: nonce,
    }

    try {
      const transaction = await walletSigner.sendTransaction(tx)
      console.log(transaction)
      nonce++
    } catch (err) {
      console.log(err)
    }
  }
}

main()

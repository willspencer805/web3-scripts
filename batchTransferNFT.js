const ethers = require('ethers');
const { privateKey, addresses, infuraKey } = require('./variables.js');
const { getABI } = require('./helpers.js');

const main = async () => {
    const address = '0x2953399124F0cBB46d2CbACD8A89cF0599974963'; // Opensea ERC1155 contract
    const tokenId = '19131355645574737609070377326422335114467302896084141022817982400358760054909'; 

    // Connect to Infura, initialize wallet, and create signer by connecting to provider
    const provider = new ethers.providers.InfuraProvider(network='matic', infuraKey);
    const wallet = new ethers.Wallet(privateKey);
    const walletSigner = wallet.connect(provider);

    // Get contract abi and initialize contract instance with signer
    const abi = await getABI(address);
    const contract = new ethers.Contract(address, abi, walletSigner)
    
    // Grab first nonce to be used in transactions and increment it at the bottom of each loop 
    let nonce = await provider.getTransactionCount(wallet.address, 'latest');
    for(i=0; i < addresses.length; i++) {
        const gas = await provider.getGasPrice();
        const overrides = {
            value: ethers.utils.parseUnits("0", "ether"),
            gasPrice: gas,
            gasLimit: ethers.utils.hexlify(100000),
            nonce: nonce,
        }

        try {
            const transaction = await contract.safeTransferFrom(wallet.address, addresses[i], tokenId, 1, "0x00", overrides);
            console.log(transaction);
        } catch(err) {
            console.log(err);
        }
        nonce++;   
    }

}

main();
This repo has a number of utility scripts to make transactions easier on-chain.

## Getting Started

1. Install dependencies using `npm install` or `yarn install`
2. Create a `.env` file in the same format as `env.example`
   1. You'll need to create an Alchemy account (for free) and get 2 keys, 1 for Eth Mainnet and the other for Polygon Mainnet
   2. Copy the private key from whatever EOA you're sending transactions from
   3. Copy the contract address of the contract you're sending transactions to (right now this is configured to send transactions to Opensea's 1155 contract)
   4. Get the token id of the NFT you'd like to transfer from Opensea (required for NFT transfer)

## NFT Transfer

The purpose of this script is to make batch transferring of NFTs much easier for contracts that don't enable it. Before running it, populate the `addresses` list in `nftVariables.js` with the list of addresses to airdrop to.

To run the script:

```
cd nft
node batchTransferNFT.js
```

Occasionally, transactions will get stuck in the mempool because Polygon gas estimation is iffy at best. You'll be able to see this has occurred on Opensea (or any marketplace) by checking the total number of holders for the given token. If this has happened, wait for an hour and try again (make sure you remove the list of addresses who successfully recieved the token from the `addresses` list)

## Holders

The holders script is intended to get a count of how many tokens an account has for a given collection. It was primarily used for "Blockchain Guild games" but has other use cases.

In `holderVariables.js` you'll need two things:

1. A list of token ids to check (in hexadecimal)
2. A list of addresses to search over

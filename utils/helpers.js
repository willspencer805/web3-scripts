const axios = require("axios").default

const polygonscanKey = process.env.POLYGONSCAN_KEY

// uses polygonscan's api to get the ABI of the given contract address
async function getABI(address) {
  endpoint = "https://api.polygonscan.com/api?module=contract&action=getabi&address="
  let src = endpoint + address + polygonscanKey

  let response = await axios.get(src)
  // console.log(response.data.result)
  return response.data.result
}

module.exports = { getABI }

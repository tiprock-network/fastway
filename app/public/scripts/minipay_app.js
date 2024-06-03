const {getContract,formatEther,createPublicClient,http,createWalletClient} = require('viem')
const {mainnet,celo} =require('viem/chains')
const {stableTokenABI} =require('@celo/abis')

const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const addressBox = document.getElementById('addressBox')
const client = createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum),
})
const [address] = await client.getAddresses()

addressBox.innerHTML = `<p>${address}</p>`


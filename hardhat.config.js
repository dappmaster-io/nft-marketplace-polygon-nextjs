require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_POLYGON_MUMBAI_TEST_NET_PROJECT_ID}`,
      accounts: [process.env.META_MASK_ACCOUNT_PRIVATE_KEY],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_POLYGON_MAIN_NET_PROJECT_ID}`,
      accounts: [process.env.META_MASK_ACCOUNT_PRIVATE_KEY],
    },
  },
}

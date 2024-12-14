// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  compilers: {
    solc: {
        version: "0.8.0", // Specify the version you want to use
        // You can also specify settings if needed
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
},
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    }
  }
}

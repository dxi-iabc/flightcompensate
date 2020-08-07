module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      gas: 4700000,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.5.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
        }
      }
    }
  }
}

const Maket = require('./contracts/Maket.json');
const Auctions = require('./contracts/Auctions.json');

export default {
    MAKET_CA: '0x02Bf34B22350e7447294526b813b0913A2Fc1b05',
    AUCTIONS_CA:'0x296a0DE64536d84Bb4Aed57b1d92C15f9Ee2E87e',
    MAKET_ABI: Maket.abi,
    AUCTIONS_ABI: Auctions.abi,

    GAS_AMOUNT: 500000
}
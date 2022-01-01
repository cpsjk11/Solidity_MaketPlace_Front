const Maket = require('./contracts/Maket.json');
const Auctions = require('./contracts/Auctions.json');

export default {
    MAKET_CA: '0x77437dDd8cf13f40ABD0516e9999a56C3afD1497',
    AUCTIONS_CA:'0x5F9A710A4d20e9C0A72391558f470Dce7c6Cc70c',
    MAKET_ABI: Maket.abi,
    AUCTIONS_ABI: Auctions.abi,

    GAS_AMOUNT: 500000
}
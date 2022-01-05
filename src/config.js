/*
    이와 같이 config.js를 만들어 블록체인 상의 배포된 스마트 컨트랙을 
    이용하기 위해 프론트 단에서 complie된 json 파일을 가져와 사용한다.
*/
const Maket = require('./contracts/Maket.json'); // 해당 json파일의 위치를 참조해 Maket이라는 변수에 담았다.
const Auctions = require('./contracts/Auctions.json');

export default {
    MAKET_CA: '0x02Bf34B22350e7447294526b813b0913A2Fc1b05', // 해당 스마트컨트랙이 배포된 주소
    AUCTIONS_CA:'0x296a0DE64536d84Bb4Aed57b1d92C15f9Ee2E87e', 
    MAKET_ABI: Maket.abi, // abi는 배포된 스마트 컨트랙을 사용하기 위해서 abi라는 자료를 사용하기 위해 따로 변수에 담아 두었다.
    AUCTIONS_ABI: Auctions.abi,

    GAS_AMOUNT: 500000
}
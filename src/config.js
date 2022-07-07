/*
    이와 같이 config.js를 만들어 블록체인 상의 배포된 스마트 컨트랙을 
    이용하기 위해 프론트 단에서 complie된 json 파일을 가져와 사용한다.
*/
const Maket = require('./contracts/Maket.json'); // 해당 json파일의 위치를 참조해 Maket이라는 변수에 담았다.
const Auctions = require('./contracts/Auctions.json');
const MyToken = require('./contracts/MyToken.json');

export default {
    MAKET_CA: '0xDB4628d26Fc557584cE176b1e1223CA108ad50De', // 해당 스마트컨트랙이 배포된 주소
    AUCTIONS_CA:'0x199CC8cAC79cD8b900A93c9B341873Ded98bDF36', 
    MYTOKEN_CA: '0x1c050cba93006c15fd763a737e383cc55f8567f1',
    MAKET_ABI: Maket.abi, // abi는 배포된 스마트 컨트랙을 사용하기 위해서 abi라는 자료를 사용하기 위해 따로 변수에 담아 두었다.
    AUCTIONS_ABI: Auctions.abi,
    MYTOKEN_ABI: MyToken.abi,

    GAS_AMOUNT: 500000
}
<template>
  <div class="containWrap"> 
        <!-- 카드 레이아웃을 사용했다 -->
      <v-card class="cardG">
        <div>                 
          <p class="text-center address">
             {{account}} <span class="reftxt">(현재주소)</span>
          </p>
          <p class="text-center balance">
             {{balance}} Ether <span class="reftxt">(잔액)</span>
          </p>
        </div>
      </v-card>
           
      <h2>토큰 보내기</h2>
      <!-- 
          change 이벤트를 사용하여 값이 바뀔때 마다 "selectedAuction" 의 값이 변경된다! 
          바뀐 값이 있을 때 마다 'selectedAuction'에 대입이 되기 때문에 다른 옥션 아이디를 선택하면 각각의 토큰들을 볼 수 있게 된다.
          만약 자신만이 가지고 있는 NFT만 보고 싶다면 추가적으로 if문을 걸어 현재 주소와 옥션들의 주소를 비교해 있는 것만 표현 할 수 있을 것 같다.
       -->
      <v-select v-model="selectedAuction" :items="auctionIds" label="소유한 토큰들" @change="getAuctionById"></v-select>
      <div v-show="selectedAuction">
        <h3>My NFT</h3>
        <div>제목: {{auctionInfo.title}}</div>
        <div>가격: {{auctionInfo.price}} Ether</div>
        <div>토큰아이디: {{auctionInfo.tokenId}}</div>
        <div>소유자: {{auctionInfo.owner}}</div>
      </div>

      <v-text-field
        v-model="toAddress"
        label="To Address"
        required
      ></v-text-field>

      <v-btn @click="finalizeAuction" outlined color="teal">토큰 전송하기</v-btn>
  </div>
</template>

<script>
export default{
    data () {
        return {
            account: '', // 현재 주소
            balance: null, // 잔액

            ciMyNFT: null, // Maket 스마트컨트랙
            ciAuctions: null, // Auction 스마트컨트랙

            auctionIds: [], // 제품들이 모여있는 공간
            toAddress: null, // 주소
            selectedAuction: null, // 해당 옥션 찾는 값

            auctionInfo: { // 그룹화 시켜 값들을 가지고 있는다.
                title: '',
                price: 0,
                tokenId: '',
                owner: ''
            }
        }
    },

    async mounted() {
        this.account = await this.$getDefaultAccount() // 현재 계정의 주소를 반환하는 함수

        this.$web3.eth.getBalance(this.account, (error,result) => { // 현재 계정의 잔액을 반환하는 함수
            this.balance = this.$web3.fromWei(result, 'ether') // 단위는 Ether 단위를 사용한다.
        })

        this.ciMyNFT = this.$web3.eth.contract(this.$config.MAKET_ABI).at(this.$config.MAKET_CA) // 각각의 스마트컨트랙을 사용하기 위해 스마트컨트랙의 주소와 ABI를 가져와 생성한다.
        this.ciAuctions = this.$web3.eth.contract(this.$config.AUCTIONS_ABI).at(this.$config.AUCTIONS_CA) // 각각의 스마트컨트랙을 사용하기 위해 스마트컨트랙의 주소와 ABI를 가져와 생성한다.
        this.getMyAuctions()
    },

    methods: {
        /*
            Auction 에 있는 해당 상품의 소유자의 옥션 리스트를 반환하는 기능이다. 인자는 소유자의 주소가 들어간다.
        */
        getMyAuctions() { 
            this.ciAuctions.getAuctionsOf(this.account,{from: this.account, gas: this.$config.GAS_AMOUNT}, (error,result) => {
                this.auctionIds = result // 해당 함수가 성공적으로 수행하면 결과값들을 auctionIds 배열에 담는다. 
            })
        },
        /*
            해당 옥션아이디로 상품 전체를 보는 함수이다.
            인자는 : "옥션아이디"
            result[0] : 이름
            result[1] : 가격
            result[2] : 메타데이터(ipfs해시값)
            result[3] : 토큰아이디
            result[4] : 소유한 스마트컨트랙주소
            result[5] : 소유자
            result[6] : 판매여부
            result[7] : 소유자 변경유무
        */
        getAuctionById() {
            this.ciAuctions.getAuctionById(this.selectedAuction,{from: this.account, gas: this.$config.GAS_AMOUNT}, (error,result) =>{
                console.log(result) // 결과 값을 콘솔로 띄우고
                this.auctionInfo.title = result[0] // 제목을 가져와 title에 담는다.
                this.auctionInfo.price = this.$web3.fromWei(result[1], 'ether') // 가격의 단위는 ether로
                this.auctionInfo.tokenId = result[3] // 토큰아이디도 담아준다.
                this.ciMyNFT.ownerOf(result[3],{}, (error,owner) => { // 현재 토큰을 소유하고 있는 소유자의 주소를 함수를 실행시켜 값을 받아와 owner에 담아준다.
                    this.auctionInfo.owner = owner
                })
            })
        },
        /*
            현재 이 함수는 다른 사람에게 현재 내가 가지고 있는 토큰을 전송하기 위한 함수이다.
        */
        finalizeAuction() {
            if(!this.toAddress){ // 주소를 입력하지 않으면 유효성검사에서 걸린다.
                alert("주소를 입력해주세요")
                return
            }
            /*
                이 함수는 다른 소유자에게 토큰을 넘기는 함수
                인자 : 옥션아이디 , 보내고자하는 주소
            */
            this.ciAuctions.finalizeAuction(this.selectedAuction, this.toAddress, {from: this.account, gas:this.$config.GAS_AMOUNT},(error,result) =>{
                console.log(result)
            })

            this.watchFinalized((error) => { // 위 함수가 성공적으로 실행 됬을때 이벤트를 발생시켜 이벤트가 성공적으로 나왔다면 아래의 알림창이 뜨게 된다.
                if(!error)
                alert("전송 완료🔥🔥")
            })
        },

        async watchFinalized(cb){
            const currentBlock = await this.getCurrentBlock()
            const eventWatcher = this.ciAuctions.AuctionFinalized({},{
                fromBlock: currentBlock -1, toBlock: 'latest'
            })
            eventWatcher.watch(cb)
        },

        getCurrentBlock() {
        return new Promise((resolve, reject ) => {
            this.$web3.eth.getBlockNumber((err, blocknumber) => {
                if(!err) resolve(blocknumber)
                reject(err)
            })
        })
      }
    }
}
</script>
<style scoped>  
  .containWrap {
    max-width: 600px;
    margin: 0 auto;
  }

  .cardG {
    margin: 10px;
    padding: 10px;
  }

  .cardG .reftxt {
    color: #b7afaf;
  }
</style>

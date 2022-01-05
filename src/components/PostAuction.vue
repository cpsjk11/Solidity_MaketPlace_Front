<template>
    <div>
        <v-form class="form" ref="form">
            <v-text-field v-model="tokenid"></v-text-field>

            <v-text-field v-model="auction.auctionTitle"
                          placeholder="상품이름을 적어주세요😊"
                          label="상품 이름"
                          persistent-hint></v-text-field>
            
            <v-text-field v-model="auction.price"
                          placeholder="상품가격을 적어주세요😊"
                          label="상품 가격"
                          persistent-hint></v-text-field>

            <v-btn @click="createAuction" outlined color="teal">토큰생성</v-btn>
        </v-form>
    </div>
</template>

<script>
export default{
    props:['tokenid','metadata'], // 상위 컴포넌트에게 전달하기 위한 사전작업???? 

    data() {
        return{
            account: null, // 사용자 주소 초기화
            contractInstance: null, // 현재 스마트컨트랙 주소 초기화

            auction: { // 인자로 받아서 저장해야되는 변수들
                auctionTitle:'', 
                price: null
            },
        }
    },

    async mounted(){
        this.account = await this.$getDefaultAccount()
        this.contractInstance = this.$web3.eth.contract(this.$config.AUCTIONS_ABI).at(this.$config.AUCTIONS_CA)
    },

    methods : {
        async createAuction() { // 옥션 제품 생성하는 공간이다.
            if(!this.tokenid){ // 만약 토큰아이디를 넣지 않으면 실행되지않는다.
                alert("토큰아이디를 확인해주세요")
                return
            }

            const price = this.$web3.toWei(this.auction.price, 'ether') // 가격의 단위는 이더 단위로 한다.
            /*
                스마트 컨트랙에 정의된 제품생성 함수를 실행하는 곳 이다.
                총 인자는 5개가 들어간다. "현재스마트컨트랙주소","토큰아이디","제목","메타데이터","가격"

                " this.auction.auctionTitle" 아까 위에 v-model 로 정의된 양방향 바인딩으로 값을 "auctionTitle"의 넣은 값으로
                스마트 컨트랙에 보낸다.
            */
            this.contractInstance.createAuction(this.$config.MAKET_CA,
            this.tokenid, this.auction.auctionTitle, this.metadata,
            price,{from: this.account, gas: this.$config.GAS_AMOUNT},
            (error,transactionHash) => { // 성공적으로 수행했다면
                console.log("txhash",transactionHash) // transactionHash해쉬값을 콘솔로 찍는다.
            })
            this.watchCreated((error) => { // 성공을 하면 스마트컨트랙에서 이벤트가 발생한다.
                                    //  이벤트가 발생하면 경고창으로 생성완료라는 문구가 뜬다.
                if(!error){
                    alert("생성완료!!")
                }
            })
        },

        async watchCreated(cb){
            const currentBlock = await this.getCurrentBlock()
            const eventWatcher = this.contractInstance.AuctionCreated({},{
                fromBlock: currentBlock -1, toBlock: 'latest'
            })
            eventWatcher.watch(cb)
        },

        getCurrentBlock(){
            return new Promise((resolve, reject) => {
                this.$web3.eth.getBlockNumber((err, blocknumber) => {
                    if(!err) resolve(blocknumber)
                    reject(err)
                })
            })
        }
    }
}
</script>

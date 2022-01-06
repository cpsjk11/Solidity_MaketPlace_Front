<template>
    <div class="main">
        <div class="center">
            <!-- {{auctionId}} -->
            <!-- <input  v-model="auctionId" /> -->
            <v-img :src="auction[0].image" height="450px" width="450px" class="img"></v-img>
            <div class="content">
                <div id="title">상품명 : {{auction[0].title}}</div>
                <div class="title-content">
                    <div id="tokenid">아이디 : {{auction[0].tokenId}}</div>
                    <div id="owner">소유자 : {{auction[0].owner}}</div>
                    <div id="price">가격 : {{auction[0].price}} Ether</div>
                </div>
            </div>
        </div>
        <div class="subject">
            <span> 상품들의 대한 설명들... </span>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                auction: [], // 상품들의 정보가 담길공간!
                contract: null,
                auctionId: -1
            }
        },
    
    
        mounted() {
            // 이거는 현재 준비된 스마트 컨트랙을 사용하기 위한 준비작업이다!
            this.contract = this.$web3.eth.contract(this.$config.AUCTIONS_ABI).at(this.$config.AUCTIONS_CA);
            this.ciMyNFT = this.$web3.eth.contract(this.$config.MAKET_ABI).at(this.$config.MAKET_CA)
            this.auctionId = this.$route.query.text // 여기서 앞서 던진 파라미터를 받아서 수행한다!
            this.getAuctions()
        },

        methods:{
            getAuctions(){
                // alert(this.auctionId);
                this.contract.getAuctionById(this.auctionId,{},(err,result) => {
                    this.ciMyNFT.ownerOf(result[3],{},(error,owner) =>{ // 소유자는 스마트컨트랙에 있는 함수를 호출해 가져와 owner에 담는다.
                        this.auction.push({ // 배열에 담는 부분
                            title: result[0], 
                            price: this.$web3.fromWei(result[1], 'ether'),
                            image: 'https://gateway.ipfs.io/ipfs/'+result[2],
                            tokenId: result[3],
                            owner: owner.substring(0,4) +"..."+ owner.substring(40,42),
                            active: result[6],
                            finalized: result[7] ? "판매종료" : "판매중"
                        })
                    })
                })
            }
        }
    }
</script>


<style scoped> 
.content{
    display: inline-block;
    width: 450px;
    height: 450px;
    border: 1px solid red;
    text-align: left;
    font-weight: bold;
    padding-left: 20px;
}
.center{
    width: 900px;
    margin: auto;
}
.img{
    float: left;
}
.subject{
    border: 1px solid royalblue;
    height: 400px;
    width: 900px;
    margin: 20px auto;
}
#title{
    
    font-size: 20px;
    margin-bottom: 20px;
}
#tokenid{
    font-size: 14px;
    margin-bottom: 15px;
}
#owner{
    font-size: 14px;
    margin-bottom: 15px;    
}
.title-content{
    margin-top: 100px;
}
</style>
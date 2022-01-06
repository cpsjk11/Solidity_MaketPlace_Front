<template>
    <div class="main">
        <div class="center">
            <!-- {{auctionId}} -->
            <!-- <input  v-model="auctionId" /> -->
            <v-img :src="auction[0].image" height="450px" width="450px" class="img"></v-img>
            <div class="content">
                <div class="title-center">
                    <div id="title">상품명 : {{auction[0].title}}</div>
                </div>
                <div class="title-content">
                    <div id="tokenid">
                        <span class="left">아이디 : </span>
                        <span class="right">{{auction[0].tokenId}}</span>
                    </div>
                    <div id="owner">
                        <span class="left">소유자 : </span>
                        <span class="right">{{auction[0].owner}}</span>
                    </div>
                    <div id="price">
                        <span class="left">가격 : </span> 
                        <span class="right">{{auction[0].price}} Ether</span>
                    </div>
                    <div id="btn">
                        <v-btn @click="purchase" id="purchase">구매하기</v-btn>
                    </div>
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
                auctionId: -1,
                price: 1000000000000000000000,
                price2: 0,
                account: null
            }
        },
    
    
        async mounted() {
            this.account = await this.$getDefaultAccount()
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
                    this.price = this.$web3.fromWei(result[1], 'wei'),
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
            },
            async purchase(){
                this.price2 = this.$web3.fromWei(this.price, 'ether')
                alert(this.price2)
                alert(this.$web3.fromWei(this.price2, 'wei'))
                // 무조건 이더를 주고받는 상호작용일 때는 상시 비동기 처리를 해야한다. 무조건이다 이거 안하면 오류다.
                await this.contract.sale(this.auctionId,{from: this.account,value: this.price,gas:this.$config.GAS_AMOUNT},(error,result) =>{
                    if(!error)
                    console.log(result);
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
    font-weight: bold;
    padding: 0 20px;
}
.title-center{
    text-align: center;
    margin: 60px;
    margin-left: 50px;
    border-bottom: solid 1px #d8d8d8;
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
#price{
    font-size: 14px;
    margin-bottom: 15px;    
}
.title-content{
    margin-top: 100px;
    text-align: left;
}
.left{
    text-align: left;
    display: inline-block;
}
.right{
    float: right;
}
#purchase{
    margin: 10% 0;
    width: 100%;
    height: 48px;
    color: white;
    background-color: black;
}
</style>
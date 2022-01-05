<template>
    <!--
        여기가 등록된 상품들을 메인 페이지에서 보여주는 부분이다.
      -->
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap><!-- 좌에서 우로 하나씩 정렬해서 보여준다는 의미이다. -->
        <!-- 
            해당 v-flex는 반복문을 돌면서 옥션을 보여주는데 index값 만큼 도는 반복문이다.
            해당 반복문을 통해서 각각의 등록된 NFT상품들을 보여준다.
         -->
            <v-flex v-for="(auction, index) in auctions" :key="index" xs4> <!-- 상품은 auction을 xs 크기 이상에서 4로 고정 -->
                <v-card>
                    <v-img :src="auction.image" height="200px"></v-img>

                    <div>제목: {{auction.title}}</div>
                    <div>가격: {{auction.price}} Ether</div>
                    <div>토큰아이디: {{auction.tokenId}}</div>
                    <div>소유자: {{auction.owner}}</div>
                    <!-- <div>활성화: {{auction.active}}</div> -->
                    <div>판매여부: {{auction.finalized}}</div>
                    <div></div>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default{
    data () {
        return{
            ciMyNFT: null, // 스마트컨트랙 주소가 들어갈 부분
            ciAuctions: null,
            auctions: [] // auctions 들의 정보가 배열로 담아져 보관 된다.
        }
    },

    

    mounted() {
        this.ciAuctions = this.$web3.eth.contract(this.$config.AUCTIONS_ABI).at(this.$config.AUCTIONS_CA)
        this.ciMyNFT = this.$web3.eth.contract(this.$config.MAKET_ABI).at(this.$config.MAKET_CA)
        this.getAuctions()
    },

    methods: {
        /*
            해당 함수는 스마트컨트랙에서 가져와 옥션들의 상품을 보는 공간이다.
        */
        getAuctions(){
        /*
            아래의 함수는 현재 옥션의 등록된 상품들의 총 갯수를 반환하는 기능이다.
            인자: X
        */
        this.ciAuctions.getCount({}, (error,result) => {
            const count = result // 상품의 길이만큼 돌아야 하니 길이를 먼저 구한다.

            for(let i=0; i<count; i++){ // 이제 해당 길이 만큼 돌면서 상품들을 auctions[]에 담자!
                /*
                    해당 함수는 옥션의 저장되어 있는 상품들을 총 가져오는 함수이다.
                    인자: '옥션아아디'
                    이것이 가능한 이유는 옥션아이디는 하나씩 차츰차츰 올라가기 때문에 반복으로 돌기 매우 수월하기 때문이다.
                */
                this.ciAuctions.getAuctionById(i,{},(err,result) => {
                    // 반복문을 돌면서 해당 상품의 정보를 다 가져온다.
                    this.ciMyNFT.ownerOf(result[3],{},(error,owner) =>{ // 소유자는 스마트컨트랙에 있는 함수를 호출해 가져와 owner에 담는다.
                        this.auctions.push({ // 배열에 담는 부분
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
        })
        }
    }
}

</script>

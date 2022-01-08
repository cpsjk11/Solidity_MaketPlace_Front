<template>
  <div>    
    <v-form class="form" ref="form">
        <!-- v-model은 양방형 바인딩이다. -->
      <v-text-field
        v-model="tokenId" 
        label="Unique ID">
      </v-text-field>
        <!-- 이 태그는 요소가 변경될때 "captureFile이라는 함수가 실행된다." -->
      <input
        type="file"
        @change="captureFile" />
        <!-- 이 태그는 클릭 이벤트가 발생했을 때 uploadimg함수를 실행한다. -->
      <v-btn @click="uploadImg" outlined color="teal">UploadImg</v-btn>   
      <img :src="uploadedImg()" width="300" />

      <v-text-field
        v-model="dataURI"   
        label="Data URI"
        required
        ></v-text-field>

      <v-btn @click="submit" outlined color="teal">IPFS변환</v-btn>      

      <div v-show="isRegistered"><!-- v-show는 해당 하는 함수가 true일때만 보여지게된다. -->
        <v-btn @click="transferToCA" outlined color="teal">TransferToCA</v-btn>              
      </div>
    </v-form>       
    <!-- PostAuction에 필요한 데이터들을 전달한다! -->
    <PostAuction v-bind:tokenid="tokenId" v-bind:metadata="dataURI" /> 
  </div>	
</template>

<script>
import PostAuction from '@/components/PostAuction.vue'

    

    export default{
        data() {
            return{
                account: null, //컨트랙트 호출을 위해 사용된다.
                contractInstance: null, //컨트랙트 호출을 위해 사용된다.
                file: null, // 이미지 파일 업로드
                tokenId:null, // 토큰 Id
                isRegistered: false, // 토큰 등록여부
                dataURI: null // ipfs 기본값
            }
        },
    
    components:{
        PostAuction
    },

    async mounted() {    
    this.account = await this.$getDefaultAccount() // 컴포넌트 마운트시 사용자의 주소를 믹스인에서 정의된 함수를 호출해서 account에 대입한다.
    this.contractInstance = this.$web3.eth.contract(this.$config.MAKET_ABI).at(this.$config.MAKET_CA) // 스마트 컨트랙을 사용하기 위한 생성부분
    
    this.tokenId = this._getRandomInt(123456789,999999999)// 토큰 ID는 난수 발생으로 지정한다 그래서 값은 단일성은 보장은 못 한다.              
  },

    methods: { // 함수가 정의된 구간
        _getRandomInt(min,max){ // 함수의 난수 발생 이벤트다.
            return Math.floor(Math.random() * (max - min + 1)) + min
        },
    

        captureFile(event){
            /*
            preventDefault() : 기본 이벤트의 자동 실행을 중지시킴
            stopPropagation() : 이벤트의 전파를 막음.
            */
            event.stopPropagation();
            this.file = event.target.files[0] //어떤 요소를 클릭했는지 가져오는 것이 event.target이다 그래서 현재 선택된 파일들중 첫번째 파일을 선택해 file에 담는다.
        },

    async uploadImg() {
        if(!this.file){ // file이 비어있다면 경고창 발생
            alert("사진을 넣어주세요!")
            return;
        }
        const formData = new FormData(); // FromData란 ajax로 폼 전송을 가능하게 해주는 FormData 객체입니다.
        formData.append('file', this.file) // 'file'이라는 키값 값은 this.file을 담는다!
        this.axios({
            method: 'post', // 전송방식은 post
            baseURL: 'https://ipfs.infura.io:5001', // api호출???
            url: '/api/v0/add', // 경로는 이거
            data: formData, // 보낼 데이터는 현재 폼을 던진다.
            headers: {'Content-Type': 'multipart/form-data'} // 폼의 타입은 파일타입으로 지정한다.
        }).then((response) => { // 성공시
            this.dataURI = response.data.Hash // ipfs값을 대입해준다.
        })
    },

    uploadedImg(){ // NFT토큰을 생성할때 ipfs 경로를 이용해 만들기 때문에 현재 ipfs로 해쉬값을 변경시킨것을 경로랑 통합해 리턴한다.
      return 'https://gateway.ipfs.io/ipfs/'+this.dataURI
    },

    submit() { // tokenId와 IPFS해시값을 가지고 스마트컨트랙에 등록하는 프로세스 함수이다.
        if(!this.dataURI){ // 만약 사진을 업로드 시키지 않아 넘어갈 수 없으니 유효성 검사를 한다.
            alert("dataURI을 입력해주세요");
            return;
        }
        // alert(this.account)
        // alert(this.tokenId)
        // alert(this.dataURI)
        /*
            👇👇토큰을 생성하는 부분이다.
            인자는 총 3개 '토큰의 소유자될 주소','토큰아이디','해당 사진의 주소'
        */
         this.contractInstance.Maketplace(this.account,this.tokenId,this.dataURI,{ 
            from: this.account, // 이 토큰을 보내줄 주소는 현재 사용자로 지정한다.
            gas: this.$config.GAS_AMOUNT // 얼마만큼의 가스를 보낼 것 인지는 미리 지정해둔 config의 정의된 가스값을 넣어준다.
        },(error,result) =>{// 보내면 해당 거래내역을 콘솔로그로 남긴다.
            console.log("result",result)
        })
        this.watchTokenRegistered((error) => { // 스마트컨트랙 이벤트 부분 성공적으로 토큰을 등록완료 시 이벤트를 발생하게 된다.
                                        // 토큰 등록 완료 이벤트 발생시 마찬가지로 토큰등록 완료하는 알림창을 보여준다.
          if(!error){
                alert("토큰등록 완료🔥🔥");
               // this.isRegistered = true; // 토큰이 등록이 됬을때만 해당 소유권을 관리자로 넘기는 버튼을 활성화 해 준다.
               this.contractInstance.transferFrom(this.account,this.$config.AUCTIONS_CA, this.tokenId,{
                from: this.account,
                gas:this.$config.GAS_AMOUNT
            },(error,result) => {
                console.log("result",result)
            })

            this.watchTransfered((error) => { // 성공적으로 토큰을 보냈다면 이벤트가 발생을 하게 되고 이벤트가 발생이 완료 되었다면 
                                    //  현재 이 함수를 성공적으로 실행해 알림창이 띄워진다!! 
            if(!error) alert("관리자 에게 토큰 전송완료🔥🔥")
        })
            }
        })
    },

    transferToCA(){ // 토큰 소유자로 부터 스마트컨트랙 주소로 NFT토큰을 넘기는 함수이다.
        /*
            👇👇함수는 해당 소유자로 부터 현재 스마트컨트랙의 주소로 토큰을 넘기는 함수이다.
            마찬가지로 여기도 인자는 총 3가지 필요하다. "소유자의 주소","토큰을 보낼주소","보낼 토큰의 아이디"
        */
        this.contractInstance.transferFrom(this.account,this.$config.AUCTIONS_CA, this.tokenId,{
            from: this.account,
            gas:this.$config.GAS_AMOUNT
        },(error,result) => {
            console.log("result",result)
        })

        this.watchTransfered((error) => { // 성공적으로 토큰을 보냈다면 이벤트가 발생을 하게 되고 이벤트가 발생이 완료 되었다면 
                                //  현재 이 함수를 성공적으로 실행해 알림창이 띄워진다!! 
        if(!error) alert("관리자 에게 토큰 전송완료🔥🔥")
      })
    },


    async watchTokenRegistered(cb) { // 여기가 이벤트를 감지하고 캐치하는 공간인데 진짜 솔직히 잘 모르겠어요.. 참 아직 너무 어렵다
      const currentBlock = await this.getCurrentBlock()
      const eventWatcher = this.contractInstance.TokenRegistered({}, {fromBlock: currentBlock - 1, toBlock: 'latest'})
      eventWatcher.watch(cb)
    },

    async watchTransfered(cb) {
      const currentBlock = await this.getCurrentBlock()
      const eventWatcher = this.contractInstance.Transfer({}, {fromBlock: currentBlock - 1, toBlock: 'latest'})
      eventWatcher.watch(cb)
    },

    getCurrentBlock() { // 현재 이 함수는 비동기식 통신을 이용한 제일 최근에 생긴 블록넘버를 반환하는 함수이다.
      return new Promise((resolve, reject ) => {
        this.$web3.eth.getBlockNumber((err, blocknumber) => {
            if(!err) resolve(blocknumber)
            reject(err)
        })
      })
    },  

  }

}
</script>
<template>
  <div>
    <h2>Test Block Chain Test</h2>
    <br />
    <v-btn @click="test()">서명 메세지</v-btn><br />
    <v-text-field v-model="uri"
     placeholder="경로"
     label="경로"
     persistent-hint></v-text-field>
     <v-btn @click="setUrl()">Nft 생성</v-btn>
     <v-btn @click="sale()">Nft 판매</v-btn>
     <v-btn @click="trade()">Nft 트레이드</v-btn>
  </div>
</template>

<script>
// import Web3 from 'web3'
// const Contract = require("web3-eth-contract");
export default {
  data() {
    return {
      contract: null,
      account: '',
      uri: ''
    };
  },
  async mounted() {
    // this.contract = this.$web3.eth
    //   .contract(this.$config.AUCTIONS_ABI)
    //   .at(this.$config.AUCTIONS_CA);
    this.account = await this.$getDefaultAccount();

    this.contract = new this.$web3.eth.Contract(
      this.$config.MYTOKEN_ABI,
      this.$config.MYTOKEN_CA
    );
  },
  methods: {
    async test() {
      if (!window.ethereum) return alert("Please Install Metamask");

      console.log(this.account);

      // message to sign
      const message = "hello";
      console.log({ message });

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      );
      console.log({ hashedMessage });
      const user = "0x93301185d72bea091533426697A432dDd63E8cf0";
      console.log({ user, hashedMessage });
      let signature = await this.$web3.eth.sign(
        hashedMessage,
        user,
        async (err, req) => {
          if (!err) {
            console.log({ req });
            signature = req;
            console.log({ signature });
            const r = req.slice(0, 66);
            const s = "0x" + req.slice(66, 130);
            const v = parseInt(req.slice(130, 132), 16);
            console.log({ r, s, v });

            const result = this.$web3.eth.accounts.recover(
              hashedMessage,
              req
            );
            await this.contract.methods
              .VerifyMessage(hashedMessage, v, r, s)
              .call((e,q) => {
                console.log({e,q})
              })

            console.log({ result });
          }
        }
      );
    },
    async setUrl() {
      if (!window.ethereum) return alert("Please Install Metamask");
      if (this.uri === undefined || this.uri === null) return alert('경로를 입력해주세요')

      // message to sign
      const message = "hello";
      console.log({ message });

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req });
          
            const result = this.$web3.eth.accounts.recover(
              hashedMessage,
              req
            );
            console.log({ result });
          }
        }
      )

      await this.contract.methods
      .setTokenURI(this.uri)
      .send({from: this.account}, async (e,q) => {
        if(e) return alert('나중에 다시 시도해 주세요')
        console.log({q})
        await this.contract.methods
        .batchMint(this.account,Number(10))
        .send({from: this.account}, (e,q) => {
          if(!e) console.log('nft 생성 여부 : ',q)
          console.log(`실패 : ${e}`)
        })
      })
    },
    async sale() {
      if (!window.ethereum) return alert("Please Install Metamask");
      if (this.uri === undefined || this.uri === null) return alert('경로를 입력해주세요')

      // message to sign
      const message = "hello";
      console.log({ message });

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req });
          
            const result = this.$web3.eth.accounts.recover(
              hashedMessage,
              req
            );
            console.log({ result });
          }
        }
      )

      await this.contract.methods
      .approve()
      .send(
        {form: this.account},
        (err,res) => {
          if(!err) return alert(`권한승인 실패 내용 ${err}`)
          console.log({res})
        }
      )
    },
    async trade() {
      if (!window.ethereum) return alert("Please Install Metamask");

      // message to sign
      const message = "hello";
      console.log({ message });

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req });
          
            const result = this.$web3.eth.accounts.recover(
              hashedMessage,
              req
            );
            console.log({ result });
          }
        }
      )

      await this.contract.methods
      .approve('0x72435168b543D3d6040331725C358DE7407e8638',Number(0))
      .send(
        {from: this.account},
        (err,res) => {
          if(!err) return alert(`권한승인 실패 내용 ${err}`)
          console.log({res})
        }
      )
    },
    async test2() {
      let msg = "Some data";

      let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
      let msgHash1 = this.$web3.sha3(prefix + msg);
      console.log(msgHash1);
      console.log(this.$web3);

      let sig1 = await this.$web3.eth.sign(
        this.account,
        msgHash1,
        async (e, q) => {
          if (!e) console.log({ q });
          // let privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"

          // let sigObj = await this.$web3.eth.accounts.sign(msg, privateKey)
          // let msgHash2 = sigObj.messageHash;
          // console.log({msgHash2})
          // let sig2 = sigObj.signature;
          // console.log({sig2})

          let whoSigned1 = await this.$web3.eth.accounts.recover(msg, sig1);
          // let whoSigned2 = await this.$web3.eth.accounts.recover(sigObj)
          console.log({ whoSigned1 });
          // console.log({whoSigned2})
        }
      );

      // Using eth.accounts.sign() - returns an object
    },
  },
};
</script>

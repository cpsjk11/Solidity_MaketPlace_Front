<template>
  <div>
    <h2>Test Block Chain Test</h2>
    <br />
    <v-btn @click="test()">서명 메세지</v-btn><br />
    <v-text-field
      v-model="uri"
      placeholder="경로"
      label="경로"
      persistent-hint
    ></v-text-field>
    <v-btn @click="setUrl()">Nft 생성</v-btn><br /><br />
    <v-btn @click="sale()">Nft 판매</v-btn><br /><br />
    <v-btn @click="trade()">Nft 트레이드</v-btn><br />
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="price"
          label="가격"
          placeholder="가격"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-btn @click="changePrices()">가격 변경</v-btn><br/><br/>
    <v-btn @click="coinSale()">Nft`s 구매</v-btn><br/><br/>
    <v-btn @click="coinTrade()">트레이드</v-btn>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              
              <v-col cols="12">
                <v-lable>
                  1. 서명
                </v-lable>
              </v-col>
              <v-col cols="12">
                <v-lable>
                  2. Nft 전송
                </v-lable>
              </v-col>
              <v-col
                cols="12"
              >
              <v-text-field
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import Web3 from 'web3'
// const Contract = require("web3-eth-contract")
export default {
  data() {
    return {
      contract: null,
      account: "",
      uri: "",
      price: "",
      check: "",
      dialog: false,
    }
  },
  async mounted() {
    // this.contract = this.$web3.eth
    //   .contract(this.$config.AUCTIONS_ABI)
    //   .at(this.$config.AUCTIONS_CA)
    this.account = await this.$getDefaultAccount()

    this.contract = new this.$web3.eth.Contract(
      this.$config.MYTOKEN_ABI,
      this.$config.MYTOKEN_CA
    )
  },
  methods: {
    async test() {
      if (!window.ethereum) return alert("Please Install Metamask")

      console.log(this.account)

      // message to sign
      const message = "hello"
      console.log({ message })

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )
      console.log({ hashedMessage })
      const user = "0x93301185d72bea091533426697A432dDd63E8cf0"
      console.log({ user, hashedMessage })
      let signature = await this.$web3.eth.sign(
        hashedMessage,
        user,
        async (err, req) => {
          if (!err) {
            console.log({ req })
            signature = req
            console.log({ signature })
            const r = req.slice(0, 66)
            const s = "0x" + req.slice(66, 130)
            const v = parseInt(req.slice(130, 132), 16)
            console.log({ r, s, v })

            const result = this.$web3.eth.accounts.recover(hashedMessage, req)
            await this.contract.methods
              .VerifyMessage(hashedMessage, v, r, s)
              .call((e, q) => {
                console.log({ e, q })
              })

            console.log({ result })
          }
        }
      )
    },
    async setUrl() {
      if (!window.ethereum) return alert("Please Install Metamask")
      if (this.uri === undefined || this.uri === null)
        return alert("경로를 입력해주세요")

      // message to sign
      const message = "hello"
      console.log({ message })

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req })

            const result = this.$web3.eth.accounts.recover(hashedMessage, req)
            console.log({ result })
          }
        }
      )

      await this.contract.methods
        .setTokenURI(this.uri)
        .send({ from: this.account }, async (e, q) => {
          if (e) return alert("나중에 다시 시도해 주세요")
          console.log({ q })
          await this.contract.methods
            .batchMint(this.account, Number(10))
            .send({ from: this.account }, (e, q) => {
              if (!e) console.log("nft 생성 여부 : ", q)
              console.log(`실패 : ${e}`)
            })
        })
    },
    async sale() {
      if (!window.ethereum) return alert("Please Install Metamask")
      if (this.uri === undefined || this.uri === null)
        return alert("경로를 입력해주세요")

      // message to sign
      const message = "hello"
      console.log({ message })

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req })

            const result = this.$web3.eth.accounts.recover(hashedMessage, req)
            console.log({ result })
          }
        }
      )

      await this.contract.methods
        .ownerBatchTransferFrom(
          this.account,
          "0x72435168b543D3d6040331725C358DE7407e8638",
          [1, 2]
        )
        .send({ from: this.account }, (err, res) => {
          console.log({ res, err })
        })
    },
    async trade() {
      if (!window.ethereum) return alert("Please Install Metamask")

      // message to sign
      const message = "hello"
      console.log({ message })

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req })

            const result = this.$web3.eth.accounts.recover(hashedMessage, req)
            console.log({ result })
          }
        }
      )

      await this.contract.methods
        .approve("0x72435168b543D3d6040331725C358DE7407e8638", Number(5))
        .send({ from: this.account }, (err, res) => {
          console.log({ err, res })
        })
    },
    async changePrices() {
      if (!window.ethereum) return alert("Please Install Metamask")
      this.dialog = true
      if (this.price === "") return alert("가격을 지정해주세요")
      const chang = this.$web3.utils.toWei(this.price, "ether")
      console.log({ chang })

      // message to sign
      const message = "hello"
      console.log({ message })

      // hash message
      const hashedMessage = this.$web3.utils.sha3(
        "\x19Ethereum Signed Message:\n" + message.length + message
      )

      await this.$web3.eth.sign(
        hashedMessage,
        this.account,
        async (err, req) => {
          if (!err) {
            console.log({ req })

            const result = this.$web3.eth.accounts.recover(hashedMessage, req)
            console.log({ result })
          }
        }
      )

      await this.contract.methods
        .changePrice(this.account, [5], [chang])
        .send({ from: this.account }, (err, res) => {
          console.log({ err, res })
        })
    },
    async coinSale() {
      await this.Signature('EthBatch','test Buy',5,0.3, (e,q) => {
        console.log({e,q})
        if(!this.check)
          return alert('서명 검증 실패')
      })

      const price = Number(this.$web3.utils.toWei('0.3','ether')) + Number((this.$web3.utils.toWei('0.3','ether') * 0.1))
      console.log({price})
      const from = await this.contract.methods
                  .ownerOf(5)
                  .call()
      console.log(from)
      this.contract.methods
      .ETHBatchTransferFrom(from,this.account,[5])
      .send(
        {
          from: this.account,
          value: price
        },
        (err,res) => {
          console.log({err, res})
        }
      )
    },
    async coinTrade() {
      await this.Signature('EthBatch','test Buy',5,0.3, (e,q) => {
        console.log({e,q})
        if(!this.check)
          return alert('서명 검증 실패')
      })

      await this.contract.methods
            .approve("0x93301185d72bea091533426697A432dDd63E8cf0", Number(5))
            .send({ from: this.account }, (err, res) => {
              if(err) return alert('권한승인 실패 했습니다.')
              console.log({res})
            })

      const price = Number(this.$web3.utils.toWei('0.3','ether')) + Number((this.$web3.utils.toWei('0.3','ether') * 0.1))
      console.log({price})
      const from = await this.contract.methods
                  .ownerOf(5)
                  .call()
      console.log(from)
      this.contract.methods
      .ETHTradeBatchTransferFrom(from,[5])
      .send(
        {
          from: this.account,
          value: price
        },
        (err,res) => {
          console.log({err, res})
        }
      )
    },
    async Signature(name,explanation,Nft,price) {
      const sigUtil = require("eth-sig-util")
      const ethUtil = require("ethereumjs-util")
      const msgParams = JSON.stringify({
        domain: {
          // Defining the chain aka Rinkeby testnet or Ethereum Main Net
          chainId: 3,
          // Give a user friendly name to the specific contract you are signing for.
          name: "MyToken",
          // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
          verifyingContract: this.$config.MYTOKEN_CA,
          // Just let's you know the latest version. Definitely make sure the field name is correct.
          version: "1",
        },

        // Defining the message signing data content.
        message: {
          /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
          contents: "MyToken",
          attachedMoneyInEth: 4.2,
          from: this.$config.MYTOKEN_CA,
          detail: [
            {
              name: name,
              explanation:explanation,
              price: price,
              your: this.account,
              Nft: Nft
            },
          ],
        },
        // Refers to the keys of the *types* object below.
        primaryType: "Mail",
        types: {
          // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          // Not an EIP712Domain definition
          Group: [
            { name: "name", type: "string" },
            { name: "members", type: "Person[]" },
          ],
          // Refer to PrimaryType
          Mail: [
            { name: "from", type: "string" },
            { name: "detail", type: "Person[]" },
            { name: "contents", type: "string" },
          ],
          // Not an EIP712Domain definition
          Person: [
            { name: "name", type: "string" },
            { name: "explanation", type: "string" },
            { name: "price", type: "string" },
            { name: "your", type: "string" },
            { name: "Nft", type: "string" },
          ],
        },
      })

      const from = this.account

      const params = [from, msgParams]
      const method = "eth_signTypedData_v4"

      this.$web3.currentProvider.sendAsync(
        {
          method,
          params,
          from,
        },
        function (err, result) {
          if (err) return alert(err.message)
          if (result.error) {
            return alert(result.error.message)
          }
          if (result.error) return console.error("ERROR", result)
          console.log("TYPED SIGNED:" + JSON.stringify(result.result))

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(msgParams),
            sig: result.result,
          })

          if (
            ethUtil.toChecksumAddress(recovered) ===
            ethUtil.toChecksumAddress(from)
          ) {
            console.log("성공", result)
            this.check = true
          } else {
            return alert("실패", result)
          }
        }
      )
    },
    async test2() {
      let msg = "Some data"

      let prefix = "\x19Ethereum Signed Message:\n" + msg.length
      let msgHash1 = this.$web3.sha3(prefix + msg)
      console.log(msgHash1)
      console.log(this.$web3)

      let sig1 = await this.$web3.eth.sign(
        this.account,
        msgHash1,
        async (e, q) => {
          if (!e) console.log({ q })
          // let privateKey = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"

          // let sigObj = await this.$web3.eth.accounts.sign(msg, privateKey)
          // let msgHash2 = sigObj.messageHash
          // console.log({msgHash2})
          // let sig2 = sigObj.signature
          // console.log({sig2})

          let whoSigned1 = await this.$web3.eth.accounts.recover(msg, sig1)
          // let whoSigned2 = await this.$web3.eth.accounts.recover(sigObj)
          console.log({ whoSigned1 })
          // console.log({whoSigned2})
        }
      )

      // Using eth.accounts.sign() - returns an object
    },
  },
}
</script>

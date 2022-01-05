import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import Config from './config'
import VueAxios from 'vue-axios'
import Web3 from 'web3'

Vue.use(Vuetify) // 플로그인을 바로 설치하는 함수이다.
Vue.use(VueAxios,axios)

const EventBus = new Vue();
export default EventBus;

Vue.config.productionTip = false // Vue앱이 처음 실행될 때 나오는 경고문을 보여줄지 말지 부여하는 곳

/*
  Vue.mixin : 믹스인(Mixins)은 여러 컴포넌트 간에 공통으로 사용하고 있는 로직, 기능들을 재사용하는 방법입니다.
              믹스인에 정의할 수 있는 재사용 로직은 data, methods, created 등과 같은 컴포넌트 옵션입니다.
*/
Vue.mixin({ 
  created() {
    const web3js = window.web3 // metamask에서  undefined 인지 확인합니다. 만약 undefined가 아니라면 web3 인스턴스를 currentProvider로 생성합니다. 
    if(typeof web3js !== 'undefined'){
      this.$web3 = new Web3(web3js.currentProvider)
    }

    this.$getDefaultAccount = () => {
      return new Promise((resolve, reject) => { // Promise 는 비동기 식 통신을 위해 필요한 객체이다.
        this.$web3.eth.getAccounts((err,data) => { // web3 js 를 사용하여 사용자의 주소를 가져오는 함수이다.
          if(!err) resolve(data[0]) // 오류가 나지 않으면 resolve 에 원하는 데이터값을 반환!
          reject(err) // 오류시 에러를 발생한다.
        })
      })
    }
    this.$config = Config // Config를 믹스인 사용해 전역적으로 사용하기 위해 this.$config에 담았다.
  }
})

new Vue({
  vuetify : new Vuetify(), // 앱이 실행될때 Vuetify 담는다.
  router, // 그리고 아까 정의해둔 router.js또한 담는다.
  render: h => h(App),
}).$mount('#app')

import Vue from "vue";
import Router from 'vue-router'
import Main from './views/Main.vue';
import Wallet from './views/Wallet.vue';
import Upload from './views/Upload.vue';

Vue.use(Router)
/*
    이렇게 따로 router.js로 분리해서 관리하는 이유는 각 페이지 별로 관리하기 위함이다.
    그래서 각 사용하는 경로에 이름과 어떤 컴포넌트를 사용한 것 인지 명시를 해 두었다.
*/

export default new Router({
    mode: 'history', //참고로 url 주소에 hash(#)를 사용하는 방법과 HTML5에서 hash를 제거하는 history mode가 존재합니다. 만약 # 기호를 제거하려면 아래와 같이 mode: 'history' 값을 설정해줍니다.
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/', // 경로
            name: 'main', // 페이지 이름
            component: Main // 실행될 컴포넌트 이다.
        },
        {
            path: '/Wallet',
            name: 'wallet',
            component: Wallet
        },
        {
            path: '/upload',
            name: 'upload',
            component: Upload
        }
    ]
})

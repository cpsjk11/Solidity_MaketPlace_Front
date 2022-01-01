import Vue from "vue";
import { Route } from "vue-router";
import { component } from "vue/types/umd";

import Main form './views/Main.vue';
import Wallet form './views/Wallet.vue';
import Upload form './views/Upload.vue';

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes:[
        {
            path: '/',
            name: 'main',
            component: Main
        },
        {
            path: '/Wallet',
            name: wallet,
            component: Wallet
        },
        {
            path: '/upload',
            name: 'upload',
            component: Upload
        }
    ]
})

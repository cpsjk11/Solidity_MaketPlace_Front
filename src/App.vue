
<!-- App.vue는 전역적으로 보여지는 페이지이다. -->
<template>
  <v-app light>
    <v-app-bar fixed color="teal lighten-2" app dark :clipped-left="true">      
      <v-toolbar-title>Maket Place</v-toolbar-title>
      <v-spacer></v-spacer>

      <div class="nav">
        <a href="/">Home</a>
        <a href="/wallet?text=hi" @click="clickBtn">Wallet</a>
        <a href="/upload">Upload</a>
      </div>
    </v-app-bar>
    <v-main class="contentWrapper">
      <v-container fluid>
        <router-view></router-view> <!-- router-view 여기서 라우팅을 구성한 페이지가 렌더링 되는 부분이다. -->
      </v-container>
      <div id="demo"> <!-- 여기있는 div demo는 메타마스크를 연동하기 위한 곳 이다. -->
        <vue-metamask 
            userMessage="msg" 
            @onComplete="onComplete" 
        >
        </vue-metamask>
    </div>
    </v-main>
  </v-app>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import vueMetamask from '../node_modules/vue-metamask/src/VueMetamask.vue';
import EventBus from './main.js'

export default {
  name: 'App',
  
  components: {
        vueMetamask,
        },
        data(){
            return {
                msg: "This is demo net work"
            }
        },
        methods:{
            onComplete(data){
                console.log('data:', data);
            },
            clickBtn(){
              EventBus.$emit('push-msg', '안녕');
            },
        }
 
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.nav a{
  font-weight: bold;
  color : #2c3e50;
  margin : 10px;
}
.nav a.router-link-exact-active{
  color: #42b983;
}

.contentWrapper{
  padding-top:20px;
}
a{
  text-decoration: none;
}
</style>

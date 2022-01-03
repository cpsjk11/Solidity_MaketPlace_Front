<template>
  <v-app light>
    <v-app-bar fixed color="teal lighten-2" app dark :clipped-left="true">      
      <v-toolbar-title>Maket Place</v-toolbar-title>
      <v-spacer></v-spacer>

      <div class="nav">
        <a href="/">Home</a>
        <a href="/wallet">Wallet</a>
        <a href="/upload">Upload</a>
      </div>
    </v-app-bar>
    <v-content class="contentWrapper">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
      <div id="demo">
        <vue-metamask 
            userMessage="msg" 
            @onComplete="onComplete"
        >
        </vue-metamask>
    </div>
    </v-content>
  </v-app>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import vueMetamask from '../node_modules/vue-metamask/src/VueMetamask.vue';

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
            }
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
</style>

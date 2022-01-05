<template>
  <div>
      {{ $route.query.text }}
    <h2>Wallet Page</h2>  
    <MyWallet />
  </div>
</template>

<script>
  import MyWallet from '@/components/MyWallet.vue';

  export default { 
      data() {
          return{
              name : ''
          }
      },    
    components: { 
      MyWallet
    },
    
    
  }
</script>

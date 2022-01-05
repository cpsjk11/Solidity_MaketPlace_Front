<template>
<div>
    <h2>Main Page</h2>
    <Marketplace /> <!-- 이 의미는 앞서 정의된 Marketplace의 template이 들어가는 것 같다. -->
</div>
</template>
<script>
    import Marketplace from '@/components/Marketplace.vue'

    export default{
        components: {
            Marketplace // 이 vue가 불려지면 'Marketplace'에 정의된 컴포넌트를 불러와서 실행을 한다.
        }
    }
</script>
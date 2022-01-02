<template>
<div>
    <h2>Upload Page</h2>
    <MyUpload />
    <Metamask />
</div>
</template>
<script>
    import MyUpload from '@/components/MyUpload.vue'
    import Metamask from '@/components/Metamask.vue'
    export default{
        components: {
            MyUpload,
            Metamask
        }
    }
</script>
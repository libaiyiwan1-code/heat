<template>
    <router-view/>
</template>

<script>
import { message } from 'ant-design-vue';
message.config({
  duration: 0.3,  //message 过期时间
});
export default {
  name: 'App',
  setup() {
    document.getElementById('loadingPage').remove()
  },

}
</script>
<style lang="less">
 body{
  overflow: hidden;
 }
</style>

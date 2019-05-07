<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="app">
    <myHeader></myHeader>
    <myTab></myTab>
  </div>
</template>

<script>
// 引入header组件
// 注意：这里用的myHeader标签是因为：如果使用header的话，就和html原生标签header重名了，会报错;
import myHeader from "./components/header/header.vue";

// 引入bar组件
import myTab from "./components/tab/tab.vue";

export default {
  components: {
    myHeader, // 挂载header组件到aap.vue；
    myTab // 挂载bar组件到aap.vue；
  },
  created(){
      this.$store.commit("getUserCart");
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

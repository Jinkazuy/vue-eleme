<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="tab">
    <div class="bar border-1px">
      <!--设置路由连接-->
      <!--如果这里的router-link和router-view黄色高亮，不用管，因为在router.js中已经引入了vue-router包-->
      <div class="tab-item">
        <!--router-link默认渲染的是span标签，这里设置成div，是为了增加点击区域-->
        <router-link to="/goods" tag="div">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" tag="div">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" tag="div">商家</router-link>
      </div>
    </div>
    <!--路由展示内容-->
    <!--将商家信息、该商家购物车实时数据 传递给当前的路由组件-->
    <router-view :sellerInfo="sellerInfo" :getSellerCart="getSellerCart"></router-view>

  </div>
</template>

<script>
export default {
  name: "tab.vue",
  // 接收app.vue传过来的商家信息、该商家下购物车是实时数据
  props: ["sellerInfo", "getSellerCart"]
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

// 引入1px border 样式，虽然main.js中引入了集成所有css、styl的样式，但是这里不引入的话会出问题；
@import "../../assets/styl/mixin.styl";

// 媒体查询，webpack打包时，好像自己做媒体查询，待验证；
// 因为设计稿是@2x=750px，所以开发时候应该用@1x的去缩放，所以这里缩小1倍，也就是按着375尺寸去做；
// 兼容性问题，在webpack打包时，用到了 vue-l  oader下的postCss这个插件，就自动的解决了css样式的兼容问题；
// 所以这里只需要些基本的css就可以了；


#tab
  height: 40px;
  width: 100%;

  // 承载商品、评论、商家 按钮 的父级元素；
  .bar
    display: flex; // 使用flex布局，将商品、评论、商家水平排列
    height: 100%;
    width: 100%;
    // 调用1px border的函数；
    // 因为子集用了定位，所以这个.bar父级也要用定位(在这个border-1px的混入中已经写好了)；
    border-1px(rgba(7, 17, 27, 0.1))

    // 商品、评论、商家 按钮；
    .tab-item
      // width: 33.33333%; 因为是用了flex，所以设置每个元素的占比就行，不用设置宽度了；
      // 子元素在设置flex1后，父元素就会根据子元素的个数去做综合，然后每个子元素的占比就是flex:xx；
      // 这里因为设置每个子元素都是1，所以就是每个子元素占父元素的1/3；
      flex: 1; // 使用flex布局,水平 平均部分；
      text-align: center; // 实现文字水平居中；
      line-height: 40px; // 设置行高等于tab高度，实现文字垂直居中；
      font-size: 14px;
      color: rgb(77, 85, 93); // router-link 文字默认颜色

      // 因为在router.js中重置了router-link的名称，设置激活router-link样式；
      .myactive
        color: rgb(240, 20, 20);

// router-link 文字激活颜色
</style>

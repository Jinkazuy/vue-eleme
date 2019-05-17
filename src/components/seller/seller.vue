<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="seller">
    <!--评分区-->
    <div class="selle-score">
      <!--综合评分-->
      <div class="com-score">
        <div class="com-number">{{sellerInfo.serviceScore}}</div>
        <div class="com-text">综合评分</div>
        <div class="com-other-height">高于周围商家{{sellerInfo.rankRate}}%</div>
      </div>
      <!--竖线-->
      <div class="border-col-1px border-col"></div>
      <!--星星评分-->
      <div class="star-score">
        <ul>
          <li>
            <span class="text">服务态度</span>
            <!--这里的48是控制分辨率的，因为有多种尺寸的星星，24px\36px\48px-->
            <star :sellerstar="sellerInfo.serviceScore" :starsize="36"></star>
            <span class="text-number">{{sellerInfo.serviceScore}}</span>
          </li>
          <li>
            <span class="text">服务态度</span>
            <!--这里的48是控制分辨率的，因为有多种尺寸的星星，24px\36px\48px-->
            <star :sellerstar="sellerInfo.score" :starsize="36"></star>
            <span class="text-number">{{sellerInfo.score}}</span>
          </li>
          <li>
            <span class="deliveryTime text">送达时间</span>
            <span class="deliveryTime-number text">{{sellerInfo.deliveryTime}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!--评论区-->
    <!--商品评价模块-->
    <div class="seller-wrapper">
      <ratings :ratings="goodsInfoCurrentGoods.ratings" :sellerAllGoods="sellerAllGoods" class="seller-ratings"></ratings>
    </div>
  </div>
</template>

<script>
// 引入 better-scroll 这个用于处理滚动的插件，但记得先安装：npm install better-scroll --save
import BScroll from "better-scroll";


// 引入评分组件；
import star from "../star/star.vue";
// 引入商品评价组件；
import ratings from "../ratings/ratings";

export default {
  name: "seller.vue",
  data() {
    return {
        // 因为不需要 单个商品数据，所这里重置为空
        goodsInfoCurrentGoods:{}
    }
  },
  mounted() {
      // 生命周期函数，在DOM树生成后执行；
      // 调用初始化滚动插件的函数；
      this.scrollInit();
  },
  props: ["sellerInfo","sellerAllGoods"],
  methods: {
      scrollInit() {
          // 初始化滚动插件；
          // 在methods中初始化了之后，别忘了在mounted中调用这个初始化函数；
          let sellerWrapper = document.querySelector(".seller-wrapper");

          // better-scroll的实例对象，提供一个API，能够实时监听这个组件的滚动位置,创建实例的时候，后边传入probeType: 3;
          // 然后这个实例化对象，就能监听滚动事件，其中的xx就能拿到实时滚动的位置了；
          // 左侧列表因为需要点击，但是better-scroll会默认禁止点击事件，那么在配置的时候加上click:true即可；
          this.sellerScroll = new BScroll(sellerWrapper, { click: true });
      }
  },
  components: {
      star,
      ratings
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../../src/assets/styl/mixin.styl";
#seller
  position: absolute;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f3f5f7;
  z-index: -100;
  /*商家评分*/
  .selle-score
    //使用flex布局，然后将左边的综合评分的宽度写成百分比，
    //中间的1px固定就是1px
    //右边的占用剩余宽度
    //这样就能实左右的同时缩放并且不会平均分布
    display: flex;
    height: 107px;
    width: 100%;
    padding: 18px 0;
    background-color: #fff;
    border-top: 1px solid #e6e7e8;
    border-bottom: 1px solid #e6e7e8;
    box-sizing: border-box;
    /*综合评分*/
    .com-score
      width: 36%;
      height 100%;
      /*background-color: #fafafa;*/
      text-align: center;
      box-sizing: border-box;
      padding-top: 1px;
      .com-number
        font-size: 24px;
        color: #ff9900;
        margin-bottom: 10px;
      .com-text
        font-size: 12px;
        color: #07111b;
        margin-bottom: 8px;
      .com-other-height
        font-size: 10px;
        color: #93999f;
    /*1px竖线*/
    .border-col
      width: 1px;
      height: 100%;
      border-col-1px(rgba(0, 0, 0, .1))
    /*星星评分*/
    .star-score
      flex: 1;
      height: 100%;
      font-size: 12px;
      line-height: 14px;
      vertical-align: bottom;
      padding-left: 24px;
      padding-top: 4px;
      box-sizing: border-box;
      // 这里媒体查询，如果是最大宽度320情况下，就会回行，所以这里给padding-left4px;
      @media (max-width: 320px) {
        padding-left: 4px;
      }
      li
        margin-bottom: 8px;
        .text
          color: #07111b;
          margin-right: 10px;
        //  由于星星组件封装的不是特别好，所以这里手动修改一些样式；
        #star
          display: inline-block;
          width: 106px;
          height: 15px;
          margin: 0;
          margin-right: 10px;
        .text-number
          color: #ff9900;
        .deliveryTime
          margin-right: 13px;
        .deliveryTime-number
          color: #93999f;


  /*评论*/
  .seller-wrapper
    position: absolute;
    top: 126px;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -111;
</style>

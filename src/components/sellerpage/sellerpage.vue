<template>
  <div id="sellerpage">
    <!--商家信息-->
    <div class="seller-describe">
      <div class="seller-describe-info">
        <h1>{{ sellerInfo.name }}</h1>
        <ul class="clearfix border-1px">
          <li class="seller-describe-star">
            <star :sellerstar="sellerInfo.serviceScore" :starsize="36"></star>
          </li>
          <li class="seller-describe-number">({{ sellerInfo.sellCount }})</li>
          <li class="seller-describe-sale">月售{{ sellerInfo.sellCount }}单</li>
        </ul>
        <div class="selle-collection" @click="clickCollection">
          <i :class="['iconfont',{'collection-true':sellerCollection}]">&#xe605;</i>
          <div>{{sellerCollection===true?'已收藏':'收藏商家'}}</div>
        </div>
      </div>
      <!--价格信息-->
      <div>
        <ul class="price-info">
          <li>
            <span class="title">起送价</span>
            <div>
              <span>{{ sellerInfo.minPrice }}</span>
              <span>元</span>
            </div>
          </li>
          <li>
            <span class="title">商家配送</span>
            <div>
              <span>{{ sellerInfo.deliveryPrice }}</span>
              <span>元</span>
            </div>
          </li>
          <li>
            <span class="title">平均配送时间</span>
            <div>
              <span>{{ sellerInfo.deliveryTime }}</span>
              <span>分钟</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-scroll clearfix">
      <div>
        <!--商家公告-->
        <div class="seller-Events">
          <h1>活动与公告</h1>
          <p>
            {{ sellerInfo.bulletin }}
          </p>
          <ul>
            <li v-for="item in sellerInfo.supports">
              <span :class="'supportsIcon' + item.type"> </span>
              <span>{{ item.description }}</span>
            </li>
          </ul>
        </div>
        <!--商家实景-->
        <div class="seller-live">
          <h1>卖家实景</h1>
          <div class="scroll-seller-live">
            <div class="scroll-seller-live-box">
              <img v-for="item in sellerInfo.pics" :src="item" alt="" />
            </div>
          </div>
        </div>
        <!--商家信息-->
        <div class="information">
          <h1 class="border-1px">商家信息</h1>
          <p v-for="item in sellerInfo.infos">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import star from "../star/star";

// 引入 better-scroll 这个用于处理滚动的插件，但记得先安装：npm install better-scroll --save
import BScroll from "better-scroll";

export default {
  name: "sellerpage",
  data() {
    return {
      // 商家是否已收藏默认是没有，在created的时候，检查调用检查是否收藏，然后重新赋值；
      sellerCollection: false
    };
  },
  props: ["sellerInfo"],
  beforeUpdate() {
    // 这时候，表示 我们的界面还没有被更新，但内存中的数据已经被更新了；
    // 调用初始化滚动插件的函数；
    this.$nextTick(() => {
      this.scrollInit();
    });
  },
  created() {
    // 调用检查是否已收藏商家的函数
    this.collection();
  },
  methods: {
    scrollInit() {
      // 初始化滚动插件；
      // 在methods中初始化了之后，别忘了在mounted中调用这个初始化函数；
      let pageScroll = document.querySelector(".page-scroll");

      // 横向滚动图片列表，需要先计算出元素的宽度；
      var onePic = 120 + 6;
      var length = document.querySelector(".scroll-seller-live-box")
        .childElementCount;
      document.querySelector(".scroll-seller-live-box").style.width =
        onePic * length - 6 + "px";
      let scrollSellerLive = document.querySelector(".scroll-seller-live");

      // better-scroll的实例对象，提供一个API，能够实时监听这个组件的滚动位置,创建实例的时候，后边传入probeType: 3;
      // 然后这个实例化对象，就能监听滚动事件，其中的xx就能拿到实时滚动的位置了；
      // 左侧列表因为需要点击，但是better-scroll会默认禁止点击事件，那么在配置的时候加上click:true即可；
      this.pageScroll = new BScroll(pageScroll, { click: true });
      // 横向滚动默认是禁止的，需要开启配置
      this.scrollSellerLive = new BScroll(scrollSellerLive, {
        click: true,
        scrollX: true
      });
    },
    // 检查收藏逻辑
    collection() {
      // 通过全局数据查找该商家下，是否有‘收藏’相关属性
      if (this.sellerInfo.collection) {
        console.log("收藏了");
        // 收藏了就将sellerCollection 改为 true
        this.sellerCollection = true;
      } else {
        console.log("没有收藏");
        // 没有收藏，就不用动sellerCollection
        this.sellerCollection = false;
      }
    },
    // 点击收藏罗逻辑
    clickCollection() {
      // 更改数据库的状态
      // 因为没有数据接口，操作JSON文件比较麻烦，所以这类暂时模拟一下状态，不做数据操作了；
      this.sellerCollection = true;
      // TODO:这里没有做JSON文件的修改，其实是应该向数据库提交收藏、取消收藏，然后再重新调用检查收藏的函数；

      // 然后再重新调用检查收藏函数
      this.collection();
    }
  },
  components: {
    star
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../../src/assets/styl/mixin.styl";
#sellerpage
  position: absolute;
  left: 0;
  top: 174px; // 这个定位是用header+二级tab的高度来的；
  bottom: 0; // 底部栏的高度；有了top和bottom，这样就不用设置height了；
  width: 100%;
  background-color: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, .1);
  padding-bottom: 48px; //这里将padding预留出给购物车bar的距离；
  overflow: hidden; // 因为左右两栏都是滚动的，所以父级要隐藏超出的部分；
  box-sizing: border-box;
  /*头部信息*/
  .seller-describe
    width: 100%;
    padding: 18px;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    margin-bottom: 16px;
    z-index: 10;
    position: absolute;
    .seller-describe-info
      h1
        font-size: 14px;
        color: #07111b;
        font-weight: 700;
      ul
        padding: 8px 0 38px 0;
        border-1px(rgba(7, 17, 27, .1))
        li
          float: left;
        .seller-describe-star
          width: 110px;
          #star
            margin: 0 auto;
            width: 100%;
            height: 18px;
        .seller-describe-number, .seller-describe-sale
          font-size: 10px;
          color: #4d555d;
          vertical-align: bottom;
          line-height: 18px;
        .seller-describe-number
          margin-right: 10px;
      .selle-collection
        text-align: center;
        position: absolute;
        right: 18px;
        top: 20px;
        i
          color: #93999f;
          font-size: 24px;
          &.collection-true
            color: #f01414;
        div
          margin-top: 6px;
          font-size: 10px;
    /*价格信息*/
    .price-info
      width: 100%;
      display: flex;
      padding-top: 16px;
      li:nth-of-type(2)
        border-col-1px(rgba(7, 17, 27, .1));
      li:nth-of-type(3)
        border-col-1px(rgba(7, 17, 27, .1));
      li
        flex: 1;
        text-align: center;
        box-sizing: border-box;
        .title
          font-size: 10px;
          color: #93999f;
        div
          margin-top: 6px;
          span:first-of-type
            font-size: 24px;
            color: #07111b;
            vertical-align: baseline;
            line-height: 24px;
          span:last-of-type
            font-size: 10px;
            vertical-align: baseline;
            line-height: 24px;
  .page-scroll
    position: absolute;
    left: 0;
    top: 180px;
    bottom: 0;
    width: 100%;
  /*活动与公告*/
  .seller-Events
    width: 100%;
    padding: 18px;
    background-color: #fff;
    box-sizing: border-box;
    border-top: 1px solid rgba(7, 17, 27, .1);
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    margin-bottom: 16px;
    h1
      font-size: 14px;
      color: #07111b;
      font-weight: 700;
    p
      padding: 15px 12px 22px;
      font-size: 12px;
      color: #f01414;
      line-height: 24px;
      border-1px(rgba(7, 17, 27, .1));
    ul
      li
        padding: 16px 12px;
        box-sizing: border-box;
        border-1px(rgba(7, 17, 27, .1));
        span:first-of-type
          display: inline-block;
          width: 16px;
          height: 16px;
          background-size: 100% 100%;
          margin-right: 6px;
          &.supportsIcon0
            bgImg("../../../resource/img/decrease_3")
          &.supportsIcon1
            bgImg("../../../resource/img/discount_3")
          &.supportsIcon2
            bgImg("../../../resource/img/special_3")
          &.supportsIcon3
            bgImg("../../../resource/img/invoice_3")
          &.supportsIcon4
            bgImg("../../../resource/img/guarantee_3")
        span:last-of-type
          font-size: 12px;
          color: #07111b;
      li:last-of-type
        border-1px(rgba(7, 17, 27, 0));
        padding: 16px 12px 0;

  /*商家实景*/
  .seller-live
    padding: 16px;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 1px solid rgba(7, 17, 27, .1);
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    margin-bottom: 16px;
    h1
      font-size: 14px;
      color: #07111b;
      font-weight: 700;
      margin-bottom: 12px;
    .scroll-seller-live
      width: 100%;
      overflow: hidden;
      .scroll-seller-live-box
        white-space: nowrap;
        /*宽度是同级JS计算出来的*/
        img
          width: 120px;
          height: 90px;
          background-color: red;
          margin-right: 6px;


  /*商家信息*/
  .information
    padding: 16px;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 1px solid rgba(7, 17, 27, .1);
    border-bottom: 1px solid rgba(7, 17, 27, .1);
    h1
      font-size: 14px;
      color: #07111b;
      font-weight: 700;
      padding-bottom: 12px;
      border-1px(rgba(7, 17, 27, .1));
    p
      font-size: 12px;
      color: #07111b;
      padding: 16px 10px;
      border-1px(rgba(7, 17, 27, .1));
    p:last-of-type
      padding: 16px 10px 0;
      border-1px(rgba(7, 17, 27, 0));
</style>

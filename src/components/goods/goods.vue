<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="goods">
    <div class="menu-wrapper">
      <ul class="foodslist">
        <!--for循环必须有key，这里先不加-->
        <!--点击时候调用定义好的函数，并且点击的li的元素的item传入这个函数中-->
        <li v-for="item in foodsListMenu" @click="foodslistNow(item)">
          <div>
            <div>
              <!--因为不是每个类别都有优惠的icon，所以要判断-->
              <i v-if="item.type>0?1:0" :class="['goodsSupportsIcon'+item.type]"></i><span>{{ item.name }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="cont-wrapper">
      <ul>
        <li>
          <h2>单人特色套餐</h2>
          <div class="clearfix">
            <img src="" alt="图片" />
            <ul class="goodsInfoLise">
              <li class="foodName">皮蛋瘦肉粥套餐</li>
              <li class="classification">咸粥</li>
              <li class="salesVolume"><span>月售</span><span>好评率</span></li>
              <li class="price"><span class="priceNow">￥<i>24</i></span><span class="priceInvalid">￥28</span></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "goods.vue",
  data() {
    return {
      // 存放ajax获取到的商家数据
      goodsInfo: [],
      // 存放商品种类列表，如果直接在每个li里循环的话，会报错（但是结果是对的）；
      foodsListMenu: [],
      // 右侧栏展示的数据的暂存区域，会根据每个左侧li点击时变化数据
      contWrapperList: []
    };
  },
  created() {
    // 通过ajax拿到数据，因为此时与这个组件相关的组件都没有拿到数据，所以由这个组件自己拿数据；
    this.getgoodsData();
  },
  methods: {
    getgoodsData() {
      // 因为在main.js中已经引入了vue-resource 所以这里可以直接使用this.$http的方法；
      this.$http.get("/api/goods").then(goodsResult => {
        console.log(goodsResult);
        this.goodsInfo = goodsResult;
        this.foodsListMenu = this.goodsInfo.body.data;
      });
    },
    foodslistNow(contList) {
      console.log(contList)
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数，用于获取不同分辨率的优惠icon；
@import "../../../src/assets/styl/mixin.styl"
#goods
  display: flex;//父级规定为flex，那么左侧栏固定，右侧栏flex: 1;就可以宽度自适应了；
  position: absolute;
  left: 0;
  top: 174px; // 这个定位是用header+二级tab的高度来的；
  bottom: 46px; // 底部栏的高度；有了top和bottom，这样就不用设置height了；
  width: 100%;
  background-color: #999;
  overflow: hidden;// 因为左右两栏都是滚动的，所以父级要隐藏超出的部分；
  .menu-wrapper
    flex: 0 0 80px; // 参数1：等分数，参数2：缩放情况，参数3：宽度；
    width: 80px; // 这里设置width是因为安卓可能对flex有兼容性问题，所以加上以防万一；
    height: 100%;
    background-color: #f3f5f7;
    overflow: auto; // 让超出的元素可以滚动；
    ul
      li
        width: 100%;
        height: 54px;
        color: rgb(240, 20, 20);
        &>div
          width: 56px;
          height: 100%;
          font-size: 12px;
          line-height: 14px;
          margin: 0 auto;// 左右居中
          border-bottom: 1px solid rgba(7, 17, 27, .1);
          display: flex;// 用于文字垂直居中；
          align-items: center; // 让子集元素纵向垂直；align-items属性用于弹性 容器
          div
            i
              display: inline-block;
              font-style: normal;
              width:12px;
              height:12px;
              margin-right: 2px;
              // 这里是商家优惠活动类型的小icon背景图，同样使用在mixin中封装好的拿背景图的函数；
              &.goodsSupportsIcon0
                bgImg("../../../resource/img/decrease_1")
                background-size: 100% 100%;
              &.goodsSupportsIcon1
                bgImg("../../../resource/img/decrease_3")
                background-size: 100% 100%;
              &.goodsSupportsIcon2
                bgImg("../../../resource/img/special_3")
                background-size: 100% 100%;
              &.goodsSupportsIcon3
                bgImg("../../../resource/img/invoice_1")
                background-size: 100% 100%;
              &.goodsSupportsIcon4
                bgImg("../../../resource/img/special_1")
                background-size: 100% 100%;
            span
              color: #000;
  // 因为左侧栏是固定宽度，所以右侧栏flex就是占父级的1/1;达到自适应；
  .cont-wrapper
    flex: 1;
    height: 100%;
    overflow: auto; // 让超出的元素可以滚动；
    &>ul
      width: 100%;
      height: 50px
      background-color: pink;
      li
        width: 100%;
        h2
          color: #93999f;
          line-height: 26px;
          font-size: 12px;
          background-color: #f3f5f7;
          padding-left: 12px;
        &>div
          width: 100%;
          height: 110px;
          display: flex;
          background-color: #fff;
          img
            display: block;
            width: 57px;
            height: 57px;
            margin: 18px 10px 0 18px;
            background-color: pink;
          ul
            flex: 1;// 图片限制宽度，这个ul就占剩下的宽度，这样能够实现左右分布；就不用float了；
            font-size: 0; //先设置字号为0，取消文字上下的一点点不好测量的间距；
            margin-top: 20px;
            li
              margin-bottom: 6px;
            .foodName
              font-size: 14px;
              color: #07111b;
            .classification
              font-size: 10px;
              color: #93999f;
            .salesVolume
              font-size: 10px;
              color: #93999f;
              span:first-of-type
                margin-right: 12px;
            .price
              .priceNow
                margin-right: 8px;
                vertical-align: bottom;
                font-size: 10px;
                color: #f01414;
                font-weight: 700;
                i
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 700;
                  vertical-align: bottom;
              .priceInvalid
                text-decoration: line-through;
                font-size: 10px;
                color: #93999f;


</style>

<template>
  <!--浮层主体，想要实现缓动效果，VUE提供了transition标签，加上后，在css中定义动画即可-->
  <!--这个fade对应的是css中的类名，同样用到了动画声明周期-->
  <!--也就实现了在用v-show或者v-if的时候也能是实现动画效果-->
  <!--也就是说，在transition标签中的任何元素，在发生变化的时候，会调用这个transition定义好的在css的动画生命周期函数的动画效果-->
  <transition name="fade">
    <div id="detail" v-show="tsShow">
      <!--这里注意！经典sticky-footers布局=====开始======-->
      <!--相关文章：https://www.cnblogs.com/libin-1/p/6083211.html-->
      <!--用到的就是，底部贴合元素，与这个detail-wrapper元素时同级的-->
      <div class="detail-wrapper clearfix">
        <!--然后这个内容的元素，需要放在detail-wrapper中-->
        <div class="detail-main">
          <h1>{{ sellerInfo.name }}</h1>
          <!--这里的48是控制分辨率的，因为有多种尺寸的星星，24px\36px\48px-->
          <star :sellerstar="sellerInfo.serviceScore" :starsize="48"></star>
          <!--这里的横线，用的就是flex布局，分配剩余空间-->
          <div class="sellerInfo">
            <div class="line"></div>
            <div class="title">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="discountList clearfix">
            <!--for循环必须有key，这里先不加-->
            <li v-for="item in sellerInfo.supports">
              <span :class="['supportsIcon' + item.type, 'supportsType']"></span>
              <span>{{ item.description }}</span>
            </li>
          </ul>
          <div class="sellerNotice">
            <div class="line"></div>
            <div class="notice">商家信息</div>
            <div class="line"></div>
          </div>
          <!--大段的文字，请用p标签，语义化更强-->
          <p class="sellsrBulletin">{{ sellerInfo.bulletin }}</p>
        </div>
      </div>
      <!--关闭按钮-->
      <div class="detail-close" @click="detailClose">
        <span class="iconfont">&#xe603;</span>
      </div>
      <!--这里注意！经典sticky-footers布局=====结束======-->
    </div>
  </transition>
</template>

<script>
// 引入评分组件；
import star from "../star/star.vue";
export default {
  name: "detail",
  data() {
    return {
      closeToast: false
    };
  },
  created() {},
  methods: {
    detailClose() {
      // 222、这里用于控制detail的显示与隐藏，用的是父子之间传值，
      // 222、header向detail传一个方法过来，带个参数，然后在关闭浮层的时候，
      // 222、将这个值传到这个函数中，此时header通过形参拿到了这个值，
      // 222、然后把 传给detail用于v-show判断的值 赋值 = detail通过方法的参数传过来的值；

      // 那么也就形成了，header点击时，值变为true，值发生变化，从新传递给detail的tsShow变量； => 浮层展开
      // 在detail点击的时候，将已经定义好的false，通过调用header传过来的函数的参数，传给header，
      // 然后header拿到这个函数的形参，也就是拿到了false，然后再重新赋值给 传递给detail的tsShow变量对应的值; => 浮层关闭
      // 也就是说，header的toastShow值是可以变化的，在点击的时候toastShow=true，在接收到detail通过参数传值的时候toastShow=通过函数的参数传过来的false;
      this.$emit("detailShow", this.closeToast);
    }
  },
  // 111、这里用于控制detail的显示与隐藏，用的是父子之间传值，
  // 111、首先由header传过来一个值，那么detail把这个值用到v-show上；
  props: ["tsShow", "sellerInfo"],
  components: {
    star
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数；
@import "../../../src/assets/styl/mixin.styl"

#detail
  position: fixed; // 使用固定定位，不能跟着header组件跑了；
  top: 0;
  left: 0;
  z-index: 99; // 设置层级，为了能够遮住所有元素；
  width: 100%;
  height: 100%;
  transition: all .2s; // 配合.fade-transition实现浮层的过度效果；
  overflow: auto; // 为了使其能够上下滚动；
  background-color: rgba(7, 17, 27, .8)
  // 背景模糊，只有在ios能实现
  backdrop-filter: blur(10px);
  // 让浮层显示与隐藏有动画效果，给元素加上transition属性，与v-show不冲突；
  // 利用了元素显示与隐藏切换时候的动画声明周期函数的方法；
  // 因为v-show控制的是元素的display: none；但这个transition标签配合就能实现过度动画效果；
  // 因为transition加了name属性，所以这里的v就用name替换了；
  // 具体的动画声明周期函数，去看笔记或者官网，有6种状态，这里中用到4种；
  // v-enter：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
  &.fade-enter// 入场前的动画生命周期函数样式
    opacity: 0;

  &.fade-enter-to,// 入场结束，两个状态一直，可以写在一起；
  &.fade-leave-active// 退场前
    opacity: 1;

  &.fade-leave-to // 离场结束
    opacity: 0;

  // 配合 sticky-footers布局 的样式；
  // 相关文章：https://www.cnblogs.com/libin-1/p/6083211.html
  .detail-wrapper
    height: auto;
    min-height: 100%;
    .detail-main
      width: 100%;
      padding: 64px 32px; /* padding-bottom必须使用和footer相同的高度 */
      box-sizing: border-box;
      h1
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        text-align: center;
        margin-bottom: 16px;
      .star
        width: 100%;
        height: 24px
        background-color: #fff;
        margin-bottom: 24px;
      // 卖家信息,两条横线；
      // 设置父级display为flex；
      .sellerInfo
        position: relative;
        display: flex;
        width: 100%;
        height: 14px
        font-size: 14px;
        color: #fff;
        margin-bottom: 24px;
        text-align: center;
        font-weight: 700;
        //标题
        .title
          width: 90px;
          margin: 0 auto;
        // 这里规定line占比是剩余的1，那么也就是剩余的内容，每个横向占1/2
        // 就等于，出去了固定端宽度的标题的宽度，剩下的由这两个line元素平分；
        .line
          flex: 1;
          margin-top: 6px;
          background-color: #fff;
          opacity: .2;
          height: 2px;
      // 优惠信息
      .discountList
        padding-left: 12px;
        box-sizing: border-box;
        color: #fff;
        margin-bottom: 16px;
        li
          font-size: 12px;
          margin-bottom: 12px;
          span:last-of-type
            margin-left:4px;
       // 这里是商家优惠活动类型的小icon背景图，同样使用在mixin中封装好的拿背景图的函数；
      .supportsType
        display: inline-block;
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
      .supportsIcon0
        bgImg("../../../resource/img/decrease_1")
      .supportsIcon1
        bgImg("../../../resource/img/discount_1")
      .supportsIcon2
        bgImg("../../../resource/img/guarantee_1")
      .supportsIcon3
        bgImg("../../../resource/img/invoice_1")
      .supportsIcon4
        bgImg("../../../resource/img/special_1")
      // 卖家公告，同样用到了flex布局，让两条线占评分剩下的宽度；
      .sellerNotice
        display: flex;
        position: relative;
        width: 100%;
        height: 14px
        font-size: 14px;
        color: #fff;
        margin-bottom: 24px;
        text-align: center;
        font-weight: 700;
        // 商家信息标题
        .notice
          width: 90px;
          margin: 0 auto;
        // 这里规定line占比是剩余的1，那么也就是剩余的内容，每个横向占1/2
        // 就等于，出去了固定端宽度的标题的宽度，剩下的由这两个line元素平分；
        .line
          flex: 1;
          margin-top: 6px;
          background-color: #fff;
          opacity: .2;
          height: 2px;
      .sellsrBulletin
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 12px;
        color: #fff;
        line-height: 24px;

  // 关闭按钮icon的父级；
  .detail-close
    position: relative;
    margin-top: -64px; /* footer高度的负值 */
    height: 64px;
    clear:both;
    text-align: center;
    // 关闭的x的icon
    span
      color: rgba(255, 255,255, .5);
      font-size: 32px;
</style>

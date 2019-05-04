<template>
  <div id="star">
    <!--这里要用v-if来控制li的显示，否则一开始的时候stars是0，那么li的v-for就不生效了；-->
    <ul class="trueStar" v-if="sellerStar">
      <li v-for="className in starsClass" :class="className"></li>
    </ul>
    <ul class="emptyStar">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "star",
  data() {
    return {
      // 评分分数；
      sellerStar: 0,
      // 根据评分分数四舍五入得到的星星的类名；
      starsClass: []
    };
  },
  created() {},
  methods: {},
  // 拿到商家服务评分
  props: ["sellerstar", "starsize"],
  // 因为通过ajax拿到商家数据，然后再传给detail，然后再次通过detail传给star.vue，
  // JK推测会有延迟问题，所以这里用监听数据改变，然后拿到评分数字；
  watch: {
    sellerstar: function(newVal) {
      // 拿到评分，传给star自身的data数据；
      this.sellerStar = newVal;
      // 拿到评分，将评分的个位数整数，进行循环，然后把类名添加到数组中，用于ul渲染整颗的星星；
      for (var i = 0; i < parseInt(this.sellerStar); i++) {
        // 这里加上starseze，这样生产的类名就是 trueStar-whole48、trueStar-whole36，从而调取相应的类名，获取不同尺寸背景图RUL；
        this.starsClass[i] = "trueStar-whole" + this.starsize;
        // 此时像数组中插入获取整个星星的类名
      }
      // 如果评分的小数点1位大于等于5，那么就多显示半颗星；
      // console.log("评分小数点后1位" + (this.sellerStar * 10) % 10);
      if ((this.sellerStar * 10) % 10 >= 5) {
        // 这里加上starseze，这样生产的类名就是 trueStar-half48、trueStar-half36，从而调取相应的类名，获取不同尺寸背景图RUL；
        this.starsClass.push("trueStar-half" + this.starsize);
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../assets/styl/mixin.styl"
#star
  height: 24px;
  width: 200px;
  margin: 0 auto 28px;
  position: relative;
  // 实心星星ul
  .trueStar
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    // 实心1整颗星星,值设置样式，不是设置背景图路径；
    li
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      float: left;
      margin: 0 10px;
    // 实心星星的路径，类名由父组件传值过来props:["starsize"]控制；
    // 整颗星星 - 24px
    .trueStar-whole24
      bgImg("../../../resource/img/star24_on")
    // 整颗星星 - 36px
    .trueStar-whole36
      bgImg("../../../resource/img/star36_on")
    // 整颗星星 - 48px
    .trueStar-whole48
      bgImg("../../../resource/img/star48_on")
    // 实心半颗星星 - 24px
    .trueStar-half24
      bgImg("../../../resource/img/star24_half")
    // 实心半颗星星 - 36px
    .trueStar-half36
      bgImg("../../../resource/img/star36_half")
    // 实心半颗星星 - 48px
    .trueStar-half48
      bgImg("../../../resource/img/star48_half")
  // 空心星星
  .emptyStar
    position: absolute;
    top: 0;
    left: 0;
    li
      width: 20px;
      height: 20px;
      background-size: 100% 100%;
      float: left;
      margin: 0 10px;
      bgImg("../../../resource/img/star48_off")
</style>

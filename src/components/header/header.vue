<template>
  <div id="myHeader" ref="myHeader">
    <!--引入img设置了margin,所以div要引用clearfix,已经在reset.css中JK写好了-->
    <div class="sellerLogo">
      <!--绑定数据，拿到商家logo-->
      <img :src="sellerInfo.avatar" alt="商家logo" />
    </div>
    <ul class="sellerMsg">
      <li>
        <span>品牌</span>
        <!--拿到商家名称，使用插值表达式也行，使用v-text也行-->
        <span>{{ sellerInfo.name }}</span>
      </li>
      <li>
        <!--拿到外卖配送方式-->
        <!--<span v-text="sellerInfo.description">这里的内容会被v-text替换掉</span>-->
        <!--<span>&nbsp;/&nbsp;</span>-->
        <!--拿到配送时间-->
        <!--<span v-text="sellerInfo.deliveryTime">这里的内容会被v-text替换掉</span>-->
        <!--<span>分钟送达</span>-->
        <!--其实可以写成:↓， 上边的方式识别起来更加方便，但是徒增代码量；-->
        <span>{{ sellerInfo.description }}&nbsp;/&nbsp;{{sellerInfo.deliveryTime}}分钟送达</span
        >
      </li>
      <!--这里是判断优惠信息是否存在，如果不存在就是空数组-->
      <li v-if="sellerInfo.supports">
        <!--如果sellerInfo.supports不是空的话，就进入下方渲染-->
        <!--这个icon本来是icon，但是JK用手直接写的-->
        <!--但是，这里的减并非写死的，而是根据后台返回的代码，从而渲染不同的优惠icon-->
        <!--<span>减</span>-->
        <!--那么这里就是有4中方案，后台返回的优惠状态码是0123，就对应着4个不同的背景图-->
        <!--所以先写好类,然后再通过拿到的状态码赋值给这个类名后边的数字,拿到对应的已经定义好的类，从而拿到对应的背景图；-->
        <!--拿到优惠信息数组的第[0]条，也就是第一条-->
        <!--那么这里最终拿到的类名就是：decrease0，然后就调用了定义好的对应0这个优惠信息的icon背景图；-->
        <span :class="['supportsIcon' + sellerInfo.supports[0].type]"></span>
        <!--因为这里用的表达式中取了supports的第0个索引，因为你异步请求方法那数据，所以一开始是拿不到supports的-->
        <!--那么在没有拿到这个数组的时候，去[0]索引的元素，肯定会报错！！！，因为此时的supports是undefined-->
        <!--所以！要在上边用v-if判断是supports是否不为0或者undefined-->
        <span>{{ sellerInfo.supports[0].description }}</span>
      </li>
    </ul>
    <div class="infoNumber" @click="openDetail">
      <!--优惠信息的个数-->
      <span>{{ supportsLength }}个</span>
      <span class="iconfont keyboard_arrow_right">&#xe60b;</span>
    </div>
    <!--Vue提供了HTML标签中 ref属性，通过 ref='xx' 后，在VM实例下的$refs下就有了xx这个对象，这个对象拿到的就是这个DOM对象或组件；-->
    <!--JK做完了点击展开高度之后，发现并没有这个功能，HHHHHH^^-->
    <ul class="bulletin" ref="bulletin" @click="openDetail">
      <li></li>
      <li>{{ sellerInfo.bulletin }}</li>
      <li class="iconfont keyboard_arrow_right">&#xe60b;</li>
    </ul>
    <!--模糊的背景头图-->
    <div class="bgBlur">
      <img :src="sellerInfo.avatar" />
    </div>
    <detail @detailShow="detailShow" :tsShow="toastShow" :sellerInfo="sellerInfo"></detail>
  </div>
</template>

<script>
// 引入浮层组件
import detail from "../detail/detail.vue";

// 这里定义ERR_OK是为了语义化，在拿到数据库返回结果的错误代码时用于判断；
// 其实加不加都可以，加上的话，看到ERR_OK就知道是数据库的错误代码为0，语义化更强些；
const ERR_OK = 0;

export default {
  data() {
    return {
      // 存放ajax获取到的商家数据
      sellerInfo: [],
      // 用于标识公告区域是否展开的标识0代表没展开，1代表展开；
      bulletinFlag: 0,
      // 获取优化活动的个数
      supportsLength: 0,
      // 用于控制detail的浮层显示与隐藏；
      toastShow: false
    };
  },
  components: {
    // 引入浮层组件，如果在这个文件中继续写，加上备注啥的，太多了；
    detail
  },
  created() {
    // VM实例的生命周期钩子函数，created钩子函数时候，
    // 这个VM实例组件的data和methods已经在内存中初始化完成，能够拿data和methods中的数据和方法了；
    this.getSellerInfo();
  },
  methods: {
    // 获取商家信息
    getSellerInfo() {
      // 发ajax请求
      // 获取商家信息数据的方法，引入main.js中引入了处理ajax第三方包：vue-resource
      // 所以这里可以直接使用.$http.get来获取轮播图
      // 通过.then 拿到结果；
      this.$http.get("/api/seller").then(result => {
        // console.log(result.body);

        if (result.body.errno === ERR_OK) {
          // 错误代码为0表示无错误，真是开发中可能会有其他的数字代号，具体的还是看后端返回的内容是什么；
          // 拿到的数据,放入预先设置好的空数组中，用于循环；

          // 成功了
          this.sellerInfo = result.body.data;
          // console.log(this.sellerInfo);

          // 设置商家优惠信息个数,本来可以直接在html标签中写{{sellerInfo.supports.length}}的，而且也会显示个数是5；
          // 但是控制台会报错 Error in render: "TypeError: Cannot read property 'length' of undefined"
          this.supportsLength = this.sellerInfo.supports.length;
        } else {
          // 获取失败
          // 因为引入了MintUI的toast组件，这里就可以直接使用Toast(),当然还可以传入很多参数(比如停留时间)，具体的看官网API就行；
          // Toast("加载轮播图失败。。。");
          // Toast是mintUI提供的组件，这个项目没用到mintUI，没有引入，所以这里不生效；
        }
      });
    },
    // 点击展开商家详情浮层，通过父子间相互传值实现；
    openDetail() {
      this.toastShow = true;
    },
    detailShow(el) {
      this.toastShow = el;
    }
    // 点击公告，展开高度，同时也要父级的myHeader元素展开高度
    // JK做完了点击展开高度的功能之后，发现并没有这个功能，HHHHHH^^
    // bulletinClick() {
    //   // Vue提供了HTML标签中 ref属性，通过 ref='xx' 后，在VM实例下的$refs下就有了xx这个对象，这个对象拿到的就是这个DOM对象或组件；
    //   if (this.bulletinFlag === 0) {
    //     // 拿到myHeader的DOM，用于 点击公告信息横条增加高度；
    //     this.$refs.myHeader.style.height = '200px';
    //     this.$refs.myHeader.style.transition = 'all .4s';
    //     // 拿到公告信息DOM，用于 点击增加高度；
    //     this.$refs.bulletin.style.height = '60px';
    //     this.$refs.bulletin.style.transition = 'all .4s';
    //     this.bulletinFlag = 1;
    //   } else if (this.bulletinFlag === 1) {
    //     console.log(123);
    //     // 拿到myHeader的DOM，用于 点击公告信息横条增加高度；
    //     this.$refs.myHeader.style.height = '134px';
    //     // 拿到公告信息DOM，用于 点击增加高度；
    //     this.$refs.bulletin.style.height = '28px';
    //     this.bulletinFlag = 0;
    //   }
    // }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数；
@import "../../../src/assets/styl/mixin.styl"

// 注意啊，尺寸都是缩放为@1的，设计稿是@2的，标注也是@2,所以缩放；
#myHeader // header组件最外层
  height: 134px;
  width: 100%;
  position: relative;
  // 背景模糊,因为背景图是通过ajax拿到的img标签图片，然后进行模糊的，所以这里只写样式;
  .bgBlur
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: -1;
    overflow: hidden;
    img
      // 这里设置宽度超出100%、top和left是因为如果模糊了，边上的像素就发虚，就透明了，底色也就露出来了；
      // 所以web不能像ps里锁定像素防止边上发虚发透明，所以将发虚变透明的内容移动出去了；
      width: 120%;
      position: absolute;
      top: -130px;
      left: -10px;
      opacity: .5;
      // 这个才是关键，能够设置元素整体模糊，就算文字都能模糊；
      filter: blur(4px);

  // logo start
  .sellerLogo
    height: 64px;
    width: 64px;
    background-color: #fff;
    position: absolute;
    top: 24px;
    left: 24px;
    border-radius: 2px;
    img
      width: 100%;
      htight: 100%;
      border-radius: 2px;
  // logo end

  //  ul start
  .sellerMsg
    position: absolute;
    top: 26px;
    left: 104px;
    // 使用 nth-of-type(x) 代替 nth-child(x) 也可以；
    li:nth-of-type(1)
      height: 22px;
      // 使用 first-of-type 代替 first-child 也行；
      span:first-of-type
        display: inline-block;
        width: 30px;
        height: 18px;
        background-color: #f01414;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        // vertical-align: middle; // 因为用到的太多，所以在reset.css直接改了；
        text-align: center;
        line-height: 18px;
        border-radius: 2px;
      span:last-child
        font-size: 18px;
        font-weight: 700;
        margin-left: 6px;
        line-height: 18px;
        color: #fff;
    li:nth-child(2)
      font-size: 12px;
      color: white;
      line-height: 20px;
    li:nth-child(3)
      span:first-of-type
        // 这个span就是不同的优惠类型
        //这里只写这个span的尺寸，具体的icon，写在下方了
        display: inline-block;
        width: 12px;
        height: 12px;
      // 这里是商家优惠活动类型的小icon背景图，同样使用在mixin中封装好的拿背景图的函数；
      .supportsIcon0
        bgImg("../../../resource/img/decrease_1")
        background-size: 100% 100%;
      .supportsIcon1
        bgImg("../../../resource/img/discount_1")
        background-size: 100% 100%;
      .supportsIcon2
        bgImg("../../../resource/img/guarantee_1")
        background-size: 100% 100%;
      .supportsIcon3
        bgImg("../../../resource/img/invoice_1")
        background-size: 100% 100%;
      .supportsIcon4
        bgImg("../../../resource/img/special_1")
        background-size: 100% 100%;
      span:last-of-type
        font-size: 10px;
        color: #fff;
        margin-left: 4px;
        line-height: 20px;
  //  ul end

  //  infoNumber start
  .infoNumber
    width: 43px;
    height: 24px;
    position: absolute;
    right: 12px;
    top: 67px;
    background-color: rgba(0, 0, 0, .2);
    border-radius: 12px;
    span:first-of-type
      position: absolute;
      left: 8px;
      line-height: 25px;
      font-size: 10px;
      color: #fff;
    .keyboard_arrow_right
      position: absolute;
      right: 6px;
      line-height:25px;
      color: #fff;
      font-size:10px;
//  infoNumber end

  /*底部公告条*/
  .bulletin
    position: absolute;
    bottom: 0;
    height: 28px;
    width: 100%;
    background-color: rgba(7, 17, 27, .2);
    padding: 0 12px;
    box-sizing: border-box;
    li
      float: left;
    /*公告icon  */
    li:first-of-type
      width: 22px;
      margin: 8px 4px 0 0;
      height: 12px;
      // 调用封装在mixin.styl下的获取背景图的函数，记得要在头部引入mixin.styl文件哈；
      bgImg("../../../resource/img/bulletin")
      background-size: 100% 100%;
    /*中间文字，使用文字移除隐藏*/
    li:nth-of-type(2)
      width: 88%;
      line-height: 29px;
      white-space: nowrap;
      overflow:hidden;
      text-overflow: ellipsis;
      font-size: 10px;
      color: #fff;
    /*小箭头*/
    li:nth-of-type(3)
      font-size: 12px;
      float: right;
      line-height: 29px;
      color: #fff;
</style>

<template>

        <div id="goodsinfo">
            <!--滚动组件，套在最外边-->
            <div class="better-scroll-wrapper goodsinfowrapper">
                <div class="goodsscrollinner">
                    <div class="goodsinfoimg">
                        <!--返回按钮-->
                        <div class="closeInfo" @click="GoodsInfoCloseInfo">
                            <i class="iconfont">&#xe602;</i>
                        </div>
                        <img :src="goodsInfoCurrentGoods.image" alt=""/>
                    </div>
                    <div class="goodsdescribe clearfix">
                        <h1>{{ goodsInfoCurrentGoods.name }}</h1>
                        <!--月售-->
                        <div class="sales">
                            <span class="onsale">月售{{ goodsInfoCurrentGoods.sellCount }}份</span>
                            <span class="evaluation">好评率{{ goodsInfoCurrentGoods.rating }}%</span>
                        </div>
                        <!--价格-->
                        <div class="price">
                            <span class="pricenew">￥<i>{{goodsInfoCurrentGoods.price}}</i></span>
                            <span class="priceold" v-if="goodsInfoCurrentGoods.oldPrice">￥{{goodsInfoCurrentGoods.oldPrice}}</span>
                        </div>
                        <!--加入购物车按钮-->
                        <transition name="tocart">
                            <div v-show="getDoodsNumber===0" class="tocart" @click="toCart">加入购物车</div>
                        </transition>
                        <!--加减号组件，将商品和商家名传入-->
                        <addgoods
                                :class="['goodsinfoadd', {'addshow':getDoodsNumber}]"
                                ref="adds"
                                :thisgoodsinfo="goodsInfoCurrentGoods"
                                :sellername="goodsInfoSellerName"
                                @getAddDom="getAddDomByGoodInfo"
                                :getSellerCart="getSellerCart"
                        ></addgoods>
                    </div>
                    <!--商品介绍模块，将商品的详情传进去-->
                    <!--如果没有记不显示这个模块-->
                    <introduce v-if="goodsInfoCurrentGoods.info" :goodsIntroduce="goodsInfoCurrentGoods.info"></introduce>
                    <!--商品评价模块-->
                    <ratings :ratings="goodsInfoCurrentGoods.ratings"></ratings>
                </div>
            </div>
        </div>

</template>

<script>
    // 引入 +— 号组件；
    import addgoods from "../addgoods/addgoods";

    // 引入商品介绍组件；
    import introduce from "../introduce/introduce";

    // 引入商品评价组件；
    import ratings from "../ratings/ratings";

    // 引入滚动插件
    import BScroll from 'better-scroll'

    export default {
        name: "goodsinfo",
        data() {
            return {
                // 判断显示‘加入购物车’还是加减号组件
                goodsNum: 0
            };
        },
        // 拿到父级传过来的商家名称 、 单个商品数据 、 该商家的购物车中所有的商品；
        props: ["goodsInfoCurrentGoods", "goodsInfoSellerName", "getSellerCart"],
        created() {},
        mounted() {
            // 生命周期函数，在DOM树生成后执行；
            // 调用初始化滚动插件的函数；
            this.scrollInit();

        },
        methods: {
            getAddDomByGoodInfo(AddEl) {
                // 实现小球动画，这个goodsinfo等于是goods.vue和加减号组件的一个中间传递者，
                // 将自己的加号组件的dom拿到手，再传给父级；
                console.log(AddEl)
                this.$emit("getAddDom", AddEl);
            },
            //关闭购物车，因为控制关闭和显示是在父级，所以调用通过父级的方法，控制父级的该变量；
            GoodsInfoCloseInfo() {
                this.$emit("closeInfo");
            },
            // 点击加入购物车按钮
            toCart() {
                // 调用加减号按钮组件中的 加号按钮对应的函数
                this.$refs.adds.addToCart();
                console.log(this.goodsInfoCurrentGoods)
            },
            scrollInit() {
                // 初始化滚动插件；
                // 在methods中初始化了之后，别忘了在mounted中调用这个初始化函数；
                let wrapper = document.querySelector(".goodsinfowrapper");
                // 因为需要点击，但是better-scroll会默认禁止点击事件，那么在配置的时候加上click:true即可；
                this.goodsInfoscroll = new BScroll(wrapper, { click: true });
            }
        },
        watch: { // 暂用的，打印出来商品信息
            goodsInfoCurrentGoods: function () {
                console.log(this.goodsInfoCurrentGoods);
            }
        },
        computed: {
            // 监听该商品在购物车中的数量，用于控制显示‘加入购物车’与加减号组件的切换显示
            getDoodsNumber() {
                // console.log(this.getSellerCart);
                if (this.getSellerCart) {
                    if (this.getSellerCart.goods !== undefined) {
                        for (var d = 0; d < this.getSellerCart.goods.length; d++) {
                            if (this.getSellerCart.goods[d].goodsInfo.name === this.goodsInfoCurrentGoods.name) {
                                // console.log(this.getSellerCart.goods[d].num);
                                return this.getSellerCart.goods[d].num;
                            }
                        }
                    }
                }
                return 0;
            }
        },
        components: {
            addgoods,
            introduce,
            ratings
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    // 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数，用于获取不同分辨率的优惠icon；
    @import "../../../src/assets/styl/mixin.styl";

    #goodsinfo
        //商品详情页最外层，使用fixed布局，并且z-index对于购物车即可
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        transition: all .2s;
        background-color: #f3f5f7;
        padding-bottom: 66px;
        box-sizing: border-box;
        /*滚动插件*/
        .goodsinfowrapper
            width: 100%;
            height: 100%;
        /*商品图片*/
        .goodsinfoimg
            height: 375px;
            width: 100%;
            background-color: red;
            img
                width: 100%;
                height: 100%;
            // 返回关闭按钮；
            .closeInfo
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: rgba(7, 17, 27, .3);
                position: absolute;
                left: 20px;
                top: 20px;
                padding-left: 5px;
                box-sizing: border-box;
                i
                    color: #fff;
                    line-height: 24px;
                    font-size: 12px;
        // 商品信息描述
        .goodsdescribe
            position: relative;
            padding: 18px;
            height: 110px;
            box-sizing: border-box;
            background-color: #fff;
            margin-bottom: 16px;
            border-bottom: 1px solid rgba(7, 17, 27, .1);
            h1
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            //销量
            .sales
                font-size: 10px;
                color: rgb(147, 153, 159);
                margin: 8px 0 18px 0;
                .onsale
                    margin-right: 12px;
            // 价格
            .price
                font-size: 10px;
                .pricenew
                    color: #f01414;
                    margin-right: 8px;
                    i
                        font-size: 14px;
                        font-weight: 700;
                        font-style: normal;
                        vertical-align: bottom;
                .priceold
                    color: #93999f;
                    text-decoration: line-through;
            // 加入购物车按钮
            .tocart
                position: absolute;
                right: 18px;
                top: 64px;
                width: 74px;
                height: 24px;
                background-color: rgb(0, 160, 220);
                font-size: 10px;
                color: #fff;
                line-height: 24px;
                text-align: center;
                border-radius: 12px;
                z-index: 10;
                transition: all .3s;
            // 入场前 & 退场后
            .tocart-enter, .tocart-leave-to
                opacity: 0;
            // 入场后 & 退场前
            .tocart-enter-to, .tocart-leave
                opacity: 1;

            // 加减号按钮
            .goodsinfoadd
                right: 18px;
                top: 66px;
                opacity: 0;
                /*因为一开始就要让加号组件显示，如果不显示则小球动画会出现偏差，所以这里将透明为*/
                &.addshow
                    opacity: 1;




</style>

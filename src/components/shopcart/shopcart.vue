<template>
    <div id="shopcart">
        <!--左侧为自适应宽度-->
        <div class="cartinfo">
            <!--购物车按钮-->
            <div class="carticonoutline">
                <div :class="totalNumber!==0?'havebg carticon':'carticon'">
                    <!--当购物车有内容时，这个角标显示-->
                    <span v-if="totalNumber!==0" class="marker">{{totalNumber}}</span>
                    <i :class="totalNumber!==0?'haveicon iconfont':'iconfont'">&#xe609;</i>
                </div>
            </div>
            <!--商品价格-->
            <span :class="totalPrice!==0?'pricetrue price':'price'">￥{{totalPrice}}</span>
            <!--竖线-->
            <span class="border-col-1px border1px"></span>
            <!--配送费-->
            <span class="freight">另需配送费￥{{sellerInfo.deliveryPrice}}元{{getThisSellerCart}}</span>
        </div>
        <!--右侧结算按钮，固定宽度-->
        <div class="settlebtn">￥{{sellerInfo.minPrice}}起送</div>
    </div>
</template>

<script>
    const ERR_OK = 0;
    export default {
        name: "shopcart.vue",
        data() {
            return {
                sellerInfo:{},
                sellerCart:{},
                // 商品总数
                totalNumber:0,
                // 商品总价价格
                totalPrice:0
            }
        },
        created() {
            this.shopCartGetSellerInfo();
        },
        methods: {
            // 因为和header.vue重复使用了获取商家信息AJAX请求，所以这里可以将这个请求放到app.vue中
            // 然后再把结果穿到这两个组件中，这里暂时不挪走了，就先在这里发AJAX；
            // 注意，在router-link这个组件中也是可以传 数据 和方法的；
            shopCartGetSellerInfo() {
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

                    } else {
                        // 获取失败
                        // 因为引入了MintUI的toast组件，这里就可以直接使用Toast(),当然还可以传入很多参数(比如停留时间)，具体的看官网API就行；
                        // Toast("加载轮播图失败。。。");
                        // Toast是mintUI提供的组件，这个项目没用到mintUI，没有引入，所以这里不生效；
                    }
                });
            }
        },
        // 实时获取数据，查看全局购物车中，该商家的数据；
        computed:{

            'getThisSellerCart': function () {
                // 必须先重置购物车所有的个数和价格，才能重新计算；
                this.totalNumber = 0;
                this.totalPrice = 0;

                for (var i = 0; i< this.$store.getters.getAllcart.length; i++){
                    if (this.$store.getters.getAllcart[i].seller === this.sellerInfo.name) {
                        // 有商家


                        // 计算商家购物车中，所有商品的个数
                        for (var k = 0; k < this.$store.getters.getAllcart[i].goods.length; k++) {
                            this.totalNumber += this.$store.getters.getAllcart[i].goods[k].num;
                            this.totalPrice += this.$store.getters.getAllcart[i].goods[k].num*this.$store.getters.getAllcart[i].goods[k].goodsInfo.price;
                            // console.log(this.$store.getters.getAllcart[i].goods[k].goodsInfo.price)
                        }
                        // 计算商家购物车中商品的，总价格


                        // 返回这个商家的在购物车中的所有数据；
                        // 找到该商家，返回这个商家购物车中的数据；
                        // console.log(this.$store.getters.getAllcart[i]);
                        // 数据结构：{goods:[商品，商品], seller:商家名}
                        return this.$store.getters.getAllcart[i];
                    }
                }
                // 啥也没找到，返回空对象；
                return {};
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../../src/assets/styl/mixin.styl";
    #shopcart
        color: red;
        position: absolute;
        display: flex;
        bottom: 0;
        left: 0;
        height 48px;
        width: 100%;
        background-color: #fff;
        // 购物主体内容，宽度自适应
        .cartinfo
            flex: 1;
            background-color: #08121c;
            // 购物车icon
            .carticonoutline // 外边的圆圈
                width: 66px;
                height: 66px;
                background-color: #08121c;
                border-radius: 33px;
                position: relative;
                margin: -15px 12px 0 8px;
                display: flex; //让中间的圆圈垂直居中；
                align-items: center; //让中间的圆圈垂直居中；
                float: left;
                .carticon // 中间的圆圈
                    width: 44px;
                    height: 44px;
                    border-radius: 22px;
                    margin: 0 auto;
                    background-color: #2b343c;
                    text-align: center;
                    position: relative;
                    &.havebg // 购物车中有商品时
                        background-color: #00a0dc;
                    i // 购物车icon
                        font-size: 20px;
                        line-height: 44px;
                        color: #80858a;
                        &.haveicon
                            color: #fff;
                    .marker // 角标
                        position: absolute;
                        right: -6px;
                        top: -6px;
                        width: 24px;
                        height: 16px;
                        background-color: red;
                        border-radius: 8px;
                        font-size: 9px;
                        font-weight: 700;
                        color: #fff;
                        text-align: center;
                        line-height: 16px;
                        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .4);

            // 商品价格；
            .price
                font-size: 16px;
                font-weight: 700;
                color: rgba(255, 255, 255, .4);
                line-height: 48px;
                float: left;
                &.pricetrue // 有商品时
                    color: #fff;
            // 竖分割线
            .border1px
                float: left;
                margin: 12px 12px 0;
                display: block;

                height: 24px;
                border-col-1px(rgba(255, 255, 255, .1))

            // 配送费
            .freight
                font-size: 10px;
                line-height: 48px;
                color: rgba(255, 255, 255, .4);
        // 结算按钮，宽度固定
        .settlebtn
            flex: 0 0 105px;
            width: 105px;
            background-color: #2b333b;
            color: rgba(255, 255, 255, .4)
            line-height: 48px;
            text-align: center;
            font-weight: 700;
            &.go // 结算
                background-color: #00b43c;
                color: #fff;
</style>
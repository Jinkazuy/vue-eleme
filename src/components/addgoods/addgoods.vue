<template>
    <div id="addgoods">
        <!--这里的商品个数，是通过访问用户所有购物车，在这里用的就是全局数据的方法拿到对应该商家的这个商品的数据-->
        <!--{{ $store.getters.optCount }} 就能拿到当前用户下所有购物车的所有数据 -->
        <!--因为拿到的是购车中所有的数据，在这里做商品名称的循环对比显然不合适，所以写函数对比商品名称-->
        <!--如果购物车中没有商品，就不显示减号和数量-->
        <!--减号实现动画，显示时，由右侧向左侧位移、透明度、转圈-->
        <transition name="reduceanimate">
            <div class="reduce" @click="reduce" v-show="this.upDataNum"><i class="iconfont">&#xe607;</i></div>
        </transition>
        <transition name="numberanimate">
            <!--中间数字，动画：透明度变化-->
            <div class="goodsnumber" v-show="this.upDataNum"><span>{{upDataNum}}</span></div>
        </transition>
        <!--右侧加号-->
        <div class="add" @click="addToCart" ref="add"><i class="iconfont">&#xe604;</i></div>
        <!--// 点击加号，加入购物车，小球跳入动画；-->
        <!--调用父级的方法，然后将加号DOM传进去-->


    </div>
</template>

<script>
    export default {
        name: "addgoods.vue",
        props: ["thisgoodsinfo", "sellername"], // 拿到父组件过来的该商品信息、商家名称；
        data() {
            return {}
        },
        created() {
        },
        methods: {
            // 增加商品到购物车
            addToCart() {
                // 点击加号的时候，将商家名称，和该商品的所有信息，包装成一个对象，用于插入到全局数据中；
                this.$store.commit("addGoodsToCart", {
                    seller: this.sellername,
                    goods: [{goodsInfo: this.thisgoodsinfo, num: 1}]
                });
                // console.dir(this.$store.state.cartAll)

                // 小球动画-第1步；
                // 点击加号的时候，调用父级的方法，把该加号的DOM元素传给父组件
                this.$emit('getAddDom',this.$refs.add)
            },
            // 减少购物车中 该商品数量
            reduce() {
                // 同样要把商品信息传过去；
                this.$store.commit("reduceGoodsToCart", {
                    seller: this.sellername,
                    goods: [{goodsInfo: this.thisgoodsinfo, num: 1}]
                });
            }
        },
        watch: {},
        computed: {
            // 这里的商品个数，是通过访问用户所有购物车，在这里用的就是全局数据的方法拿到对应该商家的这个商品的数据
            // {{ $store.getters.xxx }} 就能拿到当前用户下所有购物车的所有数据
            // 拿到所有全局购物车的数据，然后匹配到该商家之后，再匹配该商品，拿到这个商品的数量；


            // 对商家名称做对比
            // 这个对商家的对比，应该在进入商家页面时候就做对比，也就是在app.vue中做对比，否则用+—号作对比就会出现大量的循环；
            // 这里偷个懒，没有在app.vue中作对比；

            'upDataNum': function () {
                for (var i = 0; i < this.$store.getters.getAllcart.length; i++) {
                    // 这里要注意，因为是父级传过来的商家名称，通过props传过来的有延迟，不过很快，使用监听计算属性，连这个也一起监听了；
                    // 所以这里监听的实际有两个东西，一个是props传过来的商家名称，另一个则是全局购物车中该商品数据的变化；
                    if (this.$store.getters.getAllcart[i].seller === this.sellername) {
                        // console.log('找到该商家了');
                        // 找到该商家后，就该进行商品对比了；
                        for (var k = 0; k < this.$store.getters.getAllcart[i].goods.length; k++) {
                            if (this.$store.getters.getAllcart[i].goods[k].goodsInfo.name === this.thisgoodsinfo.name) {
                                // console.log('购车中该商品数量===>'+this.$store.getters.getAllcart[i].goods[k].num);
                                // 将该商品的值赋值给这个组件的变量
                                this.goodsNumber = this.$store.getters.getAllcart[i].goods[k].num;
                                // 这里的只是初次在页面加载这个组件的时候，获取到了该商品在购物车中的个数，
                                // 但是如果有变化的，不会在sellername中执行，所以还要使用VM的监听计算属性的方法
                                // 来监听 this.$store.getters.getAllcart[i].goods[k].num 的变化；
                                // 所以定义一个变量，接收这个商家在全部购物车中的所以，和该商品在商家中所有商品的索引 用于监听属性；

                                return this.$store.getters.getAllcart[i].goods[k].num;
                            }
                        }
                        // 有这个商家，但是没有这个商品，返回0；
                        return 0;
                    }
                }
                // 连商家都没有，那么更应该是返回0了；
                return 0;
            }
        }


    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    #addgoods
        width: 68px;
        height: 20px;
        position: absolute;
        right: 20px;
        bottom: 18px;
        .reduce, .add
            width: 20px;
            height 20px;
            position: absolute;
            color: #9a6e3a;
            top: 0;
            i
                font-size: 20px;
                color: #00a0dc;
        // 减号
        .reduce
            /*left: 0;*/
            // 减号动画
            // 入场前 & 退场后
        .reduceanimate-enter, .reduceanimate-leave-to
            opacity: 0; // 透明度
            transform: translate3D(50px, 0, 0) rotateZ(180deg); // 位移和旋转，使用3d会调用设备显卡渲染，更流程；
            transform-origin: center; //旋转中心点；
            transition: all .5s;
        // 入场后 & 退场前
        .reduceanimate-enter-to, .reduceanimate-leave
            opacity: 1;
            transform: translate3D(0, 0, 0) rotateZ(0deg);
            transition: all .5s;

        // 数字动画
        // 入场前 & 退场后
        .numberanimate-enter, .numberanimate-leave-to
            opacity: 0;
            transition: all .2s;
        // 入场后 & 退场前
        .numberanimate-enter-to, .numberanimate-leave
            opacity: 1;
            transition: all .2s;
        // 加号
        .add
            right: 0;
        // 数字
        .goodsnumber
            margin: 0 auto;
            text-align: center;
            color: #93999f;
            font-size: 10px;
            line-height: 20px;



</style>
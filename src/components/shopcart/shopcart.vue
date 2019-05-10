<template>
    <div id="shopcart">
        <!--左侧为自适应宽度-->
        <div class="cartinfo">

            <!--// 点击加号，加入购物车，小球跳入动画；-->
            <!--// 这三个beforeEnter   enter   afterEnter 是vue动画的声明周期钩子函数；-->
            <!--因为一个transition标签只能作用于一个元素，所以循环要给transition标签加-->
            <transition
                    v-for="item in balls"
                    :key="item.num"
                    @before-enter="beforeEnter"
                    @enter="enter"
                    @after-enter="afterEnter" name="ballShow">
                <!--因为要现实x和y不同的移动，所以要套一个盒子-->
                <!--在移动的时候，也要移动不同的，一个移动x轴，一个移动y轴；-->
                <!--外层做y轴移动，所以加缓动贝塞尔曲线时要移动负数，具体的看下方css-->
                <!--并且给负责移动y轴的加贝塞尔曲线、实现先移动负y轴，就能实现抛物线了-->
                <div class="ball" v-show="item.ballsFlag">
                    <!--inner负责移动x轴-->
                    <!--而且，实际有内容的也是这个里层元素-->
                    <!--因为里层有内容时，里层移动的时候，也会带动外层移动-->
                    <!--而里层则不需要加贝塞尔曲线，因为x轴不需要移动负数，直接用ease就行-->
                    <span class="inner" ref="inner-hook">{{item.num}}</span>
                </div>
            </transition>
            <!--购物车icon按钮-->
            <div class="carticonoutline" @click="showThisCart" ref="thisCart">
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
            <span class="freight">另需配送费￥{{sellerInfo.deliveryPrice}}元</span>
        </div>
        <!--右侧结算按钮，固定宽度-->
        <div :class="[payButtonClass]">{{priceDifference}}</div>
        <!--购物车浮层-->
        <transition name="sellercart">
            <!--cartShow-->
            <div class="sellercart" v-show="cartShow">
                <!--购物车列表主体-->
                <!--购物车内容，也应该从全局数据中，找到该商家，然后获得全部商品-->
                <!--让购物车列表主体padding把内容挤下来，然后这个头部使用定位，固定在顶部即可-->
                <div class="cartListHead">
                    <span class="tit">购物车</span>
                    <!--点击清空按钮时，将全局数据下，该商家所有商品清空，并且同步到数据库-->
                    <span class="clearCart" @click="clearCart">清空</span>
                </div>
                <div class="carcont">
                    <!--购物车列表主体，使用了滚动插件better-scroll-->
                    <div class="listScroll">
                        <!--因为一开始循环的时候还没有任何元素，这使得better-scroll插件失效，所以要包裹一个div-->
                        <div>
                            <div class="cartGoodsLest border-1px" v-show="sellerCartList.goods.length" v-for="item in sellerCartList.goods" >
                                <span class="goodsName">{{item.goodsInfo.name}}</span>
                                <span class="goodsPrice">￥<span class="num">{{item.goodsInfo.price}}</span></span>
                                <!--这里又用到了加减号组件-->
                                <!--加减号组件，需要将商品信息传进去,商家名称也要传进去-->
                                <!--实现小球动画，传给加号一个方法，让加号调用时将加号DOM传给父级goods组件-->
                                <!--@getAddDom="getAddDom"-->
                                <addgoods class="goodsAdd" :thisgoodsinfo="item.goodsInfo" :sellername="sellerCartList.seller"  @getAddDom="getAddDomByCart"></addgoods>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--背景模糊层-->
        <transition name="carcontbgblur">
            <!--点击背景模糊层，隐藏购物车列表和模糊层-->
            <div class="carcontbgblur" ref="carcontbgblur" v-show="cartShow" @click="cartShow=false"></div>
        </transition>
        <!--这个隐藏的span是为了调用监听计算属性的返回值，如果VM中没有任何元素、方法调用computed下的某个属性的的话，-->
        <!--那么，该计算属性方法不生效-->
        <!--这里只能用show，不能用if，否则也不生效，因为show已经渲染这个对象，但是if是没有渲染，所以也不能调用这个返回值-->
        <span v-show="0">{{getThisSellerCart}}</span>
    </div>
</template>

<script>
    // 引入 better-scroll 这个用于处理滚动的插件，但记得先安装：npm install better-scroll --save
    import BScroll from 'better-scroll';

    // 因为这个购车的列表用到了加减号组件，所以这里引入 +— 号组件；
    import addgoods from '../addgoods/addgoods'

    const ERR_OK = 0;
    export default {
        name: "shopcart.vue",
        data() {
            return {
                sellerInfo: {},
                sellerCart: {},
                // 该商家下，在全局数据中的购物车的所有商品
                sellerCartList: {},
                // 商品总数
                totalNumber: 0,
                // 商品总价价格
                totalPrice: 0,
                // 控制购物车列表和背景模糊显示与隐藏
                cartShow: false,
                // 加号按钮；
                addButton: {},
                // 这里给小球定一个数组，然后用于遍历小的个数，同时，控制每个小球的显示与隐藏
                // 定数组的目的，是为了在快速点击时，能够不立刻终止小球的动画，不一定要5个，如果时间够，定3、4个也可以；
                balls: [
                    // 此时，小球遍历这个数组，就能在DOM数中插入这几个小球了，
                    // 然后每个小球的显示与隐藏，等于自己的ballsFlag
                    // 在点击加入购物车的时候，遍历这个数组，找到第一个ballsFlag的，将其改变为true，此时这个小球就能显示动画了，
                    //
                    {ballsFlag: false, num: 1},
                    {ballsFlag: false, num: 2},
                    {ballsFlag: false, num: 3},
                    {ballsFlag: false, num: 4},
                    {ballsFlag: false, num: 5}
                ],
                // 这里用于记录当前小球，因为afterEnter钩子函数，会立刻执行，
                // 所以这里就是用于记录一个索引值，让balls当前的索引的元素的变为false，
                // 如果不加这个索引的话，虽然afterEnter是在动画结束后执行，但此动画只要一开始，就会进入这个函数中；
                // 也就是说，只要一开始动画，就马上执行afterEnter的内容，
                // 就导致始终是一个小球在做动画；
                ballCount: 5
            }
        },
        created() {
            this.shopCartGetSellerInfo();

            // this.$nextTick 用法；
            // this.$nextTick 用法；
            // this.$nextTick 用法；
            // JK：如果想在created()钩子时，获取DOM元素，那么肯定获取不到，但是可是通过$nextTick拿到；

            // 虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。
            // 比如你在Vue生命周期的created()钩子函数进行的DOM操作一定要放在Vue.nextTick()的回调函数中。
            // 原因是什么呢，原因是在created()钩子函数执行的时候DOM 其实并未进行任何渲染，而此时进行DOM操作无异于徒劳，
            // 所以此处一定要将DOM操作的js代码放进Vue.nextTick()的回调函数中。
            // 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，
            // 这个操作都应该放进Vue.nextTick()的回调函数中。

            // $nextTick还有其他用法，具体的看 https://www.jianshu.com/p/a7550c0e164f 或者去百度；


            console.log(this.$refs.carcontbgblur) // 结果: undefined

            this.$nextTick(() =>  {
                console.log(this.$refs.carcontbgblur) //结果:就有了；
            })

        },
        mounted() { // 生命周期函数，在DOM树生成后执行；
            // 调用初始化滚动插件的函数；
            this.scrollInit();
        },
        methods: {
            scrollInit() {
                // 初始化滚动插件；
                // 在methods中初始化了之后，别忘了在mounted中调用这个初始化函数；
                let wrapperList = document.querySelector('.listScroll');
                // better-scroll的实例对象，提供一个API，能够实时监听这个组件的滚动位置,创建实例的时候，后边传入probeType: 3;
                // 然后这个实例化对象，就能监听滚动事件，其中的xx就能拿到实时滚动的位置了；
                // 左侧列表因为需要点击，但是better-scroll会默认禁止点击事件，那么在配置的时候加上click:true即可；
                this.scrollLeft = new BScroll(wrapperList, {click: true});
            },
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
            },
            showThisCart() {
                // 点击购物车icon的时候，将背景模糊的宽高设置为何屏幕一样；
                // 设置背景模糊的宽高，用window.innerHeight 和 window.innerWidth 获得设备视口的宽高即可；
                this.$refs.carcontbgblur.style.width = window.innerWidth + 'px';
                this.$refs.carcontbgblur.style.height = window.innerHeight + 'px';
                // console.dir(this.$refs.carcontbgblur)
                // console.log(window.innerHeight)
                this.cartShow = true;
                this.cartBlurShow = true;
            },
            // 小球动画
            showBall(addDOM) {
                // 这个函数，由父级组件通过ref的方式调用，
                // 当加号组件点击时，调用父组件的方法，然后由父级调用这个showBall方法啊，把加号DOM穿到这个方法中，
                // 简述：加号按钮调用父级A函数，将DOM传到A中，然后在A中通过ref调用购物车的showBall方法，将A接收到的DOM传给showBall
                // 这样就达成了，父级A函数中，接收到了加号DOM，同时调用购物车VM组件下的showBall方法，将DOM传给showBall；
                // 此时，这个函数拿到了加号DOM，就可以进行计算和做小球动画了；
                this.addButton = addDOM;
                // 那么获取到了之后，复制给一个变量，此时，这个this.addButton就是当前点击的加号按钮；

                // 添加到购物车，小球显示与隐藏；
                // 点击5次之后，所有的小球都是true了,所以这里要重新--
                // 也就是说，小球其实是从倒着往前进入购物车的，但是用户看不出来；
                // console.log(this.ballCount);
                if (this.ballCount === 1) {
                    this.ballCount = this.balls.length;
                }
                // 这个--是关键，每次点击的时候，这个--则能够使点击时，获取的balls下的每个不同的小球，从而不会出现重复动画的情况；
                this.ballCount--;
                this.balls[this.ballCount].ballsFlag = true;

                // 点击5次之后，this.ballCount--到了1，此时所有小球都执行过一次动画，而且也重置了每个小的状态为false；
                // 然后让this.ballCount重新等于小球的个数，所有的小球都是true了；

            },
            beforeEnter(el) {

                // 只要给transition加了这三个钩子函数，就能直接通过参数拿到它下边的DOM元素
                // 小球动画，beforeEnter 表示动画入场之前的生命周期钩子函数
                // 此时，动画尚未开始，可以 在 beforeEnter 中，设置元素开始动画之前的起始样式

                // 点击加号的时候，实现小球跳入购物车的动画；
                // 获取DOM元素的距离屏幕左侧和顶部的距离：domObject.getBoundingClientRect()
                // 因为列表滚动的原因，也要动态获取购物车角标的位置，利用父子传值，并且计算这个元素的距离了；
                // getBoundingClientRect 能够获得元素的各种尺寸、位置的属性，但有些不准确，这里只用.x .y；
                // bottom: 581.625
                // height: 20  获取元素高度
                // left: 335
                // right: 355
                // top: 561.625
                // width: 20 获取元素宽度
                // x: 335 获取元素距离视口左侧距离（从元素左上角计算）
                // y: 561.625 获取元素距视口顶部距离（同上）
                // console.log(this.$refs.add.getBoundingClientRect().x);
                // console.log(this.cartDom.getBoundingClientRect().x);


                // 外层只负责移动y轴，里层负责移动x轴
                // console.log(el.children[0]);
                // 获取小球x移动值，因为加号比购物车距离屏幕左侧更远，所以用加号的.x 减去 购物车的.x 得到要移动的x轴值；
                // console.log(this.addButton)

                // y轴移动-并且减去小球css定位时偏移的值；
                el.style.transform = `translate(0px, ${this.addButton.getBoundingClientRect().y - 10}px)`;
                el.children[0].style.transform = `translate(${this.addButton.getBoundingClientRect().x - 35}px, 0px)`;

                // 这里已经直接写到css中了；
                // el.style.transition = "all 1s cubic-bezier(.49, -.29, .75, .41)";
                // 这里的使用贝塞尔曲线值代替ease，作用都是控制缓动曲线的；
                // 贝塞尔调节工具：http://cubic-bezier.com/#.76,.13,.43,.98
            },
            enter(el, done) {
                // 小球动画，enter 表示动画 开始之后的样式 生命周期钩子函数


                // 这句话，没有实际的作用，但是，如果不写，出不来动画效果；
                // 可以认为 el.offsetWidth 会强制动画刷新
                el.offsetWidth;


                // 小球动画开始后，让其移动到初始的位置，也就是这里购物车的位置；
                el.style.transform = `translate(10px, ${this.$refs.thisCart.getBoundingClientRect().y}px)`;
                el.children[0].style.transform = `translate(-${this.$refs.thisCart.getBoundingClientRect().x}px, 0px)`;


                done(); // done() 的作用其实就是手动调用 afterEnter这个生命周期钩子函数；
            },
            afterEnter(el) {
                // 小球动画，// 动画完成之后，会调用 afterEnter 动画周期钩子函数
                // 让小球隐藏；
                // DOTO:其实这里还可以做一个小球动画执行完，再让购物车角标变鼓起来的一个效果(通过控制DOM元素的方法比较方便，如果不会做就用animated的动画插件)；
                this.balls[this.ballCount].ballsFlag = false;
            },
            // 清空购物车
            clearCart() {
                // 点击清空按钮时，将全局数据下，该商家所有商品清空，并且同步到数据库；
                // 调用全局数据的清空某个商家的购物车的方法；
                // 将商家名称传进去；
                this.$store.commit('clearSellerCart', this.sellerInfo.name);

                // 在307行，从全局数据获取到的商品数据，做的缓存
                // 因为数据同步不及时，所以之类手动清空一下；
                this.sellerCartList = {};

                // 清空之后，应当把购物车列表和浮层都隐藏；
                this.cartShow = false;



            },
            // 获取加号DOM，制作小球动画
            // 与商品列表加号不用，小球动画的制作就是在当前这个vue文件中的，所以不直接调用
            // 就不用像父级一样this.$refs.ShopVM.showBall(el)了；
            getAddDomByCart(el){
                this.showBall(el);
            }
        },
        // 实时获取数据，查看全局购物车中，该商家的数据；
        // 使用computed监听属性，实时计算
        computed: {

            'getThisSellerCart': function () {
                // 必须先重置购物车所有的个数和价格，才能重新计算；
                this.totalNumber = 0;
                this.totalPrice = 0;

                for (var i = 0; i < this.$store.getters.getAllcart.length; i++) {
                    if (this.$store.getters.getAllcart[i].seller === this.sellerInfo.name) {
                        // 有商家

                        // 将该商家下购物车中的所有商品先保存起来，用于渲染列表数据
                        this.sellerCartList = this.$store.getters.getAllcart[i];
                        // console.log(this.sellerCartList.goods);


                        // 计算商家购物车中，所有商品的个数
                        for (var k = 0; k < this.$store.getters.getAllcart[i].goods.length; k++) {
                            this.totalNumber += this.$store.getters.getAllcart[i].goods[k].num;
                            this.totalPrice += this.$store.getters.getAllcart[i].goods[k].num * this.$store.getters.getAllcart[i].goods[k].goodsInfo.price;
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
            },
            // 计算起送费，不满足起送费，显示差xx元. 大于起送费就显示去结算
            'priceDifference': function () {
                // 如果，购物车价格大于0且小于起送价格
                if (this.totalPrice > this.sellerInfo.minPrice) {
                    return '去结算'
                } else if (this.totalPrice > 0 && this.totalPrice < this.sellerInfo.minPrice) {
                    return `还差￥${this.sellerInfo.minPrice - this.totalPrice}起送`
                } else {
                    return `￥${this.sellerInfo.minPrice}起送`
                }
                // 获取购物车所有价格，然后与商家的起送价做对比；

            },
            // 控制结算按钮的类名，如果大于起送费，就返回绿色的类名，否则就是默认的类名；
            'payButtonClass': function () {
                if (this.totalPrice > this.sellerInfo.minPrice) {
                    return 'settlebtn go'
                } else {
                    return 'settlebtn'
                }
            }
        },
        components: {
            // 挂载加减号组件
            addgoods
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../../src/assets/styl/mixin.styl";
    #shopcart
        position: absolute;
        display: flex;
        bottom: 0;
        left: 0;
        height 48px;
        width: 100%;
        background-color: #fff;
        z-index: 999;
        // 购物主体内容，宽度自适应
        .cartinfo
            z-index: 999;
            flex: 1;
            background-color: #08121c;
            // 小球，位于购物车之上；
            .ball
                z-index: 1099;
                position: fixed;
                left: 35px;
                top: 10px;
                transition: all .3s cubic-bezier(.3, -.8, .2, .41);
                // 里层，实际有内容的是里层，里层发生移动，外层也会跟着移动；
                // 而且因为是子集，所以外层移动，里层自然也会移动，
                // 所以一个负责移动x轴，一个负责移动y轴，就能实现抛物线，
                // 关键的是把两个里层和外层的贝塞尔缓动曲线分开写，一个有负数，一个则是正常的缓动；
                .inner
                    display: block;
                    width: 16px;
                    height: 16px;
                    background-color: #00a0dc;
                    border-radius: 8px;
                    color: #fff;
                    transition: all .3s ease;
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
                z-index: 999;
                font-size: 16px;
                font-weight: 700;
                color: rgba(255, 255, 255, .4);
                line-height: 48px;
                float: left;
                &.pricetrue // 有商品时
                    color: #fff;
            // 竖分割线
            .border1px
                z-index: 999;
                float: left;
                margin: 12px 12px 0;
                display: block;

                height: 24px;
                border-col-1px(rgba(255, 255, 255, .1))

            // 配送费
            .freight
                z-index: 999;
                font-size: 10px;
                line-height: 48px;
                color: rgba(255, 255, 255, .4);
        // 结算按钮，宽度固定
        .settlebtn
            z-index: 999;
            flex: 0 0 105px;
            width: 105px;
            background-color: #2b333b;
            color: rgba(255, 255, 255, .4)
            line-height: 48px;
            text-align: center;
            font-weight: 700;
            font-size: 12px;
            &.go // 结算
                background-color: #00b43c;
                color: #fff;
        // 购物车列表
        .sellercart
            width: 100%;
            height: 258px;
            background-color: #fff;
            position: absolute;
            z-index: 900; // 因为父级设置了z-index为99，所以这里用-1就能置于父级所有元素下方；
            // 这里的padding是为了把内容挤下去，然后顶部的title用定位定在顶部即可；
            // 左右的padding 是因为每天商品两边有边距，这里直接用父级的padding给占据；
            padding: 40px 18px 0;
            box-sizing: border-box;
            left: 0;
            transition: all .4s;
            bottom: 48px;
        // 购物车列表显示与隐藏动画；
        // 入场前 & 退场后
        .sellercart-enter, .sellercart-leave-to
            transform: translate3d(0, 258px, 0);
        // 入场后 & 退场前
        .sellercart-enter-to, .sellercart-leave
            transform: translate3d(0);
        // 购物车列表的head
        .sellercart .cartListHead
            position: absolute;
            top: 0;
            left: 0;
            //因为定位，所以脱标了，这里给个right就能使其有宽度
            right: 0;
            height: 40px;
            //这里的1px线就不用管了；
            border-bottom: 1px solid #dbdee1;
            box-sizing: border-box;
            padding 0 18px;
            .tit
                font-size: 14px;
                color: #07111b;
                font-weight: 400;
                float: left;
                line-height: 38px;
            .clearCart
                font-size: 12px;
                color: #00a0dc;
                float: right;
                line-height: 38px;
        // 购车列内容
        .carcont
            overflow: hidden; // 因为左右两栏都是滚动的，所以父级要隐藏超出的部分；
            height: 100%;
            // 因为底部有个原型的购物车icon凸起一块，所以这里要加padding-bottom防止挡住商品列表；
            padding-bottom: 20px;
            box-sizing: border-box;
        // 滚动的组件，里边放着每个商品
        .listScroll
            background-color: #fff;
            height: 100%;
            position: relative;
            box-sizing: border-box;
            .cartGoodsLest
                height: 48px;
                position: relative;
                border-1px(rgba(7, 17, 27, .1))
                .goodsName
                    font-size: 14px;
                    color: #07111b;
                    font-weight: 700;
                    line-height: 48px;
                .goodsPrice
                    font-size: 10px;
                    color: #f01414;
                    vertical-align: bottom;
                    position: absolute;
                    right: 85px;
                    line-height: 44px;
                    .num
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 46px;
                        vertical-align: bottom;
                // 加减号组件
                .goodsAdd
                    top: 14px;
                    right: 2px;


    // 背景模糊
    .carcontbgblur
        position: fixed;
        z-index: 800;
        // 宽高由点击购物车icon时设置，与设备视口的宽高一致；
        left: 0;
        bottom: 48px;
        backdrop-filter: blur(10px);
        transition: all .2s;
        background-color: rgba(7, 17, 27, .6);

    // 背景模糊显示与隐藏动画；
    // 入场前 & 退场后
    .carcontbgblur-enter, .carcontbgblur-leave-to
        opacity: 0;

    // 入场后 & 退场前
    .carcontbgblur-enter-to, .carcontbgblur-leave
        opacity: 1;

</style>
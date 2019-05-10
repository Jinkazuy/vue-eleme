<template>
    <!--特别要注意的是，template下只能有一个最外层元素-->
    <div id="goods">
        <!--使用了better-scroll滚动插件，这个元素下的第一个原生可以实现滚动效果，需要在js中初始化这个插件-->
        <!--初始化插件不要在created生命周期钩子中，因为此时还没有生成DOM，应该在mounted()生命周期钩子函数中执行初始化-->
        <div class="better-scroll-wrapper better-scroll-wrapper-left">
            <div class="menu-wrapper">
                <ul class="foodslist">
                    <!--for循环必须有key，这里先不加-->
                    <!--点击时候调用定义好的函数，并且点击的li的元素的item传入这个函数中-->
                    <!--左侧列表的高亮，由右边列表的高度值，通过计算后的结果来决定-->
                    <!--点击左侧列表，注册一个点击事件，比并且把该项的索引传到 处理点击事件的函数中-->
                    <li v-for="(item, i) in foodsListMenu" @click="foodslistNow(i)"
                        :class="{'current':i===ScrollIndexNowIndex,'currentprevious':i===ScrollIndexNowIndex-1}">
                        <div class="border-1px">
                            <div>
                                <!--因为不是每个类别都有优惠的icon，所以要判断-->
                                <i v-if="item.type>0?1:0" :class="['goodsSupportsIcon'+item.type]"></i><span>{{ item.name }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--右侧商品列表也使用了better-scroll滚动插件-->
        <div class="better-scroll-wrapper better-scroll-wrapper-right">
            <div class="cont-wrapper" ref="contwrapper">
                <ul>
                    <!-- 这里要实现左右联动的效果，就要计算右侧的每个分类的高度，然后当每个元素滚动到xx像素的时候，左侧分类名的滚动条的某一项高亮 -->
                    <!-- -hook 是一种编程习惯性命名，代表该元素要被JS获取DOM，而这个类名并没有css样式-->
                    <li v-for="item in foodsListMenu" class="food-link-hook" @click="">
                        <h2>{{item.name}}</h2>
                        <div class="clearfix" v-for="(oneGoods,index) in item.foods">
                            <img :src="oneGoods.image" alt="图片"/>
                            <ul class="goodsInfoLise">
                                <li class="foodName">{{oneGoods.name}}</li>
                                <!--因为有的商品是没有小标签的，所以之类要判断一下-->
                                <li class="classification" v-if="oneGoods.description">{{oneGoods.description}}</li>
                                <li class="salesVolume"><span>月售{{oneGoods.sellCount}}</span><span>好评率{{oneGoods.rating}}%</span>
                                </li>
                                <li class="price"><span class="priceNow">￥<i>{{oneGoods.price}}</i></span>
                                    <span class="priceInvalid" v-if="oneGoods.oldPrice">￥{{oneGoods.oldPrice}}</span>
                                </li>
                            </ul>
                            <!--加减号组件，需要将商品信息传进去,商家名称也要传进去-->
                            <!--实现小球动画，传给加号一个方法，让加号调用时将加号DOM传给父级goods组件-->
                            <addgoods :thisgoodsinfo="oneGoods" :sellername="sellerName" @getAddDom="getAddDom"></addgoods>
                            <!--这个线，该类商品下的最后一个商品的区块不能有，所以这里用商品数组的长度来判断即可-->
                            <div class="line border-1px" v-if="index<item.foods.length-1"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--调用底部购物车bar组件，并且把商家的起送费、配送费传进去-->
        <shopcart :startFreight="1" :freight="1" ref="ShopVM"></shopcart>
    </div>
</template>

<script>
    // 引入 better-scroll 这个用于处理滚动的插件，但记得先安装：npm install better-scroll --save
    import BScroll from 'better-scroll';
    // 引入 +— 号组件；
    import addgoods from '../addgoods/addgoods'
    // 引入购物车组件
    import shopcart from '../shopcart/shopcart'

    const ERR_OK = true;
    export default {
        name: "goods.vue",
        data() {
            return {
                //商家信息,这里为了省事，在这个文件中发送AJAX获取商家信息，其实是因该在APP.vue里请求商家信息的；
                sellerName: "",
                // 存放ajax获取到的商家数据
                goodsInfo: [],
                // 存放商品种类列表，如果直接在每个li里循环的话，会报错（但是结果是对的）；
                foodsListMenu: [],
                // 存放右侧商品列表的每个分类名及该分类下所有商品的容器的高度；
                goodsListHeight: [],
                // 用于监听右侧列表滚动的  当前高度
                scrollHeight: 0,
                // 用于接收计算后，每个区块的滚动的累计高度；
                scrollHeightNow: 0,
                ScrollIndexNowIndex: 0,

            };
        },
        created() {
            // 通过ajax拿到数据，因为此时与这个组件相关的组件都没有拿到数据，所以由这个组件自己拿数据；
            this.getgoodsData();
        },
        mounted() { // 生命周期函数，在DOM树生成后执行；
            // 调用初始化滚动插件的函数；
            this.scrollInit();
        },
        updated() { // 生命周期函数，实例更新完毕之后调用此函数，此时 data 中的状态值 和 界面上显示的数据，都已经完成了更新，界面已经被重新渲染好了！
            // 此时的页面已经渲染完毕，这时候才能拿到DOM元素，进行操作；
            // 调用获取右侧 每个 商品分类及该类商品的高度的函数；
            this.getGoodsListHeight();

            this.getRightScrollPosition();
        },
        computed: {
            // 监听计算属性，当这个函数下的某个数据发生变化，则会重新计算、执行这个函数；
            // 用return的方式返回值；

            // 这里就用来做右侧滚动栏，数值变化时；
            // 注意！！！！computed 是接收返回值！！！！！
            "WatchScrollIndex": function () {
                // 这里通过循环计算，

                for (var k = 0; k < this.goodsListHeight.length; k++) {
                    // 这里是用当前循环的每个分类块的高度相加，如果下边的if没有成了，说明已经滚动的值不够高；
                    // 一开始这个值就是第1个区块的高度；
                    // 如果没有进入if，则会一直加下一个分类块的高度；
                    this.scrollHeightNow += this.goodsListHeight[k];
                    // 如果，当前滚动的高度，是否大于第1个分类块的高度 且 小于第2个分类块+第1个块的高度，那么此时就应该让第2个分类块的左侧栏对应的按钮高亮；
                    if (this.scrollHeightNow > this.scrollHeight) {
                        this.scrollHeightNow = 0;
                        return k;
                    }
                }

                return 0;
            }
        },
        methods: {
            getgoodsData() {
                // 因为在main.js中已经引入了vue-resource 所以这里可以直接使用this.$http的方法；
                this.$http.get("/api/goods").then(goodsResult => {
                    // 判断是否拿到了数据；
                    // 虽然请求成功了，但不一定拿到了数据；
                    if (goodsResult.ok === ERR_OK) {
                        // console.log(goodsResult);
                        this.goodsInfo = goodsResult;
                        this.foodsListMenu = this.goodsInfo.body.data;
                    }
                });
                // 这里获取商家信息，和很多地方重复了，JK为了省事才这样做的，其实应该在APP.vue中做商家信息的AJAX请求
                this.$http.get("/api/seller").then(sellerResult => {
                    if (sellerResult.ok === ERR_OK) {
                        this.sellerName = sellerResult.body.data.name;
                    }
                });
            },
            // 处理左侧分类项列表的 点击事件，获取传进来每个分类对应的索引值；
            foodslistNow(index) {

                // 方法1：
                //此时拿到了被点击的分类项的索引值，那么就可以用这个索引值，用作右侧列表高度的数组循环相加；
                // 每次被点击的时候都将这个暂存自定为0；
                var numHeight = 0;
                for (var i = 0; i < index; i++) {
                    numHeight += this.goodsListHeight[i]
                }
                // 滚动到指定位置的API，参数：x位置, y位置 , 时间, 曲线；
                this.scrollRight.scrollTo(0, -numHeight, 400);
                // 这里就先不用方法2，因为还要获取DOM元素，获取每个分类项，可能会增加内存计算，所以直接用方法1，操作右侧整个列表的滚动位置即可；

                // 方法2：
                // 也可以用另一个API，就是将滚动定为到某个一元素的位置；
                // 首先获取当右侧列表的每个分类项，得到的还是HTMLCollection的对象;
                // let foodsListNow = this.$refs.contwrapper.getElementsByClassName('food-link-hook');
                // this.scrollRight.scrollToElement(foodsListNow[i], 400);

            },
            scrollInit() {
                // 初始化滚动插件；
                // 在methods中初始化了之后，别忘了在mounted中调用这个初始化函数；
                let wrapperLeft = document.querySelector('.better-scroll-wrapper-left');
                let wrapperRight = document.querySelector('.better-scroll-wrapper-right');
                // better-scroll的实例对象，提供一个API，能够实时监听这个组件的滚动位置,创建实例的时候，后边传入probeType: 3;
                // 然后这个实例化对象，就能监听滚动事件，其中的xx就能拿到实时滚动的位置了；
                // 左侧列表因为需要点击，但是better-scroll会默认禁止点击事件，那么在配置的时候加上click:true即可；
                this.scrollLeft = new BScroll(wrapperLeft, {click: true});
                this.scrollRight = new BScroll(wrapperRight, {probeType: 3, click: true});
            },
            getGoodsListHeight() {
                // $els类似于document.querySelector('.class')的功能,可以拿到指定的dom元素。
                let foodsList = this.$refs.contwrapper.getElementsByClassName('food-link-hook');
                // 此时拿到的是一个HTMLCollection的对象，类似数组，但是用[]方法拿不到元素；
                // 而且这个HTMLCollection对象是事实变化的，所以只能通过updated这个生命周期函数拿到这个元素；
                // 这个对象下有个.item能够拿到每个元素；
                for (var i = 0; i < foodsList.length; i++) {
                    // 此时只能通过每个DOM元素下的clientHeight方法拿到这个元素的实际高度；
                    // console.dir(foodsList.item(i).clientHeight)
                    // 让后将每个分类项的高度赋值给定义好的数组中；
                    this.goodsListHeight.push(foodsList.item(i).clientHeight);
                }
            },
            // 封装一个使用 better-scroll 插件的实例对象来获取该滚动元素实时位置的函数
            getRightScrollPosition() {
                this.scrollRight.on('scroll', (pos) => {
                    // 在初始化 better-scroll 实例时传入{probeType: 3;}，
                    // 然后这个函数的实例对象监听滚动事件，回调函数的第一个参数，拿到的就是该元素滚动的实时位置；
                    // console.log(pos)

                    // 然后将这个实时滚动位置赋值给data下定义好的用于接收的变量,用abs转成绝对值，也就是正数；
                    this.scrollHeight = Math.abs(pos.y);
                    // 然后就可以用按到的每个分类的高度做对比，就能知道每个分类的块，滚动时，有没有超过显示区域了；
                    // 比如：↓↓↓
                    // this.goodsListHeight[0] 这是已经拿到的第一个分类‘热销榜’以及该分类下的商品的所有合起来的高度；
                    // if(this.scrollHeight > this.goodsListHeight[0]){
                    //     // 能够进入这个if，说明滚动位置还没有超过这个分类块的高度，那么此时就应该将这个区块对应的左侧的分类块高亮起来；
                    // }

                    // 因为涉及到了属性的计算，所以，就用到了VUE的计算属性：computed
                    // 注意，是接收返回值，所以结算结果是computed左边的'变量名'；

                    // 这里重新赋值给另外一个变量，因为JK在引用computed中的某个返回值的变量时，就会卡死；
                    // 所以只能讲 computed下的WatchScrollIndex接收到的返回值，再赋值给另外一个变量，然后用于和左侧列表的索引对对比，从而产生形成高亮；
                    this.ScrollIndexNowIndex = this.WatchScrollIndex;
                });
            },
            // 获取减号DOM，将这个函数传给加减号子组件，然后加减号调用时把DOM元素当做参数
            getAddDom(el){
                // 当点击加号的时候，此时获取了el，也就是加号的元素
                // 然后再嗲用子组件的方法，将加号DOM传给子组件，
                // 此时，购物车子组件获取到了加号按钮DOM
                // 利用this.$ref.xx也能够拿到组件，和获取DOM一样
                this.$refs.ShopVM.showBall(el)
            }
        },
        components: {
            // 挂载购物车组件；
            shopcart,
            // 挂载加减号组件；
            addgoods
        }
    };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    // 引入1px border 样式，虽然main.js中引入了集成所有css、styl的样式，但是这里不引入的话会出问题；
    // 引入mixin.styl，拿到根据不同倍率获取不同@2\3倍率的背景图的函数，用于获取不同分辨率的优惠icon；
    @import "../../../src/assets/styl/mixin.styl";
    #goods
        display: flex; //父级规定为flex，那么左侧栏固定，右侧栏flex: 1;就可以宽度自适应了；
        position: absolute;
        left: 0;
        top: 174px; // 这个定位是用header+二级tab的高度来的；
        bottom: 0; // 底部栏的高度；有了top和bottom，这样就不用设置height了；
        width: 100%;
        background-color: #999;
        padding-bottom: 48px; //这里将padding预留出给购物车bar的距离；
        overflow: hidden; // 因为左右两栏都是滚动的，所以父级要隐藏超出的部分；
        .better-scroll-wrapper-left
            flex: 0 0 80px; // 参数1：等分数，参数2：缩放情况，参数3：宽度；
            width: 80px; // 这里设置width是因为安卓可能对flex有兼容性问题，所以加上以防万一；
            height: 100%;
            background-color: #f3f5f7;
            .menu-wrapper
                background-color: #f3f5f7;
                // overflow: auto; // 让超出的元素可以滚动；使用了better-scroll插件，这个就不用了，太生硬，而且有滚动条；
                ul
                    li
                        width: 100%;
                        height: 54px;
                        &.current
                            background-color: #fff;
                            & > div // 选中的时候隐藏子集元素的下border
                                border-1px(rgba(7, 17, 27, 0));
                                span
                                    font-weight: 700;
                        &.currentprevious // 被选中元素的前一个元素，用来取消掉下边框的，JK也是是在没辙了。。
                            & > div // 选中的时候隐藏子集元素的下border
                                border-1px(rgba(7, 17, 27, 0));
                        & > div
                            width: 56px;
                            height: 100%;
                            font-size: 12px;
                            line-height: 14px;
                            margin: 0 auto; // 左右居中
                            // 这里的1px线也需要不随ppi缩放；
                            // 调用1px border的函数；
                            // 因为子集用了定位，所以这个.bar父级也要用定位(在这个border-1px的混入中已经写好了)；
                            border-1px(rgba(7, 17, 27, 0.1));
                            display: flex; // 用于文字垂直居中；
                            align-items: center; // 让子集元素纵向垂直；align-items属性用于弹性 容器
                            div
                                i
                                    display: inline-block;
                                    font-style: normal;
                                    width: 12px;
                                    height: 12px;
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
        .better-scroll-wrapper-right
            flex: 1;
            background-color: #fff;
            // 因为左侧栏是固定宽度，所以右侧栏flex就是占父级的1/1;达到自适应；
            .cont-wrapper
                // overflow: auto; // 让超出的元素可以滚动；使用了better-scroll插件，这个就不用了，太生硬，而且有滚动条；
                position: relative;
                & > ul
                    width: 100%;
                    position: relative;
                    li
                        width: 100%;
                        position: relative;
                        h2
                            color: #93999f;
                            line-height: 26px;
                            font-size: 12px;
                            background-color: #f3f5f7;
                            padding-left: 12px;
                            border-left: 2px solid #d9dde1;
                        & > div
                            width: 100%;
                            // height: 110px; 不能说设置高度，因为有的商品的标签不全；
                            display: flex;
                            background-color: #fff;
                            position: relative;
                            & > .line // 每个商品的下划线，单独写这个元素的目的：为了左右有距离，这个下划线不是通栏的；
                                bottom: -1px;
                                left: 18px; // 左右设定定位，就不用设置宽度了；
                                right: 18px;
                                z-index: 10;
                                border-1px(rgba(7, 17, 27, 0.1)); //这个函数用了一个position: relative,
                                // 这里的1px线也需要不随ppi缩放；
                                // 调用1px border的函数；
                                // 所以要在这个函数的后面用absolute覆盖；
                                position: absolute;
                            img
                                display: block;
                                width: 57px;
                                height: 57px;
                                margin: 18px 10px 0 18px;
                                background-color: pink;
                            ul
                                flex: 1; // 图片限制宽度，这个ul就占剩下的宽度，这样能够实现左右分布；就不用float了；
                                font-size: 0; //先设置字号为0，取消文字上下的一点点不好测量的间距；
                                margin-top: 20px;
                                li
                                    margin-bottom: 6px;
                                // 因为每个商品的div没有设置高度，就由最后一个li，也就是价格的文字的li撑开
                                li:last-of-type
                                    margin-bottom: 23px;
                                .foodName
                                    font-size: 14px;
                                    color: #07111b;
                                .classification //这里也应该文字省略号…
                                    font-size: 10px;
                                    color: #93999f;
                                    width: 150px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
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

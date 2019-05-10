import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    // 可以把 state 想象成 组件中的 data ,专门用来存储数据的
    state: {
        // 那么，就在这里定义加入购物车的数据；
        // 因为没有做用户的数据，其实这个全局购物车商品的数据也是应该从数据库中的 谋个用户数据中获取来的；
        // 所有加入购物车的数据，其中的数据模型是[  {seller:'商家姓名',goods:[{商品信息1},{商品信息2}] }  ]
        cartAll: []
    },
    // 注意： 如果要操作 store 中的 state 值，只能通过 调用 mutations 提供的方法，
    // 才能操作对应的数据，不推荐直接操作 state 中的数据，因为 万一导致了数据的紊乱，
    // 不能快速定位到错误的原因，因为，每个组件都可能有操作数据的方法；

    // 注意： 如果组件想要调用 mutations 中的方法，只能使用 this.$store.commit('方法名')
    // 这种 调用 mutations 方法的格式，和 this.$emit('父组件中方法名')类似
    mutations: {
        // 获取数据库中数据；
        // 这里是获取用户购物车数据的，但是没有接口，所以就从本地存储模拟一下
        getUserCart(state) {
            // 调用这个函数的时机，是已进入应用的时候就调用，所以这个函数在APP.vue中调用了；
            // 如果没有数据就还是等于空数组；
            state.cartAll = JSON.parse(localStorage.getItem('UserCart') || '[]')
            console.dir(state.cartAll)
        },
        // 增加商品逻辑；
        // 注意： mutations 的 函数参数列表中，最多支持两个参数，其中，
        // 参数1：是 state ；
        // 参数2：通过 this.$store.commit("fnName", { c: 3, d: 1 }) 调用这个函数的时，提交过来的参数；
        //       当然在调用 mutations 下的函数是可以穿对象、数组、单个数据都行
        addGoodsToCart(state, goodsData) {
            // 点击加号按钮的时候，调用这个方法，把商家名称和单个商品信息传过来；
            // {seller: "粥品香坊（回龙观）", goods: Array(1)}
            // console.log(goodsData);
            // 如果全局购物车是空的，就直接把数据插入即可；
            if (state.cartAll.length == 0) {
                state.cartAll.push(goodsData);
                // 同步数据；
                localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                return;
            }

            // 首先拿到信息先用商家姓名做对比，如果cartAll中有这个商家，那么就像该商家数据中插入这个商品；
            for (var i = 0; i < state.cartAll.length; i++) {
                // 找商家
                // 这里如果匹配到了商家姓名，就将商品数据插入到该商家中；
                if (state.cartAll[i].seller === goodsData.seller) {
                    // 有商家，找商品
                    // 做循环，在该商家下找，有没有这个商品
                    for (var k = 0; k < state.cartAll[i].goods.length; k++) {
                        // 找到了商品
                        // 经过该商家下，对所有商品名称循环，如果有就进入if
                        // 还要做判断，如果该商家中有这个商品，那么就让数量加1
                        if (state.cartAll[i].goods[k].goodsInfo.name === goodsData.goods[0].goodsInfo.name) {
                            // 有商家，也有这个商品，那么就让商品数字加1；
                            // console.log('有商家，商品数字加')
                            state.cartAll[i].goods[k].num += 1;
                            // 同步数据；
                            localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                            return;
                        }
                    }
                    // 没有找到商品
                    // 经过循环，该商家没有这个商品，则直接push
                    // console.log('有商家，但是没有这个商品')
                    // 有商家，但是没有这个商品，直接将商品插入到该商家中的商品数组中；
                    state.cartAll[i].goods.push(goodsData.goods[0])

                    // 这里注意！因为没有做用户的数据，真是开发中，在每次操作数据后，都应该把用户数据提交给数据库；
                    // 那么这里就用本地存储 localStorage 来模拟数据库；
                    localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                    return;
                } else {
                    // 没有找到上架；
                    // 没有找到该商家，那么就直接将这个goodsData的数据插入到cartAll中；
                    state.cartAll.push(goodsData);
                    // console.log('没有商家')
                    // 同步数据；
                    localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                    return;
                }
            }
            // 如果进入这里，就说明这个函数中没有对数据进行任何操作，是有问题的；
            console.log('循环后的代码');
        },
        // 减少逻辑
        reduceGoodsToCart(state, goodsData){
            // console.log('减少了');
            // 还是将所有购物车中的数据进行循环，找到这个商家，然后找到这个商品；
            for (var i = 0; i < state.cartAll.length; i++) {
                // 找商家
                // 这里如果匹配到了商家姓名，就继续在商家中找这个商品；
                if (state.cartAll[i].seller === goodsData.seller) {
                    // 有商家，找商品
                    // 如果商家下的商品个数为0，直接删除这个商家的数据；

                    // 做循环，在该商家下找，有没有这个商品
                    for (var k = 0; k < state.cartAll[i].goods.length; k++) {
                        // 找到了商品
                        // 经过该商家下，对所有商品名称循环，如果有就进入if
                        // 还要做判断，如果该商家中有这个商品，那么就让数量-1
                        if (state.cartAll[i].goods[k].goodsInfo.name === goodsData.goods[0].goodsInfo.name) {
                            // 有商家，也有这个商品，那么就让商品数字-1；
                            state.cartAll[i].goods[k].num -= 1;
                            // 减少了之后还要判断，该商品数量是否为0，如果为0就删除这条数据；


                            if(state.cartAll[i].goods[k].num===0){
                                // console.log('商品为0');
                                // 商品为0，直接删除这个商品
                                state.cartAll[i].goods.splice(k,1);

                                // 删除过后，检查该商家下是否还有商品，如果没有就删除这个商家；
                                if(state.cartAll[i].goods.length===0){
                                    console.log("商家下没有任何商品");
                                    // 商家下没有任何商品，删除这个商家；
                                    state.cartAll.splice(i,1);
                                }

                                // 同步数据库
                                localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                                return;
                            }


                            // 同步数据库
                            localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                            return;
                        }
                    }
                    // 没有找到商品，啥也不用做，因为不可能进入到这里；
                }
            }
        },
        // 清空某个商家的购物车
        clearSellerCart(state, clearSellerName) {
            // 点击清空按钮时，将全局数据下，该商家所有商品清空，并且同步到数据库
            // 购物车的清空按钮，点击时，调用这个方法，将商家名称传进来，然后进行遍历，
            for(var i = 0; i< state.cartAll.length ; i++){
                // 找到与商家名称相同的数据，直接将整个商家及购物车的数据全部移除；
                if(state.cartAll[i].seller === clearSellerName){
                    console.log(state.cartAll[i]);
                    state.cartAll.splice(i,1);
                    // 同步数据库
                    localStorage.setItem('UserCart', JSON.stringify(state.cartAll));
                    return;
                }
            }
        }
    },

    actions: {},
    getters: {
        // 注意：这里的 getters， 只负责 对外提供数据，
        // 也就是说：在getters下定义的函数，只能读取state数据，不能操作state数据；
        // 如果想要修改 state 中的数据，请 去找 mutations
        // 调用getters下的函数：$store.getters.optCount，和调用mutations差不多；

        // 经过回顾对比，发现 getters 中的方法， 和组件中的过滤器比较类似，
        // 因为 过滤器和 getters 都没有修改原数据， 都是把原数据做了一层包装，提供给了 调用者；
        // 其次， getters 也和 computed 的 监听数据 比较像， 只要 state 中引用的数据发生变化了，
        // 那么，如果 getters 正好也引用了这个数据，那么 就会立即触发 getters 的重新求值；
        getAllcart: function (state) {
            // 在使用插值引用的时候就可以直接用这个接收返回值的变量，和VM的计算属性有点相似
            // {{ $store.getters.getAllcart }}
            return state.cartAll
        }
    }
});

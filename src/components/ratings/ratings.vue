<template>
  <!--特别要注意的是，template下只能有一个最外层元素-->
  <div id="ratings">
    <div class="ratingstitle">
      <h1>商品评价</h1>
      <div class="ratingtype border-1px">
        <span @click="goodsInfoType(2)" :class="ratingsType===2?'selected':''">全部<i>{{ratingsAllNumber}}</i></span>
        <span @click="goodsInfoType(0)" :class="ratingsType===0?'selected':''">推荐<i>{{ratingsGoodNumber}}</i></span>
        <span @click="goodsInfoType(1)" :class="ratingsType===1?'tocao-selected':'tocao'">吐槽<i>{{ratingsBadNumber}}</i></span>
      </div>
      <div class="onlyrating" @click="goodsInfoTrue">
        <i :class="['iconfont',ratingsTrue===true?'ratingtrue':'']">&#xe606;</i>
        <span>只看有内容的评价</span>
      </div>
    </div>
    <div class="ratingcontent">
      <ul>
        <li class="border-1px" v-for="item in allRatings">
          <div class="rating-user-info clearfix">
            <!--这里的时间戳是 1469281964000 这中，所以用到了 VUE 的过滤器-->
            <span class="rating-date">{{ item.rateTime | dateFormat }}</span>
            <span class="user-info">{{item.username}}<i><img :src="item.avatar"></i></span>
          </div>
          <div class="rating-ugc clearfix">
            <i :class="['iconfont',item.rateType===0?'bad':'good']">{{item.rateType===0?'&#xe60a;':'&#xe608;'}}</i>
            <span>{{item.text}}</span>
          </div>
        </li>
        <li v-show="allratings.length===0">暂无评论内容</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ratings.vue",
  // 父级传入单个商品数据，或者全部商品数据
  props:["ratings", "sellerAllGoods"],
  data(){
    return {
        // 是否值看有内容的品论 icon 类样式
        ratingsTrue: false,
        // 判断当前要显示类的类型，0是吐槽，1是推荐，2是全局，默认是全部；
        ratingsType: 2,
        // 将所有品论数据拿到，缓存起来，用于做各种判断
        allratings: [],
        // 全部评论的数量
        allRatingsNumber: 0,
        // 推荐评论的数量
        leftRatingsNumber: 0,
        // 吐槽评论的数量
        rightRatingsNumber: 0
    }
  },
  created(){},
  methods: {

      // 只查看有评论的内容
      goodsInfoTrue(){
          this.ratingsTrue = !this.ratingsTrue;
      },
      // 控制显示的内容类型
      goodsInfoType(type){
        this.ratingsType = type;
      }
  },
  computed: {
      // 缓存全局评论数据,做各种判断
      // 这里将通过父级传过来的评论数据拿到，然后做各种判断，赋值给这个组件的一个变量
      // 然后这个组件的数据，是通过这个变量的各种判断的最后结果呈现出来；
      allRatings: function(){

          // 单个商品的评论，先监听是否拿到了数据
          if(this.ratings){
              // 拿到父级的数据了

              // 先初始化一个变量，用于接收数据；
              var ratingsData = [];

              // 先判断显示哪种类型的数据
              // 显示全部；
              // 默认就是显示全部内容
              if(this.ratingsType===2){
                  ratingsData = this.ratings
                  console.log(this.ratings)
                  console.log('类型为2')
              }

              // 只显示 推荐数据
              if(this.ratingsType===1){
                  // 清空缓存的数据
                  ratingsData = [];
                  //  将所有类型为1的的数据取出来
                  for(var j = 0; j<this.ratings.length;j++){
                      if(this.ratings[j].rateType===1){
                          console.log(this.ratings[j])
                          ratingsData.push(this.ratings[j])
                          console.log('123444')
                      }
                  }
                  console.log('类型为1')
              }

              // 只显示 吐槽数据
              if(this.ratingsType===0){
                  // 清空缓存的数据
                  ratingsData = [];

                  //  将所有类型为1的的数据取出来
                  for(var k = 0; k<this.ratings.length;k++){
                      if(this.ratings[k].rateType===0){
                          ratingsData.push(this.ratings[k])
                      }
                  }
                  console.log('类型为0')
              }

              // 最后，结束了显示哪种类型的判断以后，
              // 用这个数据，再做是否只显示有文字的内容
              if(this.ratingsTrue){

                  // 先清空数据；
                  this.allratings = [];

                  for(var i = 0; i<ratingsData.length;i++){
                      // 如果评论有内容，加添加到数组中，然后返回；
                      if(ratingsData[i].text){
                          this.allratings[i] = ratingsData[i]
                      }
                  }
                  return this.allratings;
              }


              this.allratings = ratingsData;
              return this.allratings;
          }


          // 某个商家的评论，先监听是否拿到了数据
          if(this.sellerAllGoods){
              // 拿到父级的数据了
              // console.log(this.sellerAllGoods)
              // 先初始化一个变量，用于接收数据；
              var ratingsData = [];

              // 先判断显示哪种类型的数据
              // 显示全部；
              // 默认就是显示全部内容
              if(this.ratingsType===2){
                  // 循环所有商品类别 => 循环所有商品 => 再循环所有商品的每一条评论， 然后插入这个数组中；
                  // 先要判断是否拿到了某一条商品类型的数据否则.foods
                  if(this.sellerAllGoods[0]){

                      // 第一次循环，拿到所有商品类别
                      for(var i = 0;i<this.sellerAllGoods.length;i++){

                          // 第二次循环，拿到所有商品
                          for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                              // 第三次循环，拿到每个商品的评论数据
                              for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){

                                  // 让后将每一条评论数据，插入到临时数组中
                                  ratingsData.push(this.sellerAllGoods[i].foods[j].ratings[k])

                              }

                          }

                      }
                      // console.log(ratingsData)
                      this.allratings = ratingsData;
                      // console.log('类型为2')
                  }
              }

              // 只显示 推荐数据
              if(this.ratingsType===1){
                  // 清空缓存的数据
                  ratingsData = [];
                  //  将所有类型为1的的数据取出来
                  // 第一次循环，拿到所有商品类别
                  for(var i = 0;i<this.sellerAllGoods.length;i++){

                      // 第二次循环，拿到所有商品
                      for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                          // 第三次循环，拿到每个商品的评论数据
                          for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){
                              console.log()
                              if(this.sellerAllGoods[i].foods[j].ratings[k].rateType===1){
                                  // 让后将每一条评论数据，插入到临时数组中
                                  ratingsData.push(this.sellerAllGoods[i].foods[j].ratings[k])
                              }
                          }

                      }
                  }
                  console.log('类型为1')
              }

              // 只显示 吐槽数据
              if(this.ratingsType===0){
                  // 清空缓存的数据
                  ratingsData = [];
                  //  将所有类型为1的的数据取出来
                  // 第一次循环，拿到所有商品类别
                  for(var i = 0;i<this.sellerAllGoods.length;i++){

                      // 第二次循环，拿到所有商品
                      for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                          // 第三次循环，拿到每个商品的评论数据
                          for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){
                              console.log()
                              if(this.sellerAllGoods[i].foods[j].ratings[k].rateType===0){
                                  // 让后将每一条评论数据，插入到临时数组中
                                  ratingsData.push(this.sellerAllGoods[i].foods[j].ratings[k])
                              }
                          }

                      }
                  }
                  console.log('类型为0')
              }




              // 最后，结束了显示哪种类型的判断以后，
              // 用这个数据，再做是否只显示有文字的内容
              if(this.ratingsTrue){

                  // 先清空数据；
                  this.allratings = [];

                  for(var o = 0; o<ratingsData.length;o++){
                      // 如果评论有内容，加添加到数组中，然后返回；
                      if(ratingsData[o].text){
                          this.allratings.push(ratingsData[o])
                      }
                  }
                  return this.allratings;
              }


              this.allratings = ratingsData;
              return this.allratings;
          }

      },

      // 计算全部评论数
      ratingsAllNumber: function () {
          // 单个商品时
          if(this.ratings){
              return this.ratings.length;
          }
          // 全部商品时
          if(this.sellerAllGoods){

              this.allRatingsNumber = 0;

              // 第一次循环，拿到所有商品类别
              for(var i = 0;i<this.sellerAllGoods.length;i++){

                  // 第二次循环，拿到所有商品
                  for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                      // 第三次循环，拿到每个商品的评论数据
                      for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){

                          this.allRatingsNumber++;

                      }
                  }
              }
              return this.allRatingsNumber;
          }
          return 0;
      },

      // 计算 推荐
      ratingsGoodNumber: function () {
          // 单个商品时
          if(this.ratings){
              var goodNumber = 0;
              for(var i = 0; i< this.ratings.length; i++){
                  if(this.ratings[i].rateType===0){
                      goodNumber+=1
                  }
              }
              return goodNumber;
          }

          // 全部商品时
          if(this.sellerAllGoods){
              // 清空缓存的数据
              this.leftRatingsNumber = 0;
              //  将所有类型为1的的数据取出来
              // 第一次循环，拿到所有商品类别
              for(var i = 0;i<this.sellerAllGoods.length;i++){

                  // 第二次循环，拿到所有商品
                  for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                      // 第三次循环，拿到每个商品的评论数据
                      for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){

                          if(this.sellerAllGoods[i].foods[j].ratings[k].rateType===0){
                              this.leftRatingsNumber++
                          }
                      }
                  }
              }
              return this.leftRatingsNumber;
          }

          return 0;
      },
      // 计算 吐槽
      ratingsBadNumber: function () {
          // 单个商品时
          if(this.ratings){
              var bdaNumber = 0;
              for(var i = 0; i< this.ratings.length; i++){
                  if(this.ratings[i].rateType===1){
                      bdaNumber+=1
                  }
              }
              return bdaNumber;
          }

          // 全部商品时
          if(this.sellerAllGoods){
              // 清空缓存的数据
              this.leftRatingsNumber = 1;
              //  将所有类型为1的的数据取出来
              // 第一次循环，拿到所有商品类别
              for(var i = 0;i<this.sellerAllGoods.length;i++){

                  // 第二次循环，拿到所有商品
                  for(var j =0; j < this.sellerAllGoods[i].foods.length; j++){

                      // 第三次循环，拿到每个商品的评论数据
                      for(var k=0; k< this.sellerAllGoods[i].foods[j].ratings.length;k++){

                          if(this.sellerAllGoods[i].foods[j].ratings[k].rateType===1){
                              this.rightRatingsNumber++
                          }
                      }
                  }
              }
              return this.rightRatingsNumber;
          }


          return 0;
      }

  },
  // 定义私有过滤器，转换日期
  filters:{
      dateFormat:function (dt) {

          var d=new Date(dt)
          var year = d.getFullYear(),
              month = d.getMonth() + 1,
              date = d.getDate(),
              hour = d.getHours(),
              minute = d.getMinutes(),
              second = d.getSeconds();
          month = month < 10 ? '0' + month : month;
          date = date < 10 ? '0' + date : date;
          hour = hour < 10 ? '0' + hour : hour;
          minute = minute < 10 ? '0' + minute:minute;
          second = second < 10 ? '0' + second:second;
          return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../src/assets/styl/mixin.styl";
  #ratings
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .ratingstitle
      padding: 18px 18px 0 18px;
      box-sizing: border-box;
      width: 100%;
      border-top: 1px solid rgba(7, 17, 27, .1);
      border-bottom: 1px solid rgba(7, 17, 27, .1);
      h1
        font-size: 14px;
        font-weight: 700;
        color: #07111b;
        margin-bottom: 18px;
      .ratingtype
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, .1))
        span
          display: inline-block;
          width: 60px;
          height: 32px;
          border-radius: 2px;
          margin-right: 8px;
          text-align: center;
          line-height: 32px;
          font-size: 12px;
          color: #4d555d;
          background-color: rgba(0, 160, 220 ,.2);
          &.selected
            color: #fff;
            background-color: rgba(0, 160, 220 , 1);
          &.tocao
            background-color: #e9ebec;
          &.tocao-selected
            color: #fff;
            background-color: #93999f;
          i
            font-style: normal;
            font-size: 8px;
      .onlyrating
        width: 100%;
        height: 48px;
        line-height: 48px;
        i
          font-size: 20px;
          color: #93999f;
          margin-right: 6px;
          &.ratingtrue
            color:#00c850;
        span
          font-size: 12px;
          color: #93999f;

          
    .ratingcontent
      ul
        width: 100%;
        padding: 0 18px;
        box-sizing: border-box;
        li
          width: 100%;
          padding: 18px 0;
          border-1px(rgba(7, 17, 27, .1))
          .rating-user-info
            width: 100%;
            font-size:10px;
            color: #93999f;
          .rating-date
            float: left;
          .user-info
            float: right;
            i
              display: inline-block;
              margin-left: 6px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: red;
              overflow: hidden;
              img
                width: 100%;
                height: 100%;
                vertical-align: top;
        .rating-ugc
          width: 100%;
          margin-top: 8px;
          i
            margin-right: 6px;
            font-size: 14px;
            &.good
              color: #b7bbbf;
            &.bad
              color: #00a0dc;
          span
            font-size: 12px;
            color: #07111b;
            font-weight: 700;




</style>

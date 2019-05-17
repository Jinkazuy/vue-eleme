<template>
    <div id="introduce">
        <h1>商品介绍</h1>
        <p class="introduceinfo">{{goodsIntroduce}}</p>
    </div>
</template>

<script>
    export default {
        name: "introduce",
        props: ["goodsIntroduce"]
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    #introduce
        background-color: #fff;
        padding: 18px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(7, 17, 27, .1);
        border-top: 1px solid rgba(7, 17, 27, .1);
        margin-bottom: 16px;
        h1
            font-size: 14px;
            font-weight: 700;
            color: #07111b;
            margin-bottom: 8px;
        .introduceinfo
            margin-left: 6px;
            width: 100%;
            font-size: 12px;
            color: #4d555d;
            line-height: 24px;
</style>
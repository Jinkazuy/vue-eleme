module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/prettier"],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        // 增加以下键值对即可；
        // 如此这般，在不输入 ; 分号的时候，就报错；
        'semi': ['error', 'always'],
        // 因为webStorm自带的ctrl+alt+l缩进是4格，那么这里就设置一下esLint的检查缩进为0即可；
        // 如果不设置的话，那么就严格2格缩进；
        'indent': 0
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};

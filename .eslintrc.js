module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: ["plugin:vue/base"],
    // add your custom rules here
    rules: {
        "vue/multi-word-component-names": 0,
        "no-unused-vars": "warn",
        "no-undef": 1,
        "no-irregular-whitespace": "off",
        "prefer-const": "warn",
        "no-self-assign": "warn",
        "semi": ["error", "always"],
        "no-undef": "error",
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "camelcase": ["error", { "properties": "always" }],
        "quotes": ["error", "double"],
        "no-extra-parens": "off"
    },
};

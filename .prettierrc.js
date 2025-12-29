const path = require('path');

module.exports = {
  //缩进长度
  tabWidth: 2,
  //单行最大长度（超过此长度会换行）
  printWidth: 120,
  //使用单引号
  singleQuote: true,
  //句末使用分号
  semi: true,

  //插件
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-classnames', '@trivago/prettier-plugin-sort-imports'],
  //Tailwind v4 建议配置
  tailwindFunctions: ['clsx'],
  /**
   * Tailwind v4 建议配置
   * 指向项目中引入 tailwind 的 CSS 文件
   */
  tailwindStylesheet: path.resolve(__dirname, 'src/utils/tailwind-theme.css'),

  /**
   * 导入排序规则
   */
  importOrder: [
    '^react$',
    '^react-dom$',

    '<THIRD_PARTY_MODULES>',

    '^@.+',

    '^\\.(?!/?$).*$',

    '^\\./.*\\.(css|scss|sass|less)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

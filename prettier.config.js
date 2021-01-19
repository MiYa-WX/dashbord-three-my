// prettier.config.js prettier配置文件
module.exports = {
  /**
   *  详细配置信息：https://prettier.io/docs/en/options.html
   */
  tabWidth: 2, // 指定每个缩进级别的空格数为2
  printWidth: 80, // 单行代码的最大宽度
  useTabs: false, // 是否使用tab（制表符）缩进而非空格
  trailingComma: 'none', // 项尾不能有逗号
  semi: false, // 末尾不添加分号
  singleQuote: true, // 使用单引号而不是双引号
  bracketSpacing: true, // 在对象文字中的括号之间打印空格
  eslintIntegration: true,
  stylelintIntegration: true,
  insertPragma: false,
  arrowParens: 'always', // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid不带）
  vueIndentScriptAndStyle: false, // 是否缩进Vue文件中的代码<script>和<style>标记
  htmlWhitespaceSensitivity: 'strict', //  HTML 文件空格敏感度
  endOfLine: 'lf'
}

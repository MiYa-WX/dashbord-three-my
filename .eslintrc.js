// ESlint 检查配置
module.exports = {
  /**
   * 默认情况下，ESLint 会在所有父级目录里寻找配置文件，一直到根目录
   * 为了将 ESLint 限制到一个特定的项目 设置 'root': true
   *  ESLint 一旦发现配置文件中有 'root': true，它就会停止在父级目录中寻找。
   */
  root: true,
  parserOptions: {
    // 解析器选项
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    // 指定环境
    browser: true, // 浏览器环境中的全局变量
    node: true, // Node.js 全局变量和 Node.js 作用域
    es6: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  /** add your custom rules here
   * 详细配置信息：https://eslint.bootcss.com/docs/rules
   * 'off' or 0 - 禁用此规则
   * 'warn' or 1 - 不符合规则即给出警告（不会影响退出码）
   * 'error' or 2 - 不符合规则即报错 (退出码为1)
   */
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 'off', // 生产环境 禁用 console
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 'off', // 生产环境 禁用 debugger

    // it is base on https://github.com/vuejs/eslint-config-vue
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10, // 一行中每行的最大属性数为10
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off', // 强制组件中的属性顺序
    'vue/require-default-prop': 'off',
    'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          normal: 'never',
          void: 'never',
          component: 'always'
        },
        svg: 'never',
        math: 'never'
      }
    ],
    'accessor-pairs': 2, // 强制 getter 和 setter 在对象中成对出现
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ], // 强制箭头函数的箭头前后使用一致的空格
    'block-spacing': [2, 'always'], // 禁止或强制在代码块中开括号前和闭括号后有空格
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true // 允许块的开括号和闭括号在同一行
      }
    ], // 强制在代码块中使用一致的大括号风格（1tbs: one true brace style）
    // 强制使用驼峰式拼写法命名约定
    camelcase: [
      2,
      {
        properties: 'always'
      }
    ],
    'comma-dangle': [2, 'never'], // 对象字面量项尾不能有逗号
    'comma-spacing': [
      2,
      {
        before: false, // 禁止在逗号前使用空格
        after: true // 要求在逗号后使用一个或多个空格
      }
    ], // 强制在逗号前后使用一致的空格
    'comma-style': [2, 'last'], // 强制使用一致的逗号风格，并要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
    curly: [2, 'all'], // 强制所有控制语句使用一致的括号风格
    'dot-location': [2, 'property'], // 强制在点号之前和之后一致的换行
    'eol-last': 2, // 要求或禁止文件末尾存在空行
    eqeqeq: ['error', 'always', { null: 'ignore' }], // 除了与 null 字面量进行比较时，总是强制使用绝对相等
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ], //强制 generator 函数中 * 号周围使用一致的空格
    indent: [
      2,
      2,
      {
        SwitchCase: 1 // 强制 switch 语句中的 case 子句的缩进级别，case 子句将相对于 switch 语句缩进 2 个空格
      }
    ], // 强制使用一致的缩进 2个空格
    'constructor-super': 2, // 要求在构造函数中有 super() 的调用
    'handle-callback-err': [2, '^(err|error)$'], // 要求回调函数中有容错处理，当参数名为 err, error 时，该规则会报告有未处理的错误。
    'no-duplicate-case': 2, // 禁止出现重复的 case 标签
    'no-fallthrough': 2, // 禁止 case 语句落空
    // // 该项目中没有JSX，故注释掉
    // 'jsx-quotes': [2, 'prefer-double'], // 强制在 JSX 属性中一致地使用双引号或单引号
    'key-spacing': [
      2,
      {
        beforeColon: false, // 禁止在对象字面量的键和冒号之间存在空格
        afterColon: true // 要求在对象字面量的冒号和值之间存在至少有一个空格
      }
    ], //强制在对象字面量的属性中键和值之间使用一致的间距
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ], // 强制在关键字前后使用一致的空格，前后至少都有一个空格
    'no-multi-str': 2, // 禁止使用多行字符串
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ], // 要求构造函数首字母大写
    'new-parens': 2, // new时必须加小括号
    'no-mixed-spaces-and-tabs': 2, // 禁止空格和 tab 的混合缩进
    'no-class-assign': 2, // 禁止修改类声明的变量
    'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
    'no-const-assign': 2, // 禁止修改 const 声明的变量
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
    'no-delete-var': 2, // 禁止删除变量
    'no-func-assign': 2, // 禁止对 function 声明重新赋值
    'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
    'no-dupe-class-members': 2, // 禁止类成员中出现重复的名称
    'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
    'no-empty-character-class': 2, // 禁止在正则表达式中使用空字符集
    'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
    'no-empty-pattern': 2, // 禁止使用空解构模式
    'no-ex-assign': 2, // 禁止对 catch 子句的参数重新赋值
    'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
    'no-useless-call': 2, // 禁止不必要的 .call() 和 .apply()
    'no-extra-boolean-cast': 2, // 禁止不必要的布尔类型转换
    'no-extra-parens': [2, 'functions'], // 只在 函数表达式周围禁止不必要的圆括号
    'no-floating-decimal': 2, // 禁止数字字面量中使用前导和末尾小数点
    'no-inner-declarations': [2, 'functions'], // 禁止 function 声明出现在嵌套的语句块中
    'no-irregular-whitespace': 2, // 禁止不规则的空白
    'no-iterator': 2, // 禁用迭代器，__iterator__属性已被废弃
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      }
    ], // 允许在循环和 switch 语句中使用标签
    'no-lone-blocks': 2, // 禁用不必要的嵌套块
    'no-redeclare': 2, // 禁止多次声明同一变量

    /**
     * 以下是命令行中的 --fix 选项可以自动修复一些规则
     */
    'no-multi-spaces': 2, // 禁止使用多个空格
    'no-multiple-empty-lines': [
      2,
      {
        max: 1
      }
    ], // 禁止出现多行空行，强制最大连续空行数为1
    'no-array-constructor': 2, // 禁用 Array 构造函数
    'no-caller': 2, // 禁用 arguments.caller 或 arguments.callee
    'no-native-reassign': 2, // 禁止对原生对象或只读的全局对象进行赋值
    'no-negated-in-lhs': 2, // 禁止对关系运算符的左操作数使用否定操作符
    'no-new-require': 2, // 禁止调用 require 时使用 new 操作符
    'no-new-symbol': 2, // 禁止 Symbolnew 操作符和 new 一起使用
    'no-new-wrappers': 2, // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-obj-calls': 2, // 禁止将全局对象当作函数进行调用
    'no-octal': 2, // 禁用八进制字面量
    'no-octal-escape': 2, // 禁止在字符串中使用八进制转义序列
    'no-path-concat': 2, // 禁止对 __dirname 和 __filename 进行字符串连接
    'no-proto': 2, // 禁用 __proto__ 属性，已被弃用
    'no-regex-spaces': 2, // 禁止正则表达式字面量中出现多个空格
    'no-return-assign': [2, 'except-parens'], // 禁止在返回语句中赋值，禁止出现赋值语句，除非使用括号把它们括起来
    'no-self-assign': 2, // 禁止自我赋值
    'no-self-compare': 2, // 禁止自身比较
    'no-sequences': 2, // 禁用逗号操作符
    'no-shadow-restricted-names': 2, // 禁止将标识符定义为受限的名字
    'no-spaced-func': 2, // 禁止在函数名和开括号之间有空格
    'no-sparse-arrays': 2, // 禁止稀疏数组， [1,,2]
    'no-this-before-super': 2, // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
    'no-throw-literal': 2, // 禁止抛出异常字面量
    'no-trailing-spaces': 2, // 禁用行尾空格
    'no-undef': 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-undef-init': 2, // 禁止将变量初始化为 undefined
    'no-unexpected-multiline': 2, // 禁止使用令人困惑的多行表达式
    'no-unmodified-loop-condition': 2, // 禁用一成不变的循环条件
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false
      }
    ], // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    'no-unsafe-finally': 2, // 禁止在 finally 语句块中出现控制流语句
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none'
      }
    ], //禁止出现未使用过的变量
    'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
    'no-useless-constructor': 2, // 禁用不必要的构造函数
    'no-whitespace-before-property': 2, // 禁止属性前有空白
    'no-with': 2, // 禁用 with 语句
    'one-var': [
      2,
      {
        initialized: 'never'
      }
    ], // 要求每个作用域的初始化的变量有多个变量声明
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ], // 强制操作符使用一致的换行符风格，并把换行符放在操作符后
    'padded-blocks': [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ], // 强制使用一致的反勾号、双引号或单引号，要求尽可能地使用双引号
    semi: [2, 'never'], // 禁止在语句末尾使用分号 (除了消除以 [、(、/、+ 或 - 开始的语句的歧义)
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ], // 强制分号之后有空格，禁止分号之前有空格
    'space-before-blocks': [2, 'always'], // 强制在块之前使用一致的空格，块语句必须总是至少有一个前置空格
    'space-before-function-paren': [2, 'never'], // 禁止在 function的左括号 ( 之前有空格
    'space-in-parens': [2, 'never'], // 强制圆括号内没有空格
    'space-infix-ops': 2, // 要求操作符周围有空格
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ], // 强制在单词类一元操作符之后使用空格，这些一元操作符: -、+、--、++、!、!!前后没有空格
    'spaced-comment': [
      2,
      'always',
      {
        markers: [
          'global',
          'globals',
          'eslint',
          'eslint-disable',
          '*package',
          '!',
          ','
        ]
      }
    ], // 强制注释中 // 或 /* 后必须跟随至少一个空白
    'template-curly-spacing': [2, 'never'], // 禁止模板字符串中的嵌入表达式周围空格的使用
    'use-isnan': 2, // 要求使用 isNaN() 检查 NaN
    'valid-typeof': 2, // 强制 typeof 表达式与有效的字符串进行比较，防止对变量类型的拼写错误
    'wrap-iife': [2, 'any'], //强制把立即执行的函数包裹起来，但允许其它风格
    'yield-star-spacing': [2, 'both'], // 强制在 yield* 表达式中 * 周围使用空格
    yoda: [2, 'never'], // 禁止 “Yoda” 条件
    'object-curly-spacing': [
      2,
      'always',
      {
        arraysInObjects: false,
        objectsInObjects: false
      }
    ], // 要求花括号内有空格 (除了 {})，禁止以数组或者对象元素开始或结尾的对象的花括号中有空格
    'array-bracket-spacing': [2, 'never'], // 禁止在数组括号内出现空格

    /**
     * 以下是被关闭的规则
     */
    'no-label-var': 0, // 关闭规则：不允许标签与变量同名
    'no-eval': 0, // 关闭规则：禁用 eval()
    'no-implied-eval': 0, // 关闭规则：禁用隐式的eval()
    'no-extend-native': 0, // 关闭规则：禁止扩展原生类型
    'no-control-regex': 0, // 关闭规则：禁止在正则表达式中使用控制字符
    'no-new-object': 0, // 关闭规则：禁用 Object 的构造函数
    'no-useless-escape': 0, // 关闭规则：禁用不必要的转义字符
    'no-prototype-builtins': 0 // 关闭规则：禁止直接使用Object.prototypes内置函数
  }
}

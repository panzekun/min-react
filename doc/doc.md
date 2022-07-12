# min-react

从0-1实现简易版的react，涉及函数组件，类组件、hooks、组件更新、合成事件批量更新、生命周期等等。

## 一、jsx 渲染

### 1.1 什么是JSX

- JSX是一种JS和HTML混合的语法，将组件的结构、数据甚至样式都聚合在一起的写法，运用于React架构中，其格式比较像是模版语言，但事实上完全是在JavaScript内部实现的。元素是构成React应用的最小单位，JSX就是用来声明React当中的元素，React使用JSX来描述用户界面

### 1.2 什么是元素

- JSX其实只是一种语法糖,最终会通过[babeljs](https://www.babeljs.cn/repl)转译成React.createElement语法

- `React.createElement`会返回一个React元素

- React元素事实上是普通的JS对象，用来描述你在屏幕上看到的内容

- `ReactDOM`来确保浏览器中的真实DOM数据和React元素保持一致

  

![](jsx.png)
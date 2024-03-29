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

- React17之前是用babel-loader将JSX进行转译，React17之后是在package中引入新的入口函数并调用

  

![](jsx.png)



## 二、组件

- 可以将UI切分成一些独立的、可复用的组件，这样你就只需专注于构建每一个单独的部件
- 组件从概念上类似于 `JavaScript` 函数。它接受任意的入参(props属性)，并返回用于描述页面展示内容的 React 元素
- react采用组件化的思想，最小的组件单位就是原生HTML元素，采用JSX语法组件声明调用
- react的虚拟dom，就是一个大的组件树，从父组件层到子组件，在react-router v4版开始，路由本身也是组件
- 各个库提供的hoc返回也是组件，如withRouter、connect
- react中的基础数据state props的传递也是以组件为基础

总结：在React中，一切皆为组件 



### 2.1、函数式组件

- 函数组件接收一个单一的props对象并返回了一个React元素
- 组件名称必须以大写字母开头
- 组件必须在使用的时候定义或引用它
- 组件的返回值只能有一个根元素
- React元素不但可以是DOM标签，还可以是用户自定义的组件
- 当 React 元素为用户自定义组件时，它会将 JSX 所接收的属性（attributes）转换为单个对象传递给组件，这个对象被称之为`props`

![](fnCom.png)



### 2.2、类组件

- 类组件的渲染是根据属性创建类的实例，并调用实例的render方法返回一个React元素

![](ClassCom.png)



### 2.3、类组件的更新

**组件状态**

- 组件的数据来源有两个地方，分别是属性对象和状态对象
- 属性是父组件传递过来的
- 状态是自己内部的,改变状态唯一的方式就是`setState`
- 属性和状态的变化都会影响视图更新
- 不要直接修改 State，构造函数是唯一可以给 this.state 赋值的地方



## 三、合成事件和批量更新

- State 的更新会被合并 当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state
- State 的更新可能是异步的
  - 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用
  - 因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态
  - 可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数
- 事件处理
  - React 事件的命名采用小驼峰式(camelCase),而不是纯小写
  - 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串
  - 你不能通过返回 `false` 的方式阻止默认行为。你必须显式的使用`preventDefault`

## 四、ref

- Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素

**2.5.1、为DOM元素添加ref**

- 可以使用 ref 去存储 DOM 节点的引用
- 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性

```jsx
import React from 'react';
import ReactDOM from "react-dom";
// import React from './lib/react';
// import ReactDOM from './lib/react-dom';

class Sum extends React.Component {
    constructor(props) {
        super(props);
        this.a = React.createRef();
        this.b = React.createRef();
        this.result = React.createRef();
    }
    handleAdd = () => {
        let a = this.a.current.value;
        let b = this.b.current.value;
        this.result.current.value = a + b;
    }
    render() {
        return (
            <div>
                <input ref={this.a} />+
            	<input ref={this.b} />
            	<button onClick={this.handleAdd}>=</button>
                <input ref={this.result} />
            <div/>
        );
    }
}
const element = <Sum />
console.log(element)

ReactDOM.render(element, document.getElementById("root"))
```



**2.5.2、为DOM元素添加ref**

- 当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性

```jsx
import React from 'react';
import ReactDOM from "react-dom";
// import React from './lib/react';
// import ReactDOM from './lib/react-dom';

class Form extends React.Component {
    input
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    getFocus = () => {
        this.input.current.getFocus();
    }
    render() {
        return (
            <>
                <TextInput ref={this.input} />
                <button onClick={this.getFocus}>获得焦点</button>
            </>
        );
    }
}
class TextInput extends React.Component {
    input
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    getFocus = () => {
        this.input.current.focus();
    }
    render() {
        return <input ref={this.input} />
    }
}
const element = <Form />
console.log(element)

ReactDOM.render(element, document.getElementById("root"))

```



**Ref转发 forwardRef**

- 你不能在函数组件上使用 ref 属性，因为他们没有实例
- Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧
- Ref 转发允许某些组件接收 ref，并将其向下传递给子组件

```jsx
import React from 'react';
import ReactDOM from "react-dom";
// import React from './lib/react';
// import ReactDOM from './lib/react-dom';

const TextInput = React.forwardRef((props, ref) => (
    <input ref={ref} />
));
class Form extends React.Component {
    input
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    getFocus = () => {
        console.log(this.input.current);

        this.input.current.focus();
    }
    render() {
        return (
            <>
                <TextInput ref={this.input} />
                <button onClick={this.getFocus}>获得焦点</button>
            </>
        );
    }
}
const element = <Form />
console.log(element)

ReactDOM.render(element, document.getElementById("root"))
```



## 五、react基本生命周期（旧）

**基本的生命周期**

- initializtion 初始化状态
- mounting 页面挂载
  组件的 `componentWillMount render componentDidMount`
- updation 数据更新
- unmounting 组件卸载

![](lifecycle-old.png)
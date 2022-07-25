// import React from 'react';
// import ReactDOM from "react-dom";
import React from './lib/react';
import ReactDOM from './lib/react-dom';
/**
 * 给dom元素添加ref
 */
// class Sum extends React.Component {
//     constructor(props) {
//         super(props);
//         this.a = React.createRef();
//         this.b = React.createRef();
//         this.result = React.createRef();
//     }
//     handleAdd = () => {
//         let a = this.a.current.value;
//         let b = this.b.current.value;
//         this.result.current.value = a + b;
//     }
//     render() {
//         return (
//             <div>
//                 <input ref={this.a} />+<input ref={this.b} /><button onClick={this.handleAdd}>=</button>
//                 <input ref={this.result} />
//             </div>
//         );
//     }
// }
// const element = <Sum />

/**
 * 给class组件添加ref
 */
// class Form extends React.Component {
//     input
//     constructor(props) {
//         super(props);
//         this.input = React.createRef();
//     }
//     getFocus = () => {
//         this.input.current.getFocus();
//     }
//     render() {
//         return (
//             <>
//                 <TextInput ref={this.input} />
//                 <button onClick={this.getFocus}>获得焦点</button>
//             </>
//         );
//     }
// }
// class TextInput extends React.Component {
//     input
//     constructor(props) {
//         super(props);
//         this.input = React.createRef();
//     }
//     getFocus = () => {
//         this.input.current.focus();
//     }
//     render() {
//         return <input ref={this.input} />
//     }
// }
// const element = <Form />

/**
 * forwardRef转发
 */
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

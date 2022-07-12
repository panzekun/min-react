// import React from 'react';
// import ReactDOM from "react-dom";
import React from './lib/react';
import ReactDOM from './lib/react-dom';

class ClassCom extends React.Component {
  render() {
    return (
      <div className="title" style={{ color: 'red' }}>
        <span>{this.props.name}</span>
        {this.props.children}
      </div>
    );
  }
}

const element = <ClassCom name="hello">world</ClassCom>
console.log(element)

ReactDOM.render(element, document.getElementById("root"))

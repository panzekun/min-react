// import React from 'react';
// import ReactDOM from "react-dom";
import React from './lib/react';
import ReactDOM from './lib/react-dom';

function FnCom(props) {
  return (
    <div className="title" style={{ color: 'red' }}>
      <span>{props.name}</span>
      {props.children}
    </div>
  );
}
const element = <FnCom name="hello">world</FnCom>
console.log(element)

ReactDOM.render(element, document.getElementById("root"))

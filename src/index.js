import React from 'react';
import ReactDOM from 'react-dom';

const element = (
  <div className="title" style={{ color: "red" }}>
    <span>hello</span>world
  </div>
);
console.log(element)
ReactDOM.render(element, document.getElementById("root"))

// import React from 'react';
// import ReactDOM from "react-dom";
import React from './lib/react';
import ReactDOM from './lib/react-dom';
class Counter extends React.Component {
  constructor(props) {
      super(props);
      this.state = { number: 0 };
  }
  handleClick = () => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);

  }
  render() {
      return (
          <div>
              <p>{this.props.title}</p>
              <p>number:{this.state.number}</p>
              <button onClick={this.handleClick}>+</button>
          </div>
      )
  }
}

const element = <Counter title="计数器" />
console.log(element)

ReactDOM.render(element, document.getElementById("root"))

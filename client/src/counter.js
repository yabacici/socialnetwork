import { Component } from "React";
export default class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            name: "",
        };

        // this.incrementCount = this.incrementCount.bind(this);
    }

    componentDidMount() {
        console.log("component mounted");
    }

    incrementCount() {
        // console.log('incrementing');
        this.setState({ count: this.state + 1 });
    }

    // whenever handlech changes it update the state
    handleChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    render() {
        return (
            <div>
                <h1> I am the counter! The count is: {this.state.count}</h1>
                <button onClick={() => this.incrementCount()}>Click Me!</button>
                <input onChange={(e) => this.handleChange(e)}></input>
                <div>{this.state.name}</div>
            </div>
        );
    }
}
//with arrow func no need to binding on line
//  <button onClick={this.incrementCount}> Click Me!</button>;

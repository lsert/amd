import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: ['hello', 'world', 'click', 'me'] };
        this.handleAdd = this.handleAdd.bind(this);
    }

    handleAdd() {
        const newItems = this.state.items.concat([
            prompt('Enter some text')
        ]);
        this.setState({ items: newItems });
    }

    handleRemove(i) {
        let newItems = this.state.items.slice();
        newItems.splice(i, 1);
        this.setState({ items: newItems });
    }

    render() {
        const items = this.state.items.map((item, i) => (
            React.createElement(
                "div",
                {
                    key: item,
                    onClick: () => {
                        return this.handleRemove(i);
                    }
                },
                item
            )
        ));

        return React.createElement(
            "div",
            null,
            React.createElement("button", { onClick: this.handleAdd }, "Add Item"),
            React.createElement(
                ReactCSSTransitionGroup,
                {
                    transitionName: "example",
                    transitionEnterTimeout: 5000,
                    transitionLeaveTimeout: 5000
                },
                items
            )
        )
    }
}

let div = document.createElement("div");
document.body.appendChild(div);
ReactDOM.render(React.createElement(TodoList, null), div);
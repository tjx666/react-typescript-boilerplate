import React from 'react';
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {
    const [count, setCount] = React.useState(0);

    const add = () => {
        setCount(count + 1);
    };

    return (
        <div className="app">
            <h2 className="title">react typescript boilerplate</h2>
            <div className="counter">
                <input type="text" value={count} readOnly />
                <button type="button" onClick={add}>
                    +
                </button>
            </div>
        </div>
    );
};

export default hot(App);

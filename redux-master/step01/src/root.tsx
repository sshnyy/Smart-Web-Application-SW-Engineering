import React, { useState  } from 'react';

const Root = () => {
    // State: a counter value
    const [counter, setCounter] = useState(0);

    /*
    function callback(currentCounter: number) {
        return currentCounter + 1;
    }
     */

    // Action: code that causes an update to the state when something happens
    const increment = () => {
        setCounter(currentCounter => currentCounter + 1);
        //setCounter(callback);
    };

    // View: the UI definition
    return (
        <div>
            Value: {counter} <button onClick={increment}>Increment</button>
        </div>
    );
};

export default Root;
import React from 'react';
import {state} from "./index";
import {view} from "../core/nandax";

export const Counter = view(() => {
    const increment = () => {
        state.count = state.count + 1;
    }

    return (
        <div className='container'>
            <div>{state.count}</div>
            <button onClick={increment}>Increment</button>
        </div>
    );
});
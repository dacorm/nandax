import React from 'react';
import {state} from "./index";
import {view} from "../core/nandax";

export const Text = view(() => {

    const handleClick = () => {
        state.text = state.text + '12';
    }

    return (
        <div onClick={handleClick}>
            {state.text}
        </div>
    );
});
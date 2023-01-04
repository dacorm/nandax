import React from "react";
import ReactDOM from 'react-dom/client';

import './index.css';
import {store, view} from "../core/nandax";
import {Counter} from "./Counter";
import {Text} from "./Text";

export const state = store({ count: 1, text: 'hello' });
const App = () => {

    return (
        <>
            <Counter />
            <Text />
        </>
    );
};

const ObservableApp = view(App)
console.log(App);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(<App/>);
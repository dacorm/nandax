# Nandax

Simple reactive state managment system

## Features

- Reactive observable store
- Mutable store
- Full TypeScript support
- Small bundle size
- No unnecessary rerenders
- Simple API that hepls your project manage global state

## Installation

```shell
# npm
npm i nandax

# yarn
yarn add nandax
```

## Usage

```ts
// store.ts
import { store } from "nandax";

export const state = store({ count: 2, text: 'hello' });
```

```ts
// Counter.tsx
import { state } from './store.ts'
import { view } from "nandax";

export const Counter = view(() => {
    
    const handleIncrement = () => {
        state.count = state.count + 1;
    }
    
    return (
        <div>
            {state.count}
            <button onClick={handleIncrement}>Increment</button>
        </div>
    )
});
```

## API

### `store`

Creates reactive mutable store

Example:

```ts
store({ count: 1 });
```

### `view`

High order function that wraps your component and makes it reactively changing store. Store will react and change state if component wrapped in View hof change parts of store.
If you change store in component that does not wrapped in view hof it would'nt reactively change state.

```ts
view(MyComponent);
```

## How does this work?

It uses proxy object under the hood and reactionsMap like in MobX to check if the component have reactions and then change store and trigger render and not trigger unnecessary renders if its not needed.

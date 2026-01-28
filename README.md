# @view-models/react

[![CI](https://github.com/sunesimonsen/view-models-react/actions/workflows/ci.yml/badge.svg)](https://github.com/sunesimonsen/view-models-react/actions/workflows/ci.yml)
[![Bundle Size](https://img.badgesize.io/https://unpkg.com/@view-models/react@latest/dist/index.js?label=gzip&compression=gzip)](https://unpkg.com/@view-models/react@latest/dist/index.js)

React integration for [@view-models/core](https://github.com/sunesimonsen/view-models-core).

## Installation

```bash
npm install @view-models/react @view-models/core
```

## Usage

The `useModelState` hook allows you to subscribe to state updates from a `ViewModel` instance.

```tsx
import { ViewModel } from "@view-models/core";
import { useModelState } from "@view-models/react";

type CounterState = Readonly<{ count: number }>;

class CounterViewModel extends ViewModel<CounterState> {
  increment = () => {
    super.update({ count: super.state.count + 1 });
  };

  decrement = () => {
    super.update({ count: super.state.count - 1 });
  };
}

const counterModel = new CounterViewModel({ count: 0 });

function Counter() {
  const { count } = useModelState(counterModel);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={counterModel.increment}>+</button>
      <button onClick={counterModel.decrement}>-</button>
    </div>
  );
}
```

### Derived State

Use `useDerivedState` with the `derived` helper to compute values from your model state. The `derived` function creates a memoized mapper that uses reference equality (`Object.is`) to cache results, which works perfectly with immutable state.

Derived mappers should be defined outside your components:

```tsx
import { ViewModel, derived } from "@view-models/core";
import { useDerivedState } from "@view-models/react";

type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoState = Readonly<{
  items: TodoItem[];
  filter: "all" | "active" | "completed";
}>;

class TodoViewModel extends ViewModel<TodoState> {
  // ... methods to modify state
}

const todoModel = new TodoViewModel({ items: [], filter: "all" });

// Create derived mappers using the derived helper
const selectStats = derived(({ items }): TodoState) => ({
  total: items.length,
  completed: items.filter((item) => item.completed).length,
  active: items.filter((item) => !item.completed).length,
}));

function TodoStats() {
  // Use the derived mapper with useDerivedState
  const stats = useDerivedState(todoModel, selectStats);

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Completed: {stats.completed}</p>
      <p>Active: {stats.active}</p>
    </div>
  );
}
```

You can create multiple derived mappers for different parts of your state:

```tsx
// Create derived mappers outside your components
const selectFilteredItems = derived(({ items, filter }: TodoState) =>
  items.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  }),
);

function TodoList() {
  // The mapper only re-runs when the state reference changes
  const filteredItems = useDerivedState(todoModel, selectFilteredItems);

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
```

### Creating view models inside components

When you need to create a view model from within a React component, use `useMemo` to ensure the model is only created once.

It's good practice to provide both a component that creates its own model and a customizable version that accepts a model as a prop:

```tsx
import { useMemo } from "react";
import { ViewModel } from "@view-models/core";
import { useModelState } from "@view-models/react";

type CounterState = Readonly<{ count: number }>;

class CounterViewModel extends ViewModel<CounterState> {
  increment = () => {
    super.update({ count: super.state.count + 1 });
  };

  decrement = () => {
    super.update({ count: super.state.count - 1 });
  };
}

// Customizable version that accepts a model
function CustomCounter({ model }: { model: CounterViewModel }) {
  const { count } = useModelState(model);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={model.increment}>+</button>
      <button onClick={model.decrement}>-</button>
    </div>
  );
}

// Simple version that creates its own model
function Counter() {
  const model = useMemo(() => new CounterViewModel({ count: 0 }), []);
  return <CustomCounter model={model} />;
}
```

## API Reference

For detailed API documentation, see [docs](./docs).

## License

MIT License

Copyright (c) 2026 Sune Simonsen <sune@we-knowhow.dk>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

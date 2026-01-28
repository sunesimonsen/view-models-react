[**@view-models/react**](../README.md)

---

[@view-models/react](../README.md) / useDerivedState

# Function: useDerivedState()

> **useDerivedState**\<`S`, `D`\>(`model`, `mapper`): `D`

Defined in: [useDerivedState.ts:51](https://github.com/sunesimonsen/view-models-react/blob/main/src/useDerivedState.ts#L51)

A React hook that subscribes to a ViewModel and returns derived state.

This hook combines `useModelState` with a derived mapper function to compute derived values
from the model's state. The component will re-render whenever the model state changes.

The mapper must be created using the `derived` utility, which provides memoization
based on state identity to prevent unnecessary recalculations.

## Type Parameters

### S

`S`

The model state type

### D

`D`

The derived state type

## Parameters

### model

`ViewModel`\<`S`\>

The ViewModel instance to subscribe to

### mapper

`DerivedMapper`\<`S`, `D`\>

A derived mapper function created with the `derived` utility

## Returns

`D`

The derived state computed from the current model state

## Example

```tsx
import { ViewModel, derived } from "@view-models/core";
import { useDerivedState } from "@view-models/react";

type TodoState = {
  items: Array<{ id: string; text: string; completed: boolean }>;
};

const todoModel = new ViewModel<TodoState>({ items: [] });

// Create a derived mapper function
const selectCompletedCount = derived(({ items }: TodoState) => ({
  completed: items.filter((item) => item.completed).length,
  total: items.length,
}));

function TodoStats() {
  const stats = useDerivedState(todoModel, selectCompletedCount);
  return (
    <div>
      {stats.completed} of {stats.total} completed
    </div>
  );
}
```

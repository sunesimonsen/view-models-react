[**@view-models/react**](../README.md)

---

[@view-models/react](../README.md) / ViewModel

# Interface: ViewModel\<T\>

Defined in: [useModelState.ts:34](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L34)

Interface for a ViewModel that manages state and notifies subscribers of changes.

ViewModels provide a way to manage component state outside of the component tree,
allowing multiple components to share and react to the same state. They follow
the observer pattern, where components can subscribe to state changes and receive
notifications when updates occur.

## Example

```typescript
// Implementing a ViewModel
class CounterViewModel extends ViewModel<{ count: number }> {
  increment = () => this.update(({ count }) => ({ count: count + 1 }));
  decrement = () => this.update(({ count }) => ({ count: count - 1 }));
}

// Using in a component
const counterModel = new CounterViewModel({ count: 0 });
const { count } = useModelState(counterModel);
```

## Type Parameters

### T

`T`

The type of state managed by this ViewModel

## Accessors

### state

#### Get Signature

> **get** **state**(): `T`

Defined in: [useModelState.ts:60](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L60)

Get the current state.

##### Returns

`T`

The current state

## Methods

### subscribe()

> **subscribe**(`listener`): () => `void`

Defined in: [useModelState.ts:53](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L53)

Subscribe to state changes.

The listener will be called immediately after any state update.

#### Parameters

##### listener

[`ViewModelListener`](../type-aliases/ViewModelListener.md)

Function to call when state changes

#### Returns

Function to unsubscribe the listener

> (): `void`

##### Returns

`void`

#### Example

```typescript
const unsubscribe = viewModel.subscribe((state) => {
  console.log("State changed:", state);
});

// Later, when you want to stop listening:
unsubscribe();
```

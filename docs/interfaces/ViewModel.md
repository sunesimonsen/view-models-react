[**@view-models/react**](../README.md)

---

[@view-models/react](../README.md) / ViewModel

# Interface: ViewModel\<T\>

Defined in: [useModelState.ts:11](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L11)

## Type Parameters

### T

`T`

## Accessors

### state

#### Get Signature

> **get** **state**(): `T`

Defined in: [useModelState.ts:37](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L37)

Get the current state.

##### Returns

`T`

The current state

## Methods

### subscribe()

> **subscribe**(`listener`): () => `void`

Defined in: [useModelState.ts:30](https://github.com/sunesimonsen/view-models-react/blob/main/src/useModelState.ts#L30)

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

import { useSyncExternalStore } from "react";

/**
 * Function that gets called when the state changes.
 *
 * @template T - The state type
 * @param state - The new state
 */
export type ViewModelListener = () => void;

/**
 * Interface for a ViewModel that manages state and notifies subscribers of changes.
 *
 * ViewModels provide a way to manage component state outside of the component tree,
 * allowing multiple components to share and react to the same state. They follow
 * the observer pattern, where components can subscribe to state changes and receive
 * notifications when updates occur.
 *
 * @template T - The type of state managed by this ViewModel
 *
 * @example
 * ```typescript
 * // Implementing a ViewModel
 * class CounterViewModel extends ViewModel<{ count: number }> {
 *   increment = () => super.update({ count: super.state.count + 1 });
 *   decrement = () => super.update(({ count: super.state.count - 1  }));
 * }
 *
 * // Using in a component
 * const counterModel = new CounterViewModel({ count: 0 });
 * const { count } = useModelState(counterModel);
 * ```
 */
export interface ViewModel<T> {
  /**
   * Subscribe to state changes.
   *
   * The listener will be called immediately after any state update.
   *
   * @param listener - Function to call when state changes
   * @returns Function to unsubscribe the listener
   *
   * @example
   * ```typescript
   * const unsubscribe = viewModel.subscribe((state) => {
   *   console.log('State changed:', state);
   * });
   *
   * // Later, when you want to stop listening:
   * unsubscribe();
   * ```
   */
  subscribe(listener: ViewModelListener): () => void;

  /**
   * Get the current state.
   *
   * @returns The current state
   */
  get state(): T;
}

/**
 * A React hook that subscribes a component to a ViewModel's state updates.
 *
 * This hook connects a React component to a ViewModel instance, automatically
 * subscribing to state changes and triggering re-renders when the state updates.
 *
 * @template T - The state type, which must extend the State interface
 * @param model - The ViewModel instance to subscribe to
 * @returns The current state from the ViewModel
 *
 * @example
 * ```tsx
 * class CounterViewModel extends ViewModel<{ count: number }> {
 *   increment = () => super.update({ count: super.state.count + 1 });
 * }
 *
 * function Counter() {
 *   const counterModel = useMemo(() => new CounterViewModel({ count: 0 }), []);
 *   const { count } = useModelState(counterModel);
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={counterModel.increment}>+</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModelState<T>(model: ViewModel<T>): T {
  return useSyncExternalStore(model.subscribe.bind(model), () => model.state);
}

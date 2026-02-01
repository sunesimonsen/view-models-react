import { useSyncExternalStore } from "react";
import { ViewModel } from "./ViewModel";

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
export const useModelState = <T>(model: ViewModel<T>): T =>
  useSyncExternalStore(model.subscribe.bind(model), () => model.state);

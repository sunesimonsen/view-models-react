import { useModelState } from "./useModelState";
import { ViewModel } from "./ViewModel";

type Mapper<I, O> = (input: I) => O;

/**
 * A branded type for derived state mapper functions created by the `derived` utility.
 * This type ensures that mapper functions are properly memoized before being used
 * with hooks like `useDerivedState`.
 */
type DerivedMapper<I, O> = Mapper<I, O> & { __brand: "derived" };

/**
 * A React hook that subscribes to a ViewModel and returns derived state.
 *
 * This hook combines `useModelState` with a derived mapper function to compute derived values
 * from the model's state. The component will re-render whenever the model state changes.
 *
 * The mapper must be created using the `derived` utility, which provides memoization
 * based on state identity to prevent unnecessary recalculations.
 *
 * @template S - The model state type
 * @template D - The derived state type
 * @param model - The ViewModel instance to subscribe to
 * @param mapper - A derived mapper function created with the `derived` utility
 * @returns The derived state computed from the current model state
 *
 * @example
 * ```tsx
 * import { ViewModel, derived } from "@view-models/core";
 * import { useDerivedState } from "@view-models/react";
 *
 * type TodoState = {
 *   items: Array<{ id: string; text: string; completed: boolean }>;
 * };
 *
 * const todoModel = new ViewModel<TodoState>({ items: [] });
 *
 * // Create a derived mapper function
 * const selectCompletedCount = derived(({ items }: TodoState) => ({
 *   completed: items.filter(item => item.completed).length,
 *   total: items.length
 * }));
 *
 * function TodoStats() {
 *   const stats = useDerivedState(todoModel, selectCompletedCount);
 *   return <div>{stats.completed} of {stats.total} completed</div>;
 * }
 * ```
 */
export const useDerivedState = <S, D>(
  model: ViewModel<S>,
  mapper: DerivedMapper<S, D>,
) => mapper(useModelState(model));

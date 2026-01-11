import { useSyncExternalStore } from "react";
import type { ViewModel, State } from "@view-models/core";

export function useModelState<T extends State>(model: ViewModel<T>): T {
  return useSyncExternalStore(model.subscribe.bind(model), () => model.state);
}

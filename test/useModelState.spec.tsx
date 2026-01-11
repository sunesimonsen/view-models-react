import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ViewModel } from "@view-models/core";
import { useModelState } from "../src/useModelState.js";

type CounterState = Readonly<{ count: number }>;

class CounterViewModel extends ViewModel<CounterState> {
  increment() {
    this.update(({ count }) => ({ count: count + 1 }));
  }

  decrement() {
    this.update(({ count }) => ({ count: count - 1 }));
  }
}

describe("useModelState", () => {
  let counterModel: CounterViewModel;

  beforeEach(() => {
    counterModel = new CounterViewModel({ count: 0 });
  });

  function TestComponent() {
    const { count } = useModelState(counterModel);
    return <div>Count: {count}</div>;
  }

  it("returns the initial state", () => {
    render(<TestComponent />);
    expect(screen.getByText("Count: 0")).toBeDefined();
  });

  it("updates when the model state changes", () => {
    render(<TestComponent />);
    expect(screen.getByText("Count: 0")).toBeDefined();

    act(() => {
      counterModel.increment();
    });

    expect(screen.getByText("Count: 1")).toBeDefined();

    act(() => {
      counterModel.increment();
    });

    expect(screen.getByText("Count: 2")).toBeDefined();
  });

  it("handles multiple state updates", () => {
    render(<TestComponent />);

    act(() => {
      counterModel.increment();
      counterModel.increment();
      counterModel.decrement();
    });

    expect(screen.getByText("Count: 1")).toBeDefined();
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = render(<TestComponent />);

    unmount();

    act(() => {
      counterModel.increment();
    });
  });

  it("works with multiple components", () => {
    function Component1() {
      const state = useModelState(counterModel);
      return <div data-testid="component1">Count: {state.count}</div>;
    }

    function Component2() {
      const state = useModelState(counterModel);
      return <div data-testid="component2">Count: {state.count}</div>;
    }

    render(
      <>
        <Component1 />
        <Component2 />
      </>,
    );

    expect(screen.getByTestId("component1").textContent).toBe("Count: 0");
    expect(screen.getByTestId("component2").textContent).toBe("Count: 0");

    act(() => {
      counterModel.increment();
    });

    expect(screen.getByTestId("component1").textContent).toBe("Count: 1");
    expect(screen.getByTestId("component2").textContent).toBe("Count: 1");
  });
});

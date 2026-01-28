import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ViewModel } from "@view-models/core";
import { useDerivedState } from "../src/useDerivedState.js";
import { derived } from "../src/derived.js";

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
  addTodo(text: string) {
    const newItem: TodoItem = {
      id: Date.now(),
      text,
      completed: false,
    };
    super.update({ items: [...super.state.items, newItem] });
  }

  toggleTodo(id: number) {
    super.update({
      items: super.state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    });
  }

  setFilter(filter: TodoState["filter"]) {
    super.update({ filter });
  }
}

describe("useDerivedState", () => {
  let todoModel: TodoViewModel;

  beforeEach(() => {
    todoModel = new TodoViewModel({
      items: [
        { id: 1, text: "Learn React", completed: true },
        { id: 2, text: "Learn ViewModels", completed: false },
        { id: 3, text: "Build an app", completed: false },
      ],
      filter: "all",
    });
  });

  it("returns derived state from model", () => {
    function TestComponent() {
      const completedCount = useDerivedState(
        todoModel,
        ({ items }) => items.filter((item) => item.completed).length,
      );
      return <div>Completed: {completedCount}</div>;
    }

    render(<TestComponent />);
    expect(screen.getByText("Completed: 1")).toBeDefined();
  });

  it("updates when model state changes", () => {
    function TestComponent() {
      const completedCount = useDerivedState(
        todoModel,
        ({ items }) => items.filter((item) => item.completed).length,
      );
      return <div>Completed: {completedCount}</div>;
    }

    render(<TestComponent />);
    expect(screen.getByText("Completed: 1")).toBeDefined();

    act(() => {
      todoModel.toggleTodo(2);
    });

    expect(screen.getByText("Completed: 2")).toBeDefined();

    act(() => {
      todoModel.toggleTodo(3);
    });

    expect(screen.getByText("Completed: 3")).toBeDefined();
  });

  it("works with complex derived state", () => {
    function TestComponent() {
      const stats = useDerivedState(todoModel, ({ items }) => ({
        total: items.length,
        completed: items.filter((item) => item.completed).length,
        active: items.filter((item) => !item.completed).length,
      }));

      return (
        <div>
          <div data-testid="total">Total: {stats.total}</div>
          <div data-testid="completed">Completed: {stats.completed}</div>
          <div data-testid="active">Active: {stats.active}</div>
        </div>
      );
    }

    render(<TestComponent />);

    expect(screen.getByTestId("total").textContent).toBe("Total: 3");
    expect(screen.getByTestId("completed").textContent).toBe("Completed: 1");
    expect(screen.getByTestId("active").textContent).toBe("Active: 2");

    act(() => {
      todoModel.addTodo("New task");
    });

    expect(screen.getByTestId("total").textContent).toBe("Total: 4");
    expect(screen.getByTestId("completed").textContent).toBe("Completed: 1");
    expect(screen.getByTestId("active").textContent).toBe("Active: 3");
  });

  it("works with memoized derived selectors", () => {
    const mapper = vi.fn(
      ({ items }: TodoState) => items.filter((item) => item.completed).length,
    );
    const selectCompletedCount = derived(mapper);

    function TestComponent() {
      const completedCount = useDerivedState(todoModel, selectCompletedCount);
      return <div>Completed: {completedCount}</div>;
    }

    render(<TestComponent />);
    expect(screen.getByText("Completed: 1")).toBeDefined();
    expect(mapper).toHaveBeenCalledTimes(1);

    act(() => {
      todoModel.toggleTodo(2);
    });

    expect(screen.getByText("Completed: 2")).toBeDefined();
    expect(mapper).toHaveBeenCalledTimes(2);
  });

  it("only re-executes mapper when relevant state changes", () => {
    const mapper = vi.fn((state: TodoState) =>
      state.items.filter((item) => {
        if (state.filter === "all") return true;
        if (state.filter === "active") return !item.completed;
        if (state.filter === "completed") return item.completed;
        return false;
      }),
    );

    const selectFilteredItems = derived(mapper);

    function TestComponent() {
      const filteredItems = useDerivedState(todoModel, selectFilteredItems);
      return <div>Count: {filteredItems.length}</div>;
    }

    render(<TestComponent />);
    expect(screen.getByText("Count: 3")).toBeDefined();
    expect(mapper).toHaveBeenCalledTimes(1);

    act(() => {
      todoModel.setFilter("active");
    });

    expect(screen.getByText("Count: 2")).toBeDefined();
    expect(mapper).toHaveBeenCalledTimes(2);

    act(() => {
      todoModel.setFilter("completed");
    });

    expect(screen.getByText("Count: 1")).toBeDefined();
    expect(mapper).toHaveBeenCalledTimes(3);
  });

  it("works with multiple components subscribing to the same derived state", () => {
    const selectStats = derived((state: TodoState) => ({
      completed: state.items.filter((item) => item.completed).length,
      total: state.items.length,
    }));

    function Component1() {
      const stats = useDerivedState(todoModel, selectStats);
      return (
        <div data-testid="component1">
          Completed: {stats.completed} of {stats.total}
        </div>
      );
    }

    function Component2() {
      const stats = useDerivedState(todoModel, selectStats);
      return (
        <div data-testid="component2">
          Completed: {stats.completed} of {stats.total}
        </div>
      );
    }

    render(
      <>
        <Component1 />
        <Component2 />
      </>,
    );

    expect(screen.getByTestId("component1").textContent).toBe(
      "Completed: 1 of 3",
    );
    expect(screen.getByTestId("component2").textContent).toBe(
      "Completed: 1 of 3",
    );

    act(() => {
      todoModel.toggleTodo(2);
    });

    expect(screen.getByTestId("component1").textContent).toBe(
      "Completed: 2 of 3",
    );
    expect(screen.getByTestId("component2").textContent).toBe(
      "Completed: 2 of 3",
    );
  });

  it("unsubscribes on unmount", () => {
    function TestComponent() {
      const completedCount = useDerivedState(
        todoModel,
        (state) => state.items.filter((item) => item.completed).length,
      );
      return <div>Completed: {completedCount}</div>;
    }

    const { unmount } = render(<TestComponent />);

    unmount();

    act(() => {
      todoModel.toggleTodo(2);
    });
  });
});

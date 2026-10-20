import { useCallback, useEffect, useMemo, useState } from "react";
import type { SetStateAction } from "react";

type DepsItem = string | number | boolean | string[] | null | undefined;

type InternalState<T> = {
  value: T;
  depsKey: string;
};

// Use JSON.stringify to have content equality for nested string[] deps, unlike a reference comparison
// A [typeof, value] tuple keeps undefined, null and NaN distinct, as JSON.stringify maps all three to null
const getDepsKey = (deps: DepsItem[]): string =>
  JSON.stringify(deps.map((dep) => [typeof dep, dep]));

/**
 * This hook is similar to a simple useState(initialValue) but it will
 * automatically reset the state to `initialValue` when one of the dependencies
 * changes.
 *
 * @param initialValue the initial value of the state, and the value the state
 * resets to when a dep changes.
 * @param deps the dependencies that trigger the reset.
 * @returns a tuple with the current value and a setter, behaving like useState.
 */
export function useStateReset<T>(initialValue: T, deps: DepsItem[]) {
  const depsKey = getDepsKey(deps);

  const [state, setState] = useState<InternalState<T>>({
    depsKey,
    value: initialValue,
  });

  // detect when deps are different and immediatly return the initialValue
  const value = useMemo(() => {
    if (depsKey === state.depsKey) {
      return state.value;
    }

    return initialValue;
  }, [depsKey, state.depsKey, state.value, initialValue]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    setState((prev) =>
      depsKey === prev.depsKey ? prev : { depsKey, value: initialValue },
    );
  }, [depsKey, initialValue]);

  const setValue = useCallback((update: SetStateAction<T>) => {
    setState((prev) => {
      const next =
        typeof update === "function"
          ? (update as (curr: T) => T)(prev.value)
          : update;

      if (next === prev.value) {
        return prev;
      }

      return { depsKey: prev.depsKey, value: next };
    });
  }, []);

  return [value, setValue] as const;
}

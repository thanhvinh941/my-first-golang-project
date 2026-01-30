import { lazy } from "react";

export function lazyWithDelay(
  factory: () => Promise<{ default: React.ComponentType<any> }>,
  delay = 1500
) {
  return lazy(() =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      setTimeout(() => {
        factory().then(resolve);
      }, delay);
    })
  );
}

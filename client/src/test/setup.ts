import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Simulate the callback being called with some entries
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
          borderBoxSize: [{ blockSize: 100, inlineSize: 100 }],
          contentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
          devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
        },
      ],
      this
    );
  }

  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

beforeAll(() => {
  // Add any global setup if needed
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Add any global cleanup if needed
});

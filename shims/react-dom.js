/**
 * Minimal react-dom shim for React Native.
 *
 * @react-aria/utils imports `flushSync` from "react-dom".  On the web this
 * batches state updates synchronously; on RN the equivalent behaviour is
 * simply invoking the callback immediately, which is what React Native's
 * own internals do.
 */

export function flushSync(fn) {
  if (typeof fn === 'function') {
    fn()
  }
}

// Some libraries check for createPortal / render; provide harmless stubs so
// the import doesn't throw at module evaluation time.
export function createPortal() {
  return null
}

export function render() {}
export function unmountComponentAtNode() {}

export default {
  flushSync,
  createPortal,
  render,
  unmountComponentAtNode,
}

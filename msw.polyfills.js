import 'react-native-url-polyfill/auto'
import { TextDecoder, TextEncoder } from 'text-encoding'
import { ReadableStream } from 'web-streams-polyfill'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream
}

// Diagnostic: is global.fetch the same reference as globalThis.fetch?
console.log(
  '[Polyfills] global.fetch === globalThis.fetch:',
  global.fetch === globalThis.fetch,
)
console.log('[Polyfills] fetch name:', globalThis.fetch?.name)

// After MSW patches globalThis.fetch, React Native's fetch call sites
// may still hold a reference to the original un-patched function.
// Verify by checking what descriptor looks like:
const desc = Object.getOwnPropertyDescriptor(globalThis, 'fetch')
console.log(
  '[Polyfills] fetch descriptor:',
  JSON.stringify(
    desc
      ? {
          configurable: desc.configurable,
          writable: desc.writable,
          enumerable: desc.enumerable,
          hasValue: desc.value != null,
        }
      : null,
  ),
)

if (typeof global.EventTarget === 'undefined') {
  global.EventTarget = class EventTarget {
    constructor() {
      this.listeners = {}
    }
    addEventListener(type, listener) {
      if (!this.listeners[type]) this.listeners[type] = []
      this.listeners[type].push(listener)
    }
    removeEventListener(type, listener) {
      if (!this.listeners[type]) return
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener)
    }
    dispatchEvent(event) {
      if (!this.listeners[event.type]) return true
      this.listeners[event.type].forEach((l) => l(event))
      return true
    }
  }
}

if (typeof global.Event === 'undefined') {
  global.Event = class Event {
    constructor(type) {
      this.type = type
    }
  }
}

if (typeof global.MessageEvent === 'undefined') {
  global.MessageEvent = class MessageEvent extends global.Event {
    constructor(type, init) {
      super(type)
      this.data = init?.data
    }
  }
}

if (typeof global.BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel extends global.EventTarget {
    constructor(name) {
      super()
      this.name = name
    }
    postMessage(data) {
      const event = new global.MessageEvent('message', { data })
      this.dispatchEvent(event)
    }
    close() {}
  }
}

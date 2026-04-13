// src/data/mocks/fetchXhrShim.ts
//
// Translates fetch() calls into XHR so MirageJS (which patches XHR) can
// intercept them. Must be installed AFTER startMirageServer() is called.

let _originalFetch: typeof globalThis.fetch | null = null

export function installFetchXhrShim(): void {
  if (_originalFetch) return // already installed
  _originalFetch = globalThis.fetch

  globalThis.fetch = function shimmedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    return new Promise((resolve, reject) => {
      const urlString =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.href
            : (input as Request).url

      const method = (
        init?.method ?? (input instanceof Request ? input.method : 'GET')
      ).toUpperCase()

      const xhr = new XMLHttpRequest()
      xhr.open(method, urlString, true)

      // Copy request headers
      const headers =
        init?.headers instanceof Headers
          ? init.headers
          : new Headers(init?.headers ?? {})
      headers.forEach((value, key) => {
        xhr.setRequestHeader(key, value)
      })

      xhr.responseType = 'text'

      xhr.onload = () => {
        const responseHeaders = new Headers()
        xhr
          .getAllResponseHeaders()
          .trim()
          .split(/\r?\n/)
          .forEach((line) => {
            const [key, ...rest] = line.split(': ')
            if (key) responseHeaders.set(key, rest.join(': '))
          })

        resolve(
          new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: responseHeaders,
          }),
        )
      }

      xhr.onerror = () => reject(new TypeError('Network request failed'))
      xhr.ontimeout = () => reject(new TypeError('Network request timed out'))

      const body =
        init?.body != null
          ? typeof init.body === 'string'
            ? init.body
            : JSON.stringify(init.body)
          : null

      xhr.send(body)
    })
  }

  console.log('[FetchXhrShim] installed — fetch now routes through XHR')
}

export function uninstallFetchXhrShim(): void {
  if (_originalFetch) {
    globalThis.fetch = _originalFetch
    _originalFetch = null
    console.log('[FetchXhrShim] uninstalled')
  }
}

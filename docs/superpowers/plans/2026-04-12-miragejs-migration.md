# MirageJS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-rolled `mockFetch.ts` with a proper MirageJS server that intercepts HTTP calls, preserving all existing school and turma CRUD routes.

**Architecture:** MirageJS intercepts XHR. Since the app runs on New Architecture (JSI fetch bypasses XHR), we install a thin `fetch`→XHR shim _after_ Mirage is started, so `fetch` calls are translated to XHR requests that Mirage can intercept. The shim lives in a dedicated file and is installed once at app startup in `_layout.tsx`.

**Tech Stack:** MirageJS 0.1.48, `@faker-js/faker` (already installed), React Native New Architecture / Hermes.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Install (npm) | `package.json` | Add `miragejs` dependency |
| Create | `src/data/mocks/fetchXhrShim.ts` | Translates `global.fetch` calls to XHR so Mirage intercepts them |
| Create | `src/data/mocks/mirageServer.ts` | Defines the Mirage server: routes, seeds, in-memory data |
| Delete | `src/data/mocks/mockFetch.ts` | No longer needed (replaced by mirageServer + shim) |
| Modify | `app/_layout.tsx` | Import `startMirageServer` instead of `installMockFetch` |
| Keep | `src/data/mocks/dataStore.ts` | Faker-generated data reused as seed |
| Keep | `src/data/mocks/handlers.ts` | MSW handlers — kept in repo but not imported anywhere |
| Keep | `src/data/mocks/server.ts` | MSW server — kept in repo but not imported anywhere |
| Keep | `src/data/repositories/SchoolRepository.ts` | Unchanged — still fetches `http://localhost/api/schools` |

---

## Task 1: Install MirageJS

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install miragejs
```

Expected output: `added N packages` with no peer-dependency errors.

- [ ] **Step 2: Verify TypeScript types are available**

MirageJS ships its own types. Confirm they're accessible:

```bash
ls node_modules/miragejs/types
```

Expected: directory exists (e.g. contains `index.d.ts`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install miragejs"
```

---

## Task 2: Create the fetch→XHR shim

**Files:**
- Create: `src/data/mocks/fetchXhrShim.ts`

This shim translates `global.fetch(url, init)` calls into `XMLHttpRequest` calls so MirageJS can intercept them. It is installed _after_ Mirage starts (so Mirage has already patched `XMLHttpRequest`).

- [ ] **Step 1: Create the file**

```typescript
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
        init?.method ??
        (input instanceof Request ? input.method : 'GET')
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
```

- [ ] **Step 2: Commit**

```bash
git add src/data/mocks/fetchXhrShim.ts
git commit -m "feat(mock): add fetch-to-XHR shim for MirageJS compatibility"
```

---

## Task 3: Create the MirageJS server

**Files:**
- Create: `src/data/mocks/mirageServer.ts`
- Reference: `src/data/mocks/dataStore.ts` (for seed data)
- Reference: `src/domain/entities/School.ts`, `src/domain/entities/Turma.ts`

Mirage uses a `createServer` function. We configure:
- **models** (in-memory schema): `school` and `turma`
- **seeds**: populate from the existing `dataStore` faker-generated data
- **routes**: replicate all endpoints from the old `handlers.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/data/mocks/mirageServer.ts
import { createServer, Model, Response as MirageResponse } from 'miragejs'
import { dataStore } from './dataStore'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function startMirageServer() {
  const server = createServer({
    models: {
      school: Model,
      turma: Model,
    },

    seeds(server) {
      // Seed from the faker-generated dataStore so data is consistent
      for (const school of dataStore.schools) {
        server.db.schools.insert({ ...school })
      }
      for (const turma of dataStore.turmas) {
        server.db.turmas.insert({ ...turma })
      }
    },

    routes() {
      this.namespace = 'api'

      // GET /api/schools
      this.get('/schools', (schema) => {
        console.log('[Mirage] GET /api/schools')
        const schools = schema.db.schools.where({})
        return schools.map((s: any) => ({
          ...s,
          classCount: schema.db.turmas.where({ schoolId: s.id }).length,
        }))
      })

      // POST /api/schools
      this.post('/schools', (schema, request) => {
        console.log('[Mirage] POST /api/schools')
        const body = JSON.parse(request.requestBody)
        const newSchool = {
          id: generateId(),
          name: body.name,
          address: body.address,
          classCount: 0,
        }
        schema.db.schools.insert(newSchool)
        return new MirageResponse(201, { 'Content-Type': 'application/json' }, JSON.stringify(newSchool))
      })

      // GET /api/schools/:id
      this.get('/schools/:id', (schema, request) => {
        console.log('[Mirage] GET /api/schools/:id', request.params.id)
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'School not found' }))
        }
        return {
          ...school,
          classCount: schema.db.turmas.where({ schoolId: school.id }).length,
        }
      })

      // PUT /api/schools/:id
      this.put('/schools/:id', (schema, request) => {
        console.log('[Mirage] PUT /api/schools/:id', request.params.id)
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'School not found' }))
        }
        const body = JSON.parse(request.requestBody)
        schema.db.schools.update({ id: request.params.id }, body)
        const updated = schema.db.schools.findBy({ id: request.params.id })
        return {
          ...updated,
          classCount: schema.db.turmas.where({ schoolId: updated.id }).length,
        }
      })

      // DELETE /api/schools/:id
      this.del('/schools/:id', (schema, request) => {
        console.log('[Mirage] DELETE /api/schools/:id', request.params.id)
        const school = schema.db.schools.findBy({ id: request.params.id })
        if (!school) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'School not found' }))
        }
        schema.db.turmas.where({ schoolId: request.params.id }).forEach((t: any) => {
          schema.db.turmas.remove(t)
        })
        schema.db.schools.remove(school)
        return { success: true }
      })

      // GET /api/schools/:schoolId/turmas
      this.get('/schools/:schoolId/turmas', (schema, request) => {
        console.log('[Mirage] GET /api/schools/:schoolId/turmas', request.params.schoolId)
        return schema.db.turmas.where({ schoolId: request.params.schoolId })
      })

      // POST /api/turmas
      this.post('/turmas', (schema, request) => {
        console.log('[Mirage] POST /api/turmas')
        const body = JSON.parse(request.requestBody)
        const newTurma = {
          id: generateId(),
          name: body.name,
          shift: body.shift,
          academicYear: body.academicYear,
          schoolId: body.schoolId,
        }
        schema.db.turmas.insert(newTurma)
        return new MirageResponse(201, { 'Content-Type': 'application/json' }, JSON.stringify(newTurma))
      })

      // GET /api/turmas/:id
      this.get('/turmas/:id', (schema, request) => {
        console.log('[Mirage] GET /api/turmas/:id', request.params.id)
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'Turma not found' }))
        }
        return turma
      })

      // PUT /api/turmas/:id
      this.put('/turmas/:id', (schema, request) => {
        console.log('[Mirage] PUT /api/turmas/:id', request.params.id)
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'Turma not found' }))
        }
        const body = JSON.parse(request.requestBody)
        schema.db.turmas.update({ id: request.params.id }, body)
        return schema.db.turmas.findBy({ id: request.params.id })
      })

      // DELETE /api/turmas/:id
      this.del('/turmas/:id', (schema, request) => {
        console.log('[Mirage] DELETE /api/turmas/:id', request.params.id)
        const turma = schema.db.turmas.findBy({ id: request.params.id })
        if (!turma) {
          return new MirageResponse(404, {}, JSON.stringify({ error: 'Turma not found' }))
        }
        schema.db.turmas.remove(turma)
        return { success: true }
      })

      // Allow all other requests to pass through (e.g. asset bundles)
      this.passthrough()
    },
  })

  console.log('[Mirage] server started')
  return server
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/mocks/mirageServer.ts
git commit -m "feat(mock): add MirageJS server with all school and turma routes"
```

---

## Task 4: Wire up Mirage in _layout.tsx

**Files:**
- Modify: `app/_layout.tsx`

Replace the `installMockFetch` call with: start Mirage server, then install the fetch→XHR shim.

- [ ] **Step 1: Edit `enableMocking` in `app/_layout.tsx`**

Replace the current `enableMocking` function:

```typescript
async function enableMocking() {
  if (!__DEV__) {
    return
  }
  console.log('[Mock] starting Mirage server...')
  const { startMirageServer } = await import('../src/data/mocks/mirageServer')
  startMirageServer()
  console.log('[Mock] installing fetch→XHR shim...')
  const { installFetchXhrShim } = await import('../src/data/mocks/fetchXhrShim')
  installFetchXhrShim()
  console.log('[Mock] ready')
}
```

> **Important:** `startMirageServer()` must be called before `installFetchXhrShim()`. Mirage needs to patch `XMLHttpRequest` first; then the shim routes `fetch` through that patched XHR.

- [ ] **Step 2: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat(mock): wire MirageJS + fetch-XHR shim in app layout"
```

---

## Task 5: Delete the now-unused mockFetch.ts

**Files:**
- Delete: `src/data/mocks/mockFetch.ts`

- [ ] **Step 1: Remove the file**

```bash
git rm src/data/mocks/mockFetch.ts
```

- [ ] **Step 2: Verify no imports remain**

```bash
grep -r "mockFetch" src/ app/
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(mock): remove hand-rolled mockFetch replaced by MirageJS"
```

---

## Task 6: Smoke-test on device

**Files:** none — verification only.

- [ ] **Step 1: Start the app**

```bash
npx expo start --android
```

- [ ] **Step 2: Check Metro/Logcat for expected log sequence**

In order, you should see:
```
[Mock] starting Mirage server...
[Mirage] server started
[Mock] installing fetch→XHR shim...
[FetchXhrShim] installed — fetch now routes through XHR
[Mock] ready
[Store] fetchSchools called
[Store] calling repository.findAll()...
[Mirage] GET /api/schools
[Store] repository.findAll() returned 2 schools
```

- [ ] **Step 3: Verify school list renders**

The school list screen should display 2 faker-generated schools (not empty, not a spinner that never resolves).

- [ ] **Step 4: Verify create school works**

Tap the "add school" button, fill in name + address, submit. The new school should appear in the list. Check logs for:
```
[Mirage] POST /api/schools
```

- [ ] **Step 5: If schools list is empty or an error appears**

Check Logcat for any error lines. Common issues and fixes:

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `XMLHttpRequest` not defined | Missing global polyfill | Mirage ships with Pretender which needs XHR — check that RN's XHR global is available (it always is on RN) |
| `Cannot read property 'namespace' of undefined` | Mirage version mismatch | Ensure `miragejs@0.1.48` installed, not a beta |
| `No mock for GET /api/schools` (from old shim) | `mockFetch.ts` still imported somewhere | Run `grep -r mockFetch app/ src/` |
| 404 from Mirage on all routes | `namespace` not matching URL | `BASE_URL` in `SchoolRepository.ts` must be `http://localhost/api` — confirm it's still `http://localhost/api` |
| Shim throws `XMLHttpRequest is not defined` | Running in a non-RN environment | Only a concern for unit tests, not device |

---

## Task 7: Check for Metro resolver cleanup (optional)

**Files:**
- Modify (if needed): `metro.config.js`

The current `metro.config.js` has `extraNodeModules` aliases for `@mswjs/interceptors`. Now that MSW is no longer the active mock, these aliases are dead weight but harmless. Remove them to keep the config clean.

- [ ] **Step 1: Review current metro.config.js**

```bash
cat metro.config.js
```

- [ ] **Step 2: Remove the MSW-specific aliases**

Edit `metro.config.js` to remove the `@mswjs/interceptors/fetch` and `@mswjs/interceptors/XMLHttpRequest` entries from `extraNodeModules`. Keep `react-dom` shim — it's unrelated to MSW.

```js
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

config.resolver = config.resolver || {}
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-dom': path.resolve(__dirname, 'shims/react-dom.js'),
}

module.exports = withNativeWind(config, { input: './global.css' })
```

- [ ] **Step 3: Commit**

```bash
git add metro.config.js
git commit -m "chore: remove MSW metro resolver aliases, no longer needed"
```

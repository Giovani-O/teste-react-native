# Software Design Document (SDD)

**Project:** School & Class Registry  
**Version:** 1.1  
**Date:** 2026-04-11  
**Status:** Draft

---

## 1. Tech Stack

| Technology | Version | Role |
|---|---|---|
| Expo SDK | 54.0.33 | App runtime and toolchain |
| React | 19.1.0 | UI framework (bundled by Expo 54) |
| React Native | 0.81.5 | Mobile rendering (bundled by Expo 54) |
| TypeScript | 5.9.2 | Static typing |
| expo-router | 6.0.23 | File-based navigation |
| Gluestack UI | v3 (CLI 3.0.11) | UI component scaffolding |
| Gluestack UI Core | 3.0.16 | UI component library |
| NativeWind | 4.2.3 | Tailwind CSS styling for React Native |
| Tailwind CSS | 3.4.19 | Utility-first CSS framework (via NativeWind) |
| Zustand | 5.0.12 | Client state management |
| MSW | 2.13.2 | Mocked API server (native mode) |
| AsyncStorage | 2.2.0 | Local persistence |
| jest-expo | 55.0.15 | Test runner |
| Biome | 2.4.11 | Linter and formatter |

### 1.1 Dependency Troubleshooting

> **Note:** If dependency conflicts arise (version mismatches, peer-dep errors,
> native-module incompatibilities), try Microsoft's
> [`@rnx-kit/align-deps`](https://microsoft.github.io/rnx-kit/docs/guides/dependency-management)
> before manually resolving versions.
>
> ```bash
> # Install
> yarn add @rnx-kit/align-deps --dev   # or: npm i -D @rnx-kit/align-deps
>
> # Check for misaligned deps
> npx rnx-align-deps
>
> # Auto-fix versions to known-compatible set
> npx rnx-align-deps --write
>
> # Target a specific RN version during upgrades
> npx rnx-align-deps --requirements react-native@0.85 --write
> ```
>
> The tool cross-references packages against a compatibility database maintained
> by Microsoft and adjusts `package.json` versions accordingly. Always review the
> diff and test thoroughly after running `--write`.
>
> Reference: <https://dev.to/ajmal_hasan/stop-fighting-react-native-dependency-hell-use-this-microsoft-tool-3g5g>

---

## 2. Architecture

The application follows **Clean Architecture** with three layers. Each layer has a single responsibility and communicates only with the layer directly below it.

```
┌─────────────────────────────┐
│        Presentation         │  screens/, components/
│  (React components, hooks)  │
└────────────┬────────────────┘
             │ reads/dispatches
┌────────────▼────────────────┐
│           Store             │  store/
│    (Zustand + persistence)  │
└────────────┬────────────────┘
             │ calls
┌────────────▼────────────────┐
│            Data             │  data/
│  (Repositories + Adapters)  │
└────────────┬────────────────┘
             │ uses contracts from
┌────────────▼────────────────┐
│           Domain            │  domain/
│   (Entities + Interfaces)   │
└─────────────────────────────┘
             ↑
   MSW intercepts fetch() calls
   at the network level (dev only)
```

**Rules:**
- Screens never call `fetch`, touch AsyncStorage, or instantiate repositories
- Stores are the only writers to AsyncStorage
- Adapters are the only code that knows the raw API response shape
- Domain entities are plain TypeScript interfaces with no framework imports

---

## 3. Project Structure

```
/
├── app/                          # Expo Router routes (thin wrappers only)
│   ├── _layout.tsx               # Root layout — MSW init, tab navigator
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar definition (single tab: schools)
│       └── schools/
│           ├── index.tsx         # → SchoolListScreen
│           └── [id].tsx          # → SchoolDetailScreen
│
└── src/
    ├── domain/                   # Pure TypeScript — no framework deps
    │   ├── entities/             # School, Turma types/interfaces
    │   └── repositories/         # Repository interfaces (contracts)
    │
    ├── data/                     # Implements domain contracts
    │   ├── adapters/             # Raw API response → domain entity
    │   ├── repositories/         # Concrete fetch-based implementations
    │   └── mocks/                # MSW handlers + in-memory data store
    │
    ├── store/                    # Zustand stores with AsyncStorage middleware
    │   ├── schools.store.ts
    │   └── turmas.store.ts
    │
    ├── screens/                  # Screen components (one folder per route)
    │   └── schools/
    │       ├── SchoolListScreen.tsx
    │       └── SchoolDetailScreen.tsx
    │
    └── components/               # Shared UI components only
        ├── BottomSheet.tsx       # Reusable bottom sheet wrapper
        └── ConfirmDialog.tsx     # Reusable alert dialog wrapper
```

---

## 4. Domain Entities

```ts
// src/domain/entities/School.ts
export interface School {
  id: string
  name: string
  address: string
  classCount: number  // derived — computed from class count, never stored
}

export interface CreateSchoolDTO {
  name: string
  address: string
}

export interface UpdateSchoolDTO {
  name?: string
  address?: string
}
```

```ts
// src/domain/entities/Turma.ts
export type Shift = 'morning' | 'afternoon' | 'evening'

export interface Turma {
  id: string
  name: string
  shift: Shift
  academicYear: number
  schoolId: string
}

export interface CreateTurmaDTO {
  name: string
  shift: Shift
  academicYear: number
  schoolId: string  // set implicitly by the screen, never entered by user
}

export interface UpdateTurmaDTO {
  name?: string
  shift?: Shift
  academicYear?: number
}
```

---

## 5. Design Patterns

### 5.1 Adapter Pattern

Adapters live in `src/data/adapters/`. Each adapter transforms a raw MSW API response into a typed domain entity. This is the only place that knows the API response shape — if the mock API changes, only the adapter changes.

```ts
// src/data/adapters/school.adapter.ts
export function adaptSchool(raw: RawSchoolResponse): School {
  return {
    id: raw.id,
    name: raw.name,
    address: raw.address,
    classCount: raw.classCount ?? 0,
  }
}
```

### 5.2 Factory Pattern

A `RepositoryFactory` in `src/data/repositories/` creates repository instances with the correct adapter injected. Stores receive a repository instance — they never call `new` directly.

```ts
// src/data/repositories/factory.ts
export class RepositoryFactory {
  static createSchoolRepository(): ISchoolRepository {
    return new SchoolRepository(adaptSchool)
  }
  static createTurmaRepository(): ITurmaRepository {
    return new TurmaRepository(adaptTurma)
  }
}
```

---

## 6. State Management

### 6.1 Store Shape

```ts
// src/store/schools.store.ts
interface SchoolStore {
  schools: School[]
  isLoading: boolean
  error: string | null

  fetchSchools: () => Promise<void>
  createSchool: (data: CreateSchoolDTO) => Promise<void>
  updateSchool: (id: string, data: UpdateSchoolDTO) => Promise<void>
  deleteSchool: (id: string) => Promise<void>
}
```

```ts
// src/store/turmas.store.ts
interface TurmaStore {
  turmas: Turma[]
  isLoading: boolean
  error: string | null

  fetchTurmasBySchool: (schoolId: string) => Promise<void>
  createTurma: (data: CreateTurmaDTO) => Promise<void>
  updateTurma: (id: string, data: UpdateTurmaDTO) => Promise<void>
  deleteTurma: (id: string) => Promise<void>
}
```

### 6.2 Derived Data

`classCount` on each `School` is computed by the MSW handler when returning school data — it counts the turmas with a matching `schoolId` in the in-memory store. The field is never stored on the school record itself.

### 6.3 AsyncStorage Persistence

A `withAsyncStorage` middleware wraps each store. On every state write, it serializes the relevant slice and saves it to AsyncStorage under a namespaced key. On first mount, the store hydrates from AsyncStorage before rendering.

```
Keys: @schools/list, @turmas/list
```

MSW is still called for all mutations. AsyncStorage mirrors store state — it is not the source of truth.

---

## 7. Routing

Expo Router provides file-based routing. Route files are minimal — 3–5 lines each, importing the real screen from `src/screens/`.

| Route | Screen | Purpose |
|---|---|---|
| `(tabs)/schools/index` | SchoolListScreen | List all schools, open filter sheet, open create form sheet |
| `(tabs)/schools/[id]` | SchoolDetailScreen | School info + class list, open filter sheet, open create/edit class form sheet |

There is no standalone create/edit route. All create and edit operations open a **bottom sheet** within the current screen. The `[id]` route covers both viewing and editing a school. Turma operations are handled entirely within `SchoolDetailScreen`.

---

## 8. UI Interaction Patterns

### 8.1 Bottom Sheet

A shared `BottomSheet` component (wrapping a Gluestack UI v3 Modal) is used for:

- **Filter sheet** — triggered by a "Filtrar" button in the screen header; contains filter controls for the list below
- **Create form sheet** — triggered by the FAB (+); contains the form to create a new school or class
- **Edit form sheet** — triggered by an edit action on a card; pre-populates the form with existing values

The same form component is rendered inside the sheet for both create and edit — it receives an optional `initialValues` prop to distinguish the two modes.

### 8.2 Alert Dialog

A shared `ConfirmDialog` component (wrapping a Gluestack UI v3 Modal) is used exclusively for delete confirmation. It displays:

- A warning message: *"Esta ação não pode ser desfeita."*
- **Cancelar** and **Excluir** buttons

### 8.3 FAB

Each list screen has a floating action button (+) anchored to the bottom-right corner. Tapping it opens the create form bottom sheet.

---

## 9. Mocked Backend (MSW)

MSW runs in native mode via `msw/native` using `@mswjs/interceptors`. It intercepts `fetch` at the network level — no special casing needed in production code paths.

**Initialization** (in `app/_layout.tsx`, dev only):
```ts
if (__DEV__) {
  const { server } = require('../src/data/mocks/server')
  server.listen()
}
```

**Endpoints:**

```
GET    /api/schools              List all schools (classCount computed inline)
POST   /api/schools              Create a school
GET    /api/schools/:id          Get a school by ID
PUT    /api/schools/:id          Update a school
DELETE /api/schools/:id          Delete a school (also deletes its turmas)

GET    /api/schools/:id/turmas   List all turmas for a school
POST   /api/turmas               Create a turma (schoolId in body)
GET    /api/turmas/:id           Get a turma by ID
PUT    /api/turmas/:id           Update a turma
DELETE /api/turmas/:id           Delete a turma
```

An in-memory data store inside the MSW handlers simulates persistence within a session. Deleting a school cascades to delete its turmas in the in-memory store.

---

## 10. UI Layer

Gluestack UI v3 components are added via the `gluestack-ui` CLI on demand to `components/ui/`. NativeWind (Tailwind CSS for React Native) provides the styling mechanism.

- Global stylesheet at `global.css` with Tailwind directives — all styling via `className` props using Tailwind utility classes
- Gluestack components used for: Button, Pressable, Modal (bottom sheet and alert dialog), Box, Text
- Screens import from `src/components/` for shared elements (`BottomSheet`, `ConfirmDialog`, `FAB`, empty states, loading indicators)
- `GluestackUIProvider` wraps the app in `app/_layout.tsx`

> **Language convention:** UI strings are in Brazilian Portuguese (pt-BR). All code identifiers — types, interfaces, variables, functions, file names — are in English.

---

## 11. Testing

Tests are scoped to **screens and components only** (v1 scope).

| Tool | Role |
|---|---|
| jest-expo | Test runner, preset handles RN/Expo transforms |
| React Native Testing Library | Render and interact with components |
| MSW | Same handlers reused as test fixtures |
| AsyncStorage mock | `@react-native-async-storage/async-storage/jest/async-storage-mock` |

Tests live co-located with the component they test in a `__tests__/` subfolder.

---

## 12. Linting & Formatting

Biome replaces ESLint and Prettier. Single config file (`biome.json`) at project root. Run via:

```
npx biome check --apply .
```

TypeScript strict mode is enabled in `tsconfig.json`.

---

## 13. Deployment

The app is distributed via **Expo Go**. A QR code is generated by running:

```
npx expo start
```

No EAS build, no app store submission required for v1.

# Product Requirements Document (PRD)

**Project:** School & Class Registry  
**Version:** 1.1  
**Date:** 2026-04-11  
**Status:** Draft

---

## 1. Overview

A mobile application for school administrators to register and manage schools and their classes. The app operates with a mocked backend (MSW) and persists data locally via AsyncStorage. It is distributed via Expo Go using a QR code — no app store deployment required.

---

## 2. Goals

- Provide a simple, functional CRUD interface for managing schools and classes
- Demonstrate a clean, maintainable React Native architecture using industry-standard patterns
- UI fully in Brazilian Portuguese (pt-BR) — applies to all visible strings only; code identifiers (variables, types, functions, files) are in English

---

## 3. Non-Goals

- No user authentication or role-based access control
- No real backend integration (mocked only)
- No push notifications
- No offline-first sync or conflict resolution
- No multi-user or collaborative features

---

## 4. Users

**School Administrators** — staff responsible for managing school and class records. Single user type, no permissions model.

---

## 5. Functional Requirements

### 5.1 Schools (Escolas)

| ID | Requirement |
|---|---|
| F-S01 | User can view a list of all registered schools |
| F-S02 | User can filter the school list by name (text search) and address (text search) |
| F-S03 | User can create a new school via a bottom sheet form |
| F-S04 | User can edit an existing school via a bottom sheet form |
| F-S05 | User can delete a school after confirming via an alert dialog |
| F-S06 | Tapping a school card navigates to the School Detail screen |

**School fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | — | Generated automatically |
| `name` | string | Yes | School name |
| `address` | string | Yes | Full address |
| `classCount` | number | — | Derived: count of turmas with this `schoolId` |

### 5.2 Classes (Turmas)

| ID | Requirement |
|---|---|
| F-C01 | User can view all turmas belonging to a school on the School Detail screen |
| F-C02 | User can filter the turma list by name (text search), shift (pill selector), and academic year |
| F-C03 | User can create a new turma via a bottom sheet form |
| F-C04 | User can edit an existing turma via a bottom sheet form |
| F-C05 | User can delete a turma after confirming via an alert dialog |

**Turma fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | — | Generated automatically |
| `name` | string | Yes | Turma name (e.g. "1º A") |
| `shift` | `morning` \| `afternoon` \| `evening` | Yes | Shift — displayed in pt-BR in UI |
| `academicYear` | number | Yes | Academic year (e.g. 2026) |
| `schoolId` | string | — | Foreign key — set automatically on creation |

### 5.3 Domain Relationship

A school has many turmas (1:N). A turma belongs to exactly one school. Turmas are always created in the context of a school — the `schoolId` is set implicitly, never entered by the user.

---

## 6. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NF-01 | App must run on Expo Go via QR code with no build step required |
| NF-02 | All API calls must be intercepted by MSW — no real network requests |
| NF-03 | State must persist across app restarts via AsyncStorage |
| NF-04 | Codebase must pass Biome lint checks with no errors |
| NF-05 | TypeScript strict mode must be enabled |
| NF-06 | App must function on both iOS and Android via Expo Go |

---

## 7. Navigation Structure

The app uses a **single tab** — Schools. Classes are accessed through the School Detail screen.

```
Schools List
└── [tap card] → School Detail
                  └── Class list for that school
```

### Screens

| Screen | Route | Purpose |
|---|---|---|
| Lista de Escolas | `/(tabs)/schools` | Lists all schools with filter button |
| Detalhe da Escola | `/(tabs)/schools/[id]` | School info + class list with filter button |

### Interaction Patterns

| Pattern | Used for |
|---|---|
| Bottom Sheet | Filters (schools and classes) and all forms (create and edit) |
| Alert Dialog | Delete confirmation for schools and classes |
| FAB (+) | Create a new school (school list) or class (school detail) |

---

## 8. Out of Scope (v1)

- Pagination
- Image uploads
- Export or reporting features
- Accessibility audit
- Internationalisation (i18n framework) — UI is pt-BR only, no i18n abstraction needed

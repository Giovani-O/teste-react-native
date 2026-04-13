# School Screens Tests Design

**Date:** 2026-04-13  
**Status:** Approved

---

## Overview

Add unit tests for `SchoolListScreen` and `SchoolDetailScreen` components using jest-expo and React Native Testing Library.

---

## Scope

Tests scoped to screen components only (v1 per SDD section 11).

### Files Under Test

- `src/screens/schools/SchoolListScreen.tsx`
- `src/screens/schools/SchoolDetailScreen.tsx`

### Not in Scope

- Store logic (`schools.store.ts`, `turmas.store.ts`)
- API/mock layer (MirageJS)
- Filter hooks (`useSchoolFilter`, `useTurmaFilter`)

---

## Test Cases

### SchoolListScreen (3 tests)

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | `renders school list` | Given schools exist, when rendered, then displays filtered list |
| 2 | `shows empty state` | Given no schools, when rendered, then shows empty state message |
| 3 | `opens create form` | Given user taps FAB, then create form bottom sheet opens |

### SchoolDetailScreen (5 tests)

| # | Test Name | Description |
|---|-----------|-------------|
| 1 | `renders school details` | Given school exists, when rendered, then shows school info |
| 2 | `opens edit form` | Given user taps edit, then form opens with pre-populated values |
| 3 | `opens delete dialog` | Given user taps delete, then confirmation dialog appears |
| 4 | `renders turmas list` | Given turmas exist, when rendered, then shows turma list |
| 5 | `opens delete turma dialog` | Given user taps delete on turma, then confirmation dialog appears |

---

## Test Patterns

### Mocking Stores

Use Zustand's `useStore` with override to inject test data:

```ts
useSchoolsStore.setState({
  schools: [mockSchool],
  isLoading: false,
  error: null,
})
```

### Testing Interactions

1. Query elements by text or testID
2. Fire press events
3. Assert expected state changes

---

## File Structure

```
src/screens/schools/
├── __tests__/
│   ├── SchoolListScreen.test.tsx
│   └── SchoolDetailScreen.test.tsx
```

---

## Dependencies

- `jest-expo` (already installed)
- `@testing-library/react-native` (already installed)

---

## Acceptance Criteria

- [ ] All 8 tests pass
- [ ] Tests run via `npx jest`
- [ ] No existing tests broken
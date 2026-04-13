# School Screens Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 unit tests for SchoolListScreen and SchoolDetailScreen using jest-expo and React Native Testing Library.

**Architecture:** Tests mock Zustand stores with initial state, render components with Testing Library, and simulate user interactions. Components rely on store state and local UI state—tests will mock both.

**Tech Stack:** jest-expo, @testing-library/react-native

---

## File Structure

```
src/screens/schools/
├── __tests__/
│   ├── SchoolListScreen.test.tsx
│   └── SchoolDetailScreen.test.tsx
```

---

## Task 1: SchoolListScreen Tests

**Files:**
- Create: `src/screens/schools/__tests__/SchoolListScreen.test.tsx`

- [ ] **Step 1: Create test file with mocks**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native'
import { useSchoolsStore } from '../../store/schools.store'
import { SchoolListScreen } from '../SchoolListScreen'

const mockSchool = {
  id: '1',
  name: 'Escola Teste',
  address: 'Rua Teste 123',
  classCount: 2,
}

const mockNavigate = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockNavigate }),
  useLocalSearchParams: () => ({}),
}))

describe('SchoolListScreen', () => {
  beforeEach(() => {
    useSchoolsStore.setState({
      schools: [],
      isLoading: false,
      error: null,
    })
    mockNavigate.mockClear()
  })
```

- [ ] **Step 2: Add test - renders school list**

```tsx
  it('renders school list when schools exist', () => {
    useSchoolsStore.setState({
      schools: [mockSchool],
    })

    render(<SchoolListScreen />)

    expect(screen.getByText('Escola Teste')).toBeTruthy()
    expect(screen.getByText('Rua Teste 123')).toBeTruthy()
  })
```

- [ ] **Step 3: Add test - shows empty state**

```tsx
  it('shows empty state when no schools exist', () => {
    render(<SchoolListScreen />)

    expect(screen.getByText('Nenhuma escola encontrada')).toBeTruthy()
    expect(screen.getByText('Toque no botão + para adicionar uma escola')).toBeTruthy()
  })
```

- [ ] **Step 4: Add test - opens create form**

```tsx
  it('opens create form when FAB is pressed', async () => {
    render(<SchoolListScreen />)

    const fab = screen.getByText('Adicionar escola')
    fireEvent.press(fab)

    expect(screen.getByText('Nome da escola')).toBeTruthy()
  })
```

- [ ] **Step 5: Run SchoolListScreen tests**

Run: `npx jest src/screens/schools/__tests__/SchoolListScreen.test.tsx -v`
Expected: All 3 tests pass

---

## Task 2: SchoolDetailScreen Tests

**Files:**
- Create: `src/screens/schools/__tests__/SchoolDetailScreen.test.tsx`

- [ ] **Step 1: Create test file with mocks**

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native'
import { useSchoolsStore } from '../../store/schools.store'
import { useTurmasStore } from '../../store/turmas.store'
import { SchoolDetailScreen } from '../SchoolDetailScreen'
import { Router } from 'expo-router'

const mockSchool = {
  id: '1',
  name: 'Escola Teste',
  address: 'Rua Teste 123',
  classCount: 2,
}

const mockTurma = {
  id: '1',
  name: '3º Ano A',
  shift: 'morning' as const,
  academicYear: 2024,
  schoolId: '1',
}

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ id: '1' }),
}))

describe('SchoolDetailScreen', () => {
  beforeEach(() => {
    useSchoolsStore.setState({
      schools: [mockSchool],
      isLoading: false,
      error: null,
    })
    useTurmasStore.setState({
      turmas: [mockTurma],
      isLoading: false,
      error: null,
    })
  })
```

- [ ] **Step 2: Add test - renders school details**

```tsx
  it('renders school details', () => {
    render(<SchoolDetailScreen />)

    expect(screen.getByText('Escola Teste')).toBeTruthy()
    expect(screen.getByText('Rua Teste 123')).toBeTruthy()
  })
```

- [ ] **Step 3: Add test - opens edit form**

```tsx
  it('opens edit form when edit button is pressed', () => {
    render(<SchoolDetailScreen />)

    const editButton = screen.getByText('Editar')
    fireEvent.press(editButton)

    expect(screen.getByText('Nome da escola')).toBeTruthy()
  })
```

- [ ] **Step 4: Add test - opens delete dialog**

```tsx
  it('opens delete dialog when delete button is pressed', () => {
    render(<SchoolDetailScreen />)

    const deleteButton = screen.getByText('Excluir')
    fireEvent.press(deleteButton)

    expect(screen.getByText('Tem certeza que deseja excluir')).toBeTruthy()
  })
```

- [ ] **Step 5: Add test - renders turmas list**

```tsx
  it('renders turmas list when turmas exist', () => {
    render(<SchoolDetailScreen />)

    expect(screen.getByText('3º Ano A')).toBeTruthy()
  })
```

- [ ] **Step 6: Add test - opens delete turma dialog**

```tsx
  it('opens delete turma dialog when delete is pressed', () => {
    render(<SchoolDetailScreen />)

    const deleteButtons = screen.getAllByText('Excluir')
    fireEvent.press(deleteButtons[1])

    expect(screen.getByText('Tem certeza que deseja excluir')).toBeTruthy()
  })
```

- [ ] **Step 7: Run SchoolDetailScreen tests**

Run: `npx jest src/screens/schools/__tests__/SchoolDetailScreen.test.tsx -v`
Expected: All 5 tests pass

---

## Task 3: Final Verification

- [ ] **Step 1: Run all tests**

Run: `npx jest --testPathPattern=src/screens/schools/__tests__ -v`
Expected: All 8 tests pass

- [ ] **Step 2: Verify no lint errors**

Run: `npx biome check src/screens/schools/__tests__/`
Expected: No errors
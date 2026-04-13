# School List Filters Design

## Overview
Add filtering capability to the SchoolListScreen to allow users to search schools by name and address using substring search.

## UI Components

### Filter FAB
- **Position**: Bottom-left, 16px from left and bottom edges
- **Add FAB**: Remains bottom-right (current position)
- **Icon**: Magnifying glass (search icon)
- **Background**: Grey (#6B7280) - distinct from add FAB which is blue (#0066CC)
- **Badge**: Red circle (10px) with white text showing number of active filters (max "3+" if >3). Positioned top-right of FAB with -4px offset.

### Filter Bottom Sheet
- Reuses existing BottomSheet component pattern
- Title: "Filtrar Escolas"
- Two text inputs:
  - Nome (placeholder: "Buscar por nome...")
  - Endereço (placeholder: "Buscar por endereço...")
- Each input has a clear button (X icon) on the right when not empty
- "Limpar Filtros" button at bottom to clear all filters
- Filters apply immediately on input (no explicit Apply action)

## Functionality

### Filter Logic
- Substring search, case-insensitive
- Name filter: matches if school's name contains filter string
- Address filter: matches if school's address contains filter string
- Both filters apply together (AND logic)
- Empty filter = no filter applied for that field

### State Management
- Store filter state in SchoolListScreen local state
- `filters: { name: string, address: string }`
- Computed `filteredSchools` derived from `schools` + `filters`
- `hasActiveFilters` computed: true if name OR address is non-empty

### Badge Logic
- Badge shows count of active filters (1 or 2)
- Shows red badge when filters applied
- Hidden when no filters

## File Changes

### New Files
- `src/components/FilterBottomSheet.tsx` - Bottom sheet with filter inputs

### Modified Files
- `src/components/FAB.tsx` - Add optional `icon` and `badge` props
- `src/screens/schools/SchoolListScreen.tsx` - Add filter state and FilterFAB

## Acceptance Criteria
1. FAB with search icon appears bottom-left with grey background
2. Tapping FAB opens bottom sheet with name/address inputs
3. Typing in filters immediately updates the school list (substring, case-insensitive)
4. Badge appears on FAB when filters are active, showing filter count
5. Clear buttons in each input reset that filter
6. "Limpar Filtros" button clears both filters
7. Closing bottom sheet preserves filters (they stay applied)
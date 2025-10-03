# Vue Composables

This directory contains reusable Vue 3 composables using the Composition API for shared state management and external API integration.

## Available Composables

### `useSelectedPart.ts` - Part Selection State Management

Global state management for the selected part across the application.

#### Interface
```typescript
interface PartData {
  id: string
  name: string
  description: string
  iconSrc: string
  tags?: string[]
}
```

#### Usage
```vue
<script setup>
import { useSelectedPart } from '@/composables/useSelectedPart'

const { setSelectedPart, getSelectedPart, clearSelectedPart, selectedPart } = useSelectedPart()

// Set a part as selected
const selectPart = (part: PartData) => {
  setSelectedPart(part)
}

// Get currently selected part
const currentPart = getSelectedPart()

// Clear selection
const clearSelection = () => {
  clearSelectedPart()
}

// Reactive reference to selected part
watch(selectedPart, (newPart) => {
  console.log('Part changed:', newPart)
})
</script>
```

#### Methods
- `setSelectedPart(part: PartData)` - Set the selected part
- `getSelectedPart()` - Get the current selected part (or null)
- `clearSelectedPart()` - Clear the current selection
- `selectedPart` - Reactive ref to the selected part

#### State Persistence
The selected part state persists across component unmounts but resets on page refresh. For persistent storage, consider integrating with localStorage or sessionStorage.

---

### `useGooeyAPI.ts` - Gooey AI Integration

Composable for making API calls to Gooey AI's CompareLLM service for generating AI responses.

#### Interface
```typescript
interface GooeyAPIResponse {
  id: string;
  url: string;
  created_at: string;
  output: {
    output_text: {
      gpt_5_mini: Array<{
        prompts: string[];
      }>;
    };
  };
}
```

#### Setup Requirements
Add your Gooey API key to your environment variables:
```env
VITE_GOOEY_API_KEY=your_api_key_here
```

#### Usage
```vue
<script setup>
import { useGooeyAPI } from '@/composables/useGooeyAPI'

const { callGooeyAPI, loading, error } = useGooeyAPI()

const generateIdeas = async () => {
  try {
    const prompt = "Generate creative ideas for wind turbine parts"
    const response = await callGooeyAPI(prompt)
    console.log('AI Response:', response.output.output_text.gpt_5_mini)
  } catch (err) {
    console.error('API Error:', error.value)
  }
}
</script>

<template>
  <div>
    <button @click="generateIdeas" :disabled="loading">
      {{ loading ? 'Generating...' : 'Generate Ideas' }}
    </button>
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>
  </div>
</template>
```

#### Methods
- `callGooeyAPI(inputPrompt: string)` - Make API call with given prompt
- `loading` - Reactive boolean for loading state
- `error` - Reactive string for error messages

#### API Configuration
- **Endpoint**: Gooey AI CompareLLM service
- **Model**: GPT-5 Mini
- **Response Format**: JSON object
- **Authentication**: Bearer token via environment variable

---

## Composable Patterns

### State Management
```typescript
// Global reactive state
const globalState = ref<StateType | null>(null)

export const useGlobalState = () => {
  const setState = (newState: StateType) => {
    globalState.value = newState
  }

  const getState = () => globalState.value

  return { setState, getState, state: globalState }
}
```

### API Integration
```typescript
export const useAPI = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiCall = async (params: any) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(/* api call */)
      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { apiCall, loading, error }
}
```

## Best Practices

### 1. Single Responsibility
Each composable should have a single, clear purpose:
- ✅ `useSelectedPart` - manages part selection
- ✅ `useGooeyAPI` - handles API communication
- ❌ `useEverything` - handles multiple unrelated concerns

### 2. Reactive State
Use Vue's reactivity system appropriately:
```typescript
// ✅ Reactive state
const state = ref(initialValue)

// ✅ Computed derived state
const derivedState = computed(() => transform(state.value))

// ❌ Plain JavaScript objects (not reactive)
let state = { value: 'not reactive' }
```

### 3. Error Handling
Always provide error handling for external operations:
```typescript
const error = ref<string | null>(null)

try {
  // risky operation
} catch (err) {
  error.value = err instanceof Error ? err.message : 'Unknown error'
}
```

### 4. TypeScript Integration
Use proper TypeScript interfaces for type safety:
```typescript
interface MyState {
  id: string
  value: number
}

const useState = (): UseStateReturn => {
  // implementation
}
```

### 5. Cleanup
Handle cleanup when necessary:
```typescript
export const useCleanupExample = () => {
  const cleanup = () => {
    // cleanup resources
  }

  onUnmounted(cleanup)

  return { cleanup }
}
```

## Testing Composables

### Unit Testing
```typescript
import { useSelectedPart } from '@/composables/useSelectedPart'

describe('useSelectedPart', () => {
  it('should set and get selected part', () => {
    const { setSelectedPart, getSelectedPart } = useSelectedPart()

    const mockPart = { id: '1', name: 'Test Part' }
    setSelectedPart(mockPart)

    expect(getSelectedPart()).toEqual(mockPart)
  })
})
```

### Integration Testing
Test composables within component context using Vue Test Utils.

## Adding New Composables

1. **Create the file**: `useFeatureName.ts`
2. **Define interfaces**: TypeScript interfaces for data structures
3. **Implement logic**: Core functionality with proper error handling
4. **Export composable**: Function that returns reactive state and methods
5. **Document usage**: Add examples to this README
6. **Write tests**: Unit tests for critical functionality

## Common Use Cases

- **Global State**: User authentication, theme settings, selected items
- **API Calls**: External service integration, data fetching
- **Local Storage**: Persistent user preferences, cache management
- **Form Handling**: Validation, submission, field state
- **Browser APIs**: Geolocation, notifications, file handling
- **Business Logic**: Complex calculations, data transformations
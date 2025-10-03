import { ref } from 'vue'

export interface PartData {
  id: string
  name: string
  description: string
  iconSrc: string
  tags?: string[]
}

export type Difficulty = 'easy' | 'medium' | 'difficult'

// Global state for selected parts and difficulty
const selectedParts = ref<PartData[]>([])
const difficulty = ref<Difficulty>('medium')

export const useSelectedPart = () => {
  const setSelectedPart = (part: PartData) => {
    selectedParts.value = [part]
  }

  const setSelectedParts = (parts: PartData[]) => {
    selectedParts.value = parts
  }

  const addSelectedPart = (part: PartData) => {
    const maxParts = difficulty.value === 'easy' ? 1 : difficulty.value === 'medium' ? 2 : 3

    const index = selectedParts.value.findIndex(p => p.id === part.id)
    if (index > -1) {
      // Remove if already selected
      selectedParts.value.splice(index, 1)
    } else if (selectedParts.value.length < maxParts) {
      // Add if under limit
      selectedParts.value.push(part)
    } else {
      // Replace the first (oldest) part when at max limit
      selectedParts.value.shift()
      selectedParts.value.push(part)
    }
  }

  const getSelectedPart = () => {
    return selectedParts.value[0] || null
  }

  const getSelectedParts = () => {
    return selectedParts.value
  }

  const setDifficulty = (level: Difficulty) => {
    difficulty.value = level
    // Trim parts if new difficulty requires fewer
    const maxParts = level === 'easy' ? 1 : level === 'medium' ? 2 : 3
    if (selectedParts.value.length > maxParts) {
      selectedParts.value = selectedParts.value.slice(0, maxParts)
    }
  }

  const getDifficulty = () => {
    return difficulty.value
  }

  const clearSelectedPart = () => {
    selectedParts.value = []
  }

  return {
    selectedPart: selectedParts,
    setSelectedPart,
    setSelectedParts,
    addSelectedPart,
    getSelectedPart,
    getSelectedParts,
    setDifficulty,
    getDifficulty,
    clearSelectedPart
  }
}
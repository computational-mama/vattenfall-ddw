import { ref } from 'vue'

const FIREBASE_URL = 'https://carbon-vattenfall-default-rtdb.firebaseio.com'

export interface FirebaseConversation {
  conversation: Array<{
    role: string
    content: string
  }>
  image_url: string
  key_phrases: string[]
  summary: string
  timestamp?: number
  firebaseKey?: string
}

export function useFirebaseData() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isValidConversation = (conv: any): boolean => {
    return !!(
      conv &&
      conv.image_url &&
      conv.key_phrases &&
      Array.isArray(conv.key_phrases) &&
      conv.key_phrases.length > 0 &&
      conv.summary &&
      conv.conversation &&
      Array.isArray(conv.conversation) &&
      conv.conversation.length > 0
    )
  }

  // Helper function to decode Firebase push key to timestamp
  const decodeFirebaseKey = (key: string): number => {
    // Firebase push keys are base64-encoded timestamps
    // First 8 characters represent the timestamp
    const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

    let timestamp = 0
    const id = key.substring(0, 8)

    for (let i = 0; i < id.length; i++) {
      const char = id.charAt(i)
      timestamp = timestamp * 64 + PUSH_CHARS.indexOf(char)
    }

    return timestamp
  }

  const fetchAllConversations = async (): Promise<FirebaseConversation[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${FIREBASE_URL}/data.json`)
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      // Check if response has content before parsing
      const text = await response.text()
      if (!text || text.trim() === '') {
        console.warn('Firebase returned empty response')
        return []
      }

      const data = JSON.parse(text)

      // Convert Firebase object to array with timestamps, filtering out incomplete entries
      const conversations: FirebaseConversation[] = []

      if (data) {
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          if (isValidConversation(value)) {
            // Use stored timestamp, or decode from Firebase key, or fall back to current time
            const timestamp = value.timestamp || decodeFirebaseKey(key) || Date.now()

            conversations.push({
              ...value,
              timestamp,
              firebaseKey: key
            })
          }
        })
      }

      // Sort by timestamp (newest first)
      conversations.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

      return conversations
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error('JSON parsing error:', err)
        error.value = 'Invalid response from server'
      } else {
        error.value = err instanceof Error ? err.message : 'Unknown error'
      }
      console.error('Error fetching conversations:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getLatestConversation = async (): Promise<FirebaseConversation | null> => {
    const conversations = await fetchAllConversations()
    return conversations.length > 0 ? conversations[0] : null
  }

  const getPreviousConversations = async (limit: number = 6): Promise<FirebaseConversation[]> => {
    const conversations = await fetchAllConversations()
    // Skip the first one (latest) and return the rest
    return conversations.slice(1, limit + 1)
  }

  return {
    loading,
    error,
    fetchAllConversations,
    getLatestConversation,
    getPreviousConversations
  }
}

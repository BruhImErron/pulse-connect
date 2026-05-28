/**
 * AI Provider Configuration
 * 
 * Purpose: Centralized configuration for all AI model providers
 * How it works: Defines endpoints, models, timeouts, and API keys for:
 *   - Ollama (local execution)
 *   - Groq (cloud inference - fast)
 *   - Together.ai (cloud inference - alternative)
 * 
 * Strategy determines fallback order:
 *   - "local": Use Ollama only
 *   - "external": Use cloud APIs only
 *   - "fallback": Try Ollama first, then cloud providers
 */

export const AI_CONFIG = {
  /**
   * Ollama Configuration (Local AI)
   * Purpose: Local LLM execution - no cloud dependency, full privacy
   * How it works: Connects to local Ollama service on port 11434
   * 
   * Model priority order (tries each until one succeeds):
   *   1. llama3.2 - Latest, best performance
   *   2. llama2 - Fallback if 3.2 unavailable
   *   3. neural-chat - Optimized for chat
   *   4. mistral - Lightweight alternative
   */
  ollama: {
    url: process.env.OLLAMA_URL || "http://localhost:11434",
    models: [
      "qwen3-coder:latest",
      "mistral:latest",
      "neural-chat:latest",
      "llama3.2:latest",
      "llama2:latest",
    ],
    timeout: 9000, // 9 second timeout for faster local inference
  },

  /**
   * Groq API Configuration (Cloud AI - Primary)
   * Purpose: Fast cloud inference when local Ollama unavailable
   * How it works: Calls Groq's OpenAI-compatible API
   * 
   * Enabled only if GROQ_API_KEY environment variable is set
   * Provides very fast inference (100-500ms typical)
   */
  groq: {
    enabled: !!process.env.GROQ_API_KEY,
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
    models: [
      "mixtral-8x7b-32768",    // Powerful mixture-of-experts model
      "llama3-8b-8192",        // Smaller, faster variant
      "llama2-70b-4096",       // Larger fallback
      "llama3-70b-8192",       // Larger fallback
    ],
    timeout: 20000, // 20 second timeout for API calls
  },

  /**
   * Together.ai Configuration (Cloud AI - Secondary)
   * Purpose: Alternative cloud inference provider
   * How it works: Calls Together.ai's API for model inference
   * 
   * Enabled only if TOGETHER_API_KEY environment variable is set
   * Used as fallback if Groq is also unavailable
   */
  together: {
    enabled: !!process.env.TOGETHER_API_KEY,
    apiKey: process.env.TOGETHER_API_KEY,
    baseUrl: "https://api.together.xyz/v1",
    models: [
      "meta-llama/Llama-3-70b-chat-hf",
      "meta-llama/Llama-2-70b-chat-hf",
      "mistralai/Mistral-7B-Instruct-v0.1",
    ],
    timeout: 30000, // 30 second timeout for API calls
  },

  /**
   * Default AI Strategy
   * Purpose: Determine which provider to use by default
   * 
   * Fallback order when strategy is set to "fallback":
   *   1. Try Ollama (local) - fastest, no API costs, full privacy
   *   2. Try Groq (cloud) - very fast, works if local unavailable
   *   3. Try Together.ai (cloud) - alternative if Groq fails
   *   4. Return error if all fail
   */
  strategy: process.env.AI_MODEL_STRATEGY || "fallback",
};

/**
 * AI Provider Type
 * Purpose: TypeScript type definition for type-safe provider selection
 * How it works: Restricts provider value to valid options only
 */
export type AIProvider = "ollama" | "groq" | "together";

/**
 * AI Provider Implementation Module
 * 
 * Purpose: Multi-provider AI text generation with automatic fallback
 * How it works: Tries providers in priority order, falls back to next if one fails
 * 
 * Supported providers:
 *   1. Ollama - Local LLM (primary for development)
 *   2. Groq - Fast cloud inference
 *   3. Together.ai - Alternative cloud provider
 */

import { AI_CONFIG, type AIProvider } from "./aiConfig";

/**
 * Fetch with Timeout Utility
 * Purpose: Make HTTP requests with automatic timeout
 * How it works:
 *   1. Create AbortController to cancel request if timeout exceeded
 *   2. Set timer to abort after timeoutMs milliseconds
 *   3. Execute fetch with abort signal
 *   4. Clear timer in finally block (always runs)
 * 
 * @param url - API endpoint URL
 * @param options - Fetch options (headers, method, body)
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise<Response> - HTTP response or throw timeout error
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    // Cleanup: Clear timeout regardless of success/failure
    clearTimeout(timeout);
  }
}

/**
 * Ollama Text Generation Provider
 * Purpose: Generate text using locally running Ollama service
 * How it works:
 *   1. Connect to local Ollama service (default: localhost:11434)
 *   2. Send prompt to LLM model
 *   3. Wait for response (stream: false = single response)
 *   4. Extract and return generated text
 * 
 * @param prompt - User message/question for the model
 * @param model - Model name (optional, uses default if not specified)
 * @returns Promise<string> - Generated text response
 * @throws Error if Ollama service unavailable or returns error
 */
async function generateWithOllama(prompt: string, model?: string): Promise<string> {
  // Select model: use provided model or fallback to first in config list
  const modelName = model || AI_CONFIG.ollama.models[0];

  // Call Ollama API
  const response = await fetchWithTimeout(
    `${AI_CONFIG.ollama.url}/api/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt,
        stream: false,        // Get complete response at once, not streamed
        options: {
          temperature: 0.7,   // Creativity (0=deterministic, 1=random)
          top_p: 0.9,         // Diversity control (nucleus sampling)
        },
      }),
    },
    AI_CONFIG.ollama.timeout
  );

  // Error handling: Check if request succeeded
  if (!response.ok) {
    throw new Error(`Ollama error: HTTP ${response.status}`);
  }

  // Parse response and extract generated text
  const data = (await response.json()) as { response?: string };
  return data.response?.trim() ?? ""; // Trim whitespace, return empty string if null
}

/**
 * Groq Cloud Text Generation Provider
 * Purpose: Generate text using Groq's fast cloud inference API
 * How it works:
 *   1. Verify Groq API key is configured
 *   2. Call Groq's OpenAI-compatible API
 *   3. Send prompt as chat message
 *   4. Extract assistant's response
 * 
 * Benefits: Very fast inference (100-500ms), ideal cloud fallback
 * 
 * @param prompt - User message for the model
 * @param model - Model name (optional)
 * @returns Promise<string> - Generated text response
 * @throws Error if Groq not configured or API call fails
 */
async function generateWithGroq(prompt: string, model?: string): Promise<string> {
  // Validation: Ensure API key is configured
  if (!AI_CONFIG.groq.enabled || !AI_CONFIG.groq.apiKey) {
    throw new Error("Groq API key not configured in environment variables");
  }

  // Select model: use provided or default
  const modelName = model || AI_CONFIG.groq.models[0];

  // Call Groq API
  const response = await fetchWithTimeout(
    `${AI_CONFIG.groq.baseUrl}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_CONFIG.groq.apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,      // Limit response length
      }),
    },
    AI_CONFIG.groq.timeout
  );

  // Error handling: Parse error if request failed
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: HTTP ${response.status} - ${error}`);
  }

  // Parse response and extract assistant message
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/**
 * Together.ai Cloud Text Generation Provider
 * Purpose: Generate text using Together.ai's API (alternative provider)
 * How it works:
 *   1. Verify Together.ai API key configured
 *   2. Call Together.ai API (OpenAI-compatible)
 *   3. Send prompt as chat message
 *   4. Extract and return response
 * 
 * Benefits: Alternative cloud provider, good backup if Groq unavailable
 * 
 * @param prompt - User message for the model
 * @param model - Model name (optional)
 * @returns Promise<string> - Generated text response
 * @throws Error if Together.ai not configured or API fails
 */
async function generateWithTogether(prompt: string, model?: string): Promise<string> {
  // Validation: Ensure API key is configured
  if (!AI_CONFIG.together.enabled || !AI_CONFIG.together.apiKey) {
    throw new Error("Together.ai API key not configured in environment variables");
  }

  // Select model: use provided or default
  const modelName = model || AI_CONFIG.together.models[0];

  // Call Together.ai API
  const response = await fetchWithTimeout(
    `${AI_CONFIG.together.baseUrl}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_CONFIG.together.apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    },
    AI_CONFIG.together.timeout
  );

  // Error handling: Parse error response
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together.ai API error: HTTP ${response.status} - ${error}`);
  }

  // Parse response and extract message
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/**
 * Main AI Response Generation Function (Multi-Provider Fallback)
 * Purpose: Generate AI response with automatic fallback between providers
 * How it works:
 *   1. Parse strategy setting (local/external/fallback)
 *   2. Try providers in priority order based on strategy
 *   3. Return first successful response with provider name
 *   4. If all fail, throw error with last error message
 * 
 * Strategy flows:
 *   - "local": Try Ollama only
 *   - "external": Try Groq → Together.ai only
 *   - "fallback": Ollama → Groq → Together.ai
 * 
 * @param prompt - Text to generate completions for
 * @param strategy - Provider strategy (local/external/fallback)
 * @returns Promise with generated content and provider used
 * @throws Error if all providers fail
 */
export async function generateAIResponse(
  prompt: string,
  strategy: string = AI_CONFIG.strategy
): Promise<{ content: string; provider: AIProvider }> {
  let lastError: Error | null = null;

  // STEP 1: Try Local Ollama (if strategy allows)
  // ============================================
  if (strategy === "local" || strategy === "fallback") {
    try {
      const content = await generateWithOllama(prompt);
      if (content) {
        // Success! Return immediately with provider name
        return { content, provider: "ollama" };
      }
    } catch (error) {
      // Log but continue to next provider
      console.warn("[AI] Ollama failed, trying next provider...", error);
      lastError = error as Error;
    }
  }

  // STEP 2: Try Cloud Providers (if strategy allows)
  // ================================================
  if (strategy === "external" || strategy === "fallback") {
    
    // Try Groq first (fastest cloud provider)
    if (AI_CONFIG.groq.enabled) {
      try {
        const content = await generateWithGroq(prompt);
        if (content) {
          return { content, provider: "groq" };
        }
      } catch (error) {
        console.warn("[AI] Groq failed, trying next provider...", error);
        lastError = error as Error;
      }
    }

    // Try Together.ai (backup cloud provider)
    if (AI_CONFIG.together.enabled) {
      try {
        const content = await generateWithTogether(prompt);
        if (content) {
          return { content, provider: "together" };
        }
      } catch (error) {
        console.warn("[AI] Together.ai failed, all providers exhausted", error);
        lastError = error as Error;
      }
    }
  }

  // STEP 3: All providers failed - throw error
  // ==========================================
  throw new Error(
    `All AI providers failed. Last error: ${lastError?.message || "Unknown error"}`
  );
}

/**
 * Get Available AI Providers
 * Purpose: Check which AI providers are currently available
 * How it works:
 *   1. Always include Ollama (local, always "available")
 *   2. Check Groq API key configured
 *   3. Check Together.ai API key configured
 *   4. Return list of available providers
 * 
 * @returns Array<AIProvider> - List of configured providers
 */
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = [];

  // Ollama is always considered available (local service)
  available.push("ollama");

  // Add cloud providers if API keys are configured
  if (AI_CONFIG.groq.enabled) {
    available.push("groq");
  }
  if (AI_CONFIG.together.enabled) {
    available.push("together");
  }

  return available;
}

/**
 * LLM Provider — Cleudocode Hub
 *
 * Camada de abstração multi-LLM. Suporta:
 * - Groq (rápido, gratuito)
 * - Google Gemini
 * - OpenAI / ZAI (Anthropic bridge)
 * - Ollama (local)
 * - Qwen AI
 *
 * Usa variáveis do .env do projeto principal (cleudocode)
 * com fallback para .env local.
 *
 * AIDEV-NOTE: ADR-002 — LLM-Agnostic via provedor abstrato
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Carregamento do .env ─────────────────────────────────────────────────────
function loadEnv() {
  const locations = [
    path.join(process.cwd(), '.env'),
    path.join('/root/cleudocode', '.env'), // env do projeto principal
    path.join(__dirname, '../../.env'),
  ]

  for (const envPath of locations) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const [key, ...rest] = trimmed.split('=')
        if (key && rest.length > 0 && !process.env[key]) {
          process.env[key] = rest.join('=').replace(/^["']|["']$/g, '')
        }
      }
      return envPath
    }
  }
  return null
}

loadEnv()

// ─── Provedores disponíveis ───────────────────────────────────────────────────
const PROVIDERS = {
  groq: {
    name: 'Groq',
    available: () => !!process.env.GROQ_API_KEY,
    priority: 1,
  },
  gemini: {
    name: 'Google Gemini',
    available: () => !!process.env.GOOGLE_API_KEY || !!process.env.GEMINI_API_KEY,
    priority: 2,
  },
  openai: {
    name: 'OpenAI',
    available: () => !!process.env.OPENAI_API_KEY,
    priority: 3,
  },
  zai: {
    name: 'ZAI (Anthropic Bridge)',
    available: () => !!process.env.ZAI_API_KEY || !!process.env.ZAI_URL,
    priority: 4,
  },
  ollama: {
    name: 'Ollama (Local)',
    available: () => true, // sempre disponível como fallback
    priority: 5,
  },
}

// ─── Chamada ao Groq ──────────────────────────────────────────────────────────
async function callGroq(messages, options = {}) {
  const { default: Groq } = await import('groq-sdk').catch(() => {
    throw new Error('groq-sdk não instalado. Execute: npm install groq-sdk')
  })

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const model = options.model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
  })

  return response.choices[0]?.message?.content || ''
}

// ─── Chamada ao Gemini ────────────────────────────────────────────────────────
async function callGemini(messages, options = {}) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai').catch(() => {
    throw new Error('@google/generative-ai não instalado. Execute: npm install @google/generative-ai')
  })

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
  const genAI = new GoogleGenerativeAI(apiKey)
  const modelName = options.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const model = genAI.getGenerativeModel({ model: modelName })

  // Converter formato OpenAI para Gemini
  const systemMsg = messages.find(m => m.role === 'system')
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const lastMessage = chatMessages.pop()
  const chat = model.startChat({
    history: chatMessages,
    systemInstruction: systemMsg?.content,
  })

  const result = await chat.sendMessage(lastMessage.parts[0].text)
  return result.response.text()
}

// ─── Chamada ao OpenAI/ZAI ────────────────────────────────────────────────────
async function callOpenAI(messages, options = {}) {
  const { default: OpenAI } = await import('openai').catch(() => {
    throw new Error('openai não instalado. Execute: npm install openai')
  })

  const isZAI = options.provider === 'zai'
  const client = new OpenAI({
    apiKey: isZAI ? process.env.ZAI_API_KEY : process.env.OPENAI_API_KEY,
    baseURL: isZAI ? (process.env.ZAI_URL || 'https://api.zai.ai/v1') : undefined,
  })

  const model = options.model || (isZAI ? 'claude-3-5-sonnet-20241022' : 'gpt-4o-mini')

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
  })

  return response.choices[0]?.message?.content || ''
}

// ─── Chamada ao Ollama ────────────────────────────────────────────────────────
async function callOllama(messages, options = {}) {
  const host = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
  const model = options.model || process.env.OLLAMA_MODEL || 'qwen2.5-coder:1.5b'

  const response = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
        num_predict: options.maxTokens ?? 4096,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.message?.content || ''
}

// ─── LLM Provider principal ───────────────────────────────────────────────────

/**
 * Obtém o melhor provider disponível baseado nas variáveis de ambiente
 */
export function getBestProvider(options = {}) {
  const preferred = options.provider
    || process.env.DEFAULT_PROVIDER
    || process.env.LLM_FALLBACK_SEQUENCE?.split(',')[0]?.trim()

  if (preferred && PROVIDERS[preferred]?.available()) return preferred

  // Fallback automático por prioridade
  const sorted = Object.entries(PROVIDERS).sort((a, b) => a[1].priority - b[1].priority)
  for (const [key, provider] of sorted) {
    if (provider.available()) return key
  }

  return 'ollama' // sempre como último fallback
}

/**
 * Lista todos os providers disponíveis
 */
export function listProviders() {
  return Object.entries(PROVIDERS).map(([key, p]) => ({
    id: key,
    name: p.name,
    available: p.available(),
    priority: p.priority,
  }))
}

/**
 * Chama o LLM com fallback automático
 *
 * @param {Array} messages - Array de mensagens {role, content}
 * @param {Object} options - Opções de chamada
 * @param {string} [options.provider] - Provider preferido
 * @param {string} [options.model] - Modelo específico
 * @param {number} [options.temperature] - Temperatura (0-1)
 * @param {number} [options.maxTokens] - Máximo de tokens
 * @param {boolean} [options.verbose] - Log de debug
 * @returns {Promise<string>} Resposta do LLM
 */
export async function callLLM(messages, options = {}) {
  const fallbackSeq = (
    process.env.LLM_FALLBACK_SEQUENCE || 'groq,gemini,ollama'
  ).split(',').map(p => p.trim())

  const preferred = options.provider || getBestProvider(options)
  const sequence = [preferred, ...fallbackSeq.filter(p => p !== preferred)]

  let lastError = null

  for (const provider of sequence) {
    if (!PROVIDERS[provider]?.available() && provider !== 'ollama') continue

    if (options.verbose) {
      console.log(`[LLM] Tentando provider: ${provider}`)
    }

    try {
      switch (provider) {
        case 'groq':
          return await callGroq(messages, options)
        case 'gemini':
          return await callGemini(messages, options)
        case 'openai':
          return await callOpenAI(messages, { ...options, provider: 'openai' })
        case 'zai':
          return await callOpenAI(messages, { ...options, provider: 'zai' })
        case 'ollama':
          return await callOllama(messages, options)
        default:
          throw new Error(`Provider desconhecido: ${provider}`)
      }
    } catch (error) {
      lastError = error
      if (options.verbose) {
        console.warn(`[LLM] Falha no provider ${provider}: ${error.message}`)
      }
    }
  }

  throw new Error(`Todos os providers falharam. Último erro: ${lastError?.message}`)
}

/**
 * Chamada simplificada com system prompt e prompt do usuário
 */
export async function ask(systemPrompt, userPrompt, options = {}) {
  return callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ], options)
}

export default { callLLM, ask, getBestProvider, listProviders }

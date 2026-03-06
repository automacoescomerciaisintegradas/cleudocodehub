/**
 * Context Detector
 * 
 * Detecta contexto de execução
 */

import { execa } from 'execa'

export class ContextDetector {
  constructor() {
    this.context = null
  }

  /**
   * Detecta contexto atual
   */
  async detect() {
    if (this.context) {
      return this.context
    }
    
    const context = {
      ide: await this.detectIDE(),
      terminal: await this.detectTerminal(),
      os: process.platform,
      nodeVersion: process.version,
      cwd: process.cwd()
    }
    
    this.context = context
    return context
  }

  /**
   * Detecta IDE em uso
   */
  async detectIDE() {
    // Verificar variáveis de ambiente de IDEs
    if (process.env.VSCODE_GIT_ASKPASS_NODE) {
      return 'vscode'
    }
    
    if (process.env.JETBRAINS_CLIENT) {
      return 'jetbrains'
    }
    
    if (process.env.CURSOR_SOCKET_PATH) {
      return 'cursor'
    }
    
    return 'terminal'
  }

  /**
   * Detecta terminal
   */
  async detectTerminal() {
    const shell = process.env.SHELL || 'unknown'
    
    if (shell.includes('bash')) {
      return 'bash'
    }
    
    if (shell.includes('zsh')) {
      return 'zsh'
    }
    
    if (shell.includes('fish')) {
      return 'fish'
    }
    
    if (process.platform === 'win32') {
      return 'powershell'
    }
    
    return 'unknown'
  }

  /**
   * Verifica se está em ambiente CI/CD
   */
  async isCI() {
    return !!(
      process.env.CI ||
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.CIRCLECI
    )
  }

  /**
   * Verifica se Git está disponível
   */
  async hasGit() {
    try {
      await execa('git', ['--version'])
      return true
    } catch {
      return false
    }
  }

  /**
   * Reset contexto
   */
  reset() {
    this.context = null
  }
}

#!/usr/bin/env node

/**
 * Cleudocode Core CLI
 * 
 * Framework de orquestração de agentes AI para desenvolvimento
 * Instalação rápida, configuração automática e integração com múltiplos LLMs
 * 
 * @author Cleudocode Team
 * @version 1.0.0
 */

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import semver from 'semver'
import * as p from '@clack/prompts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = process.cwd()

// Versão atual
const pkg = JSON.parse(
  fs.readFileSync(join(__dirname, '../package.json'), 'utf-8')
)
const VERSION = pkg.version

// Programa principal
const program = new Command()

program
  .name('cleudocode-core')
  .description('Cleudocode Core - AI Orchestration Framework')
  .version(VERSION)

// =============================================================================
// COMANDO: init
// =============================================================================
program
  .command('init')
  .description('Inicializa Cleudocode Core no projeto atual')
  .option('-f, --force', 'Forçar inicialização mesmo se já existir')
  .option('-t, --template <tipo>', 'Template a usar (fullstack|frontend|backend|cli)', 'fullstack')
  .action(async (options) => {
    p.intro(chalk.bgGreen.black(' Cleudocode Core - Inicialização '))

    const configPath = join(PROJECT_ROOT, '.cleudocode-core')
    
    if (fs.existsSync(configPath) && !options.force) {
      p.log.warn('Arquivo .cleudocode-core já existe!')
      const shouldContinue = await p.confirm({
        message: 'Deseja sobrescrever?',
        initialValue: false
      })
      
      if (p.isCancel(shouldContinue) || !shouldContinue) {
        p.cancel('Operação cancelada.')
        return
      }
    }

    const spinner = ora('Criando configuração...').start()

    try {
      // Copiar template de configuração
      const templatePath = join(__dirname, '../templates/.cleudocode-core')
      let configContent
      
      if (fs.existsSync(templatePath)) {
        configContent = fs.readFileSync(templatePath, 'utf-8')
      } else {
        // Configuração padrão inline
        configContent = getDefaultConfig(options.template)
      }

      fs.writeFileSync(configPath, configContent)
      spinner.succeed('Configuração criada com sucesso!')

      // Criar estrutura de diretórios
      const dirs = [
        '.agents/agents',
        '.agents/rules',
        '.agents/tasks',
        '.agents/templates',
        '.agents/outputs',
        '.agents/logs',
        '.agents/storage'
      ]

      for (const dir of dirs) {
        const fullPath = join(PROJECT_ROOT, dir)
        if (!fs.existsSync(fullPath)) {
          fs.ensureDirSync(fullPath)
        }
      }

      p.log.success('Estrutura de diretórios criada!')

      // Criar AGENTS.md
      const agentsPath = join(PROJECT_ROOT, 'AGENTS.md')
      if (!fs.existsSync(agentsPath)) {
        fs.writeFileSync(agentsPath, getDefaultAgentsMd())
        p.log.success('AGENTS.md criado!')
      }

      // Criar .env.example
      const envExamplePath = join(PROJECT_ROOT, '.env.example')
      if (!fs.existsSync(envExamplePath)) {
        fs.writeFileSync(envExamplePath, getDefaultEnvExample())
        p.log.success('.env.example criado!')
      }

      p.outro(chalk.green('✨ Cleudocode Core inicializado com sucesso!'))
      
      console.log(`
${chalk.bold('Próximos passos:')}

1. Copie o arquivo de exemplo:
   ${chalk.cyan('cp .env.example .env')}

2. Edite .env e configure suas chaves de API

3. Inicie o Ollama (se usar modelos locais):
   ${chalk.cyan('ollama serve')}

4. Execute seu primeiro comando:
   ${chalk.cyan('npx cleudocode-core help')}

${chalk.dim('Documentação: https://github.com/cleudocode/cleudocode-core')}
`)

    } catch (error) {
      spinner.fail('Erro ao inicializar')
      p.log.error(error.message)
      process.exit(1)
    }
  })

// =============================================================================
// COMANDO: install
// =============================================================================
program
  .command('install')
  .description('Instala Cleudocode Core globalmente')
  .action(async () => {
    p.intro(chalk.bgGreen.black(' Cleudocode Core - Instalação '))

    const spinner = ora('Instalando cleudocode-core...').start()

    try {
      await execa('npm', ['install', '-g', 'cleudocode-core'], {
        stdio: 'pipe'
      })

      spinner.succeed('cleudocode-core instalado globalmente!')

      p.outro(chalk.green(`
✨ Instalação concluída!

Use em qualquer projeto:
  ${chalk.cyan('cleudocode-core init')}

Ou use sem instalar:
  ${chalk.cyan('npx cleudocode-core init')}
`))

    } catch (error) {
      spinner.fail('Erro na instalação')
      p.log.error(error.message)
      process.exit(1)
    }
  })

// =============================================================================
// COMANDO: config
// =============================================================================
program
  .command('config')
  .description('Mostra ou edita configuração')
  .argument('[chave]', 'Chave de configuração')
  .option('-e, --edit', 'Editar configuração')
  .option('-v, --value <valor>', 'Definir valor')
  .action(async (key, options) => {
    const configPath = join(PROJECT_ROOT, '.cleudocode-core')
    
    if (!fs.existsSync(configPath)) {
      p.log.error('Configuração não encontrada. Execute: cleudocode-core init')
      process.exit(1)
    }

    const config = yaml.load(fs.readFileSync(configPath, 'utf-8'))

    if (options.edit) {
      const editor = process.env.EDITOR || 'nano'
      await execa(editor, [configPath], { stdio: 'inherit' })
      p.log.success('Configuração atualizada!')
      return
    }

    if (key) {
      const keys = key.split('.')
      let value = config
      for (const k of keys) {
        value = value?.[k]
      }
      
      if (value !== undefined) {
        console.log(JSON.stringify(value, null, 2))
      } else {
        p.log.error(`Chave "${key}" não encontrada`)
      }
    } else {
      console.log(yaml.dump(config))
    }
  })

// =============================================================================
// COMANDO: agents
// =============================================================================
program
  .command('agents')
  .description('Lista ou gerencia agentes')
  .option('-l, --list', 'Listar agentes disponíveis')
  .option('-a, --add <nome>', 'Adicionar novo agente')
  .option('-r, --remove <nome>', 'Remover agente')
  .action(async (options) => {
    const agentsDir = join(PROJECT_ROOT, '.agents/agents')

    if (options.list || !options.add && !options.remove) {
      if (!fs.existsSync(agentsDir)) {
        p.log.warn('Diretório de agentes não encontrado. Execute: cleudocode-core init')
        return
      }

      const files = fs.readdirSync(agentsDir)
      const agents = files
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''))

      if (agents.length === 0) {
        p.log.info('Nenhum agente encontrado')
        return
      }

      console.log(chalk.bold('\nAgentes disponíveis:\n'))
      agents.forEach(agent => {
        console.log(`  ${chalk.cyan('•')} ${agent}`)
      })
      console.log()
    }

    if (options.add) {
      const agentPath = join(agentsDir, `${options.add}.md`)
      if (fs.existsSync(agentPath)) {
        p.log.error(`Agente "${options.add}" já existe`)
        return
      }

      const template = getAgentTemplate(options.add)
      fs.writeFileSync(agentPath, template)
      p.log.success(`Agente "${options.add}" criado em ${agentPath}`)
    }

    if (options.remove) {
      const agentPath = join(agentsDir, `${options.remove}.md`)
      if (!fs.existsSync(agentPath)) {
        p.log.error(`Agente "${options.remove}" não encontrado`)
        return
      }

      fs.unlinkSync(agentPath)
      p.log.success(`Agente "${options.remove}" removido`)
    }
  })

// =============================================================================
// COMANDO: doctor
// =============================================================================
program
  .command('doctor')
  .description('Verifica saúde da instalação')
  .action(async () => {
    p.intro(chalk.bgGreen.black(' Cleudocode Core - Doctor '))

    const checks = []

    // Verificar Node.js
    const nodeVersion = process.version
    const minVersion = 'v18.0.0'
    checks.push({
      name: 'Node.js',
      status: semver.gte(nodeVersion, minVersion) ? 'ok' : 'error',
      message: `${nodeVersion} (mínimo: ${minVersion})`
    })

    // Verificar .cleudocode-core
    const configPath = join(PROJECT_ROOT, '.cleudocode-core')
    checks.push({
      name: '.cleudocode-core',
      status: fs.existsSync(configPath) ? 'ok' : 'warn',
      message: fs.existsSync(configPath) ? 'Encontrado' : 'Não encontrado (execute: cleudocode-core init)'
    })

    // Verificar AGENTS.md
    const agentsPath = join(PROJECT_ROOT, 'AGENTS.md')
    checks.push({
      name: 'AGENTS.md',
      status: fs.existsSync(agentsPath) ? 'ok' : 'warn',
      message: fs.existsSync(agentsPath) ? 'Encontrado' : 'Não encontrado'
    })

    // Verificar .env
    const envPath = join(PROJECT_ROOT, '.env')
    checks.push({
      name: '.env',
      status: fs.existsSync(envPath) ? 'ok' : 'info',
      message: fs.existsSync(envPath) ? 'Encontrado' : 'Opcional (copie de .env.example)'
    })

    // Verificar Ollama
    try {
      await execa('ollama', ['--version'])
      checks.push({
        name: 'Ollama',
        status: 'ok',
        message: 'Instalado'
      })
    } catch {
      checks.push({
        name: 'Ollama',
        status: 'info',
        message: 'Não instalado (opcional para modelos locais)'
      })
    }

    // Exibir resultados
    console.log()
    for (const check of checks) {
      const icon = {
        ok: chalk.green('✓'),
        warn: chalk.yellow('⚠'),
        error: chalk.red('✗'),
        info: chalk.blue('ℹ')
      }[check.status]

      console.log(`${icon} ${chalk.bold(check.name)}: ${check.message}`)
    }
    console.log()

    const hasError = checks.some(c => c.status === 'error')
    const hasWarn = checks.some(c => c.status === 'warn')

    if (hasError) {
      p.outro(chalk.red('Foram encontrados erros que precisam de atenção'))
    } else if (hasWarn) {
      p.outro(chalk.yellow('Tudo ok, mas há avisos para melhorar a experiência'))
    } else {
      p.outro(chalk.green('Tudo certo! Configuração está saudável'))
    }
  })

// =============================================================================
// COMANDO: run
// =============================================================================
program
  .command('run <agente>')
  .description('Executa um agente com uma tarefa')
  .option('-t, --task <tarefa>', 'Tarefa a executar')
  .option('-v, --verbose', 'Mostrar logs do provider LLM')
  .option('-p, --provider <provider>', 'Provider LLM: groq, gemini, openai, ollama')
  .option('-m, --model <model>', 'Modelo específico do provider')
  .action(async (agent, options) => {
    p.intro(chalk.bgGreen.black(` Cleudocode Hub — @${agent} `))

    // Busca o agente em múltiplos locais (BMAD-style + legado)
    const agentSearchPaths = [
      join(__dirname, '../agents', agent, 'AGENT.md'),
      join(PROJECT_ROOT, 'agents', agent, 'AGENT.md'),
      join(PROJECT_ROOT, '.agents/agents', `${agent}.md`),
    ]

    let agentPath = null
    let agentContent = null

    for (const candidate of agentSearchPaths) {
      if (fs.existsSync(candidate)) {
        agentPath = candidate
        agentContent = fs.readFileSync(candidate, 'utf-8')
        break
      }
    }

    if (!agentPath) {
      p.log.error(`Agente "@${agent}" não encontrado`)
      p.log.info(`Procurei em:\n${agentSearchPaths.map(p => `  • ${p}`).join('\n')}`)
      p.log.info('Agentes disponíveis: pm, analyst, architect, sm, dev, qa, devops')
      process.exit(1)
    }

    p.log.success(`Agente carregado: ${agentPath}`)

    // Se não tem tarefa, exibe o agente
    if (!options.task) {
      console.log('\n' + chalk.dim('─'.repeat(60)))
      console.log(agentContent)
      console.log(chalk.dim('─'.repeat(60)))
      p.log.info('Use --task "sua tarefa" para executar')
      return
    }

    // Executar com LLM real
    const { ask, getBestProvider, listProviders } = await import('../core/llm/llm-provider.js')

    const provider = options.provider || getBestProvider()
    p.log.info(`Provider: ${chalk.cyan(provider)} | Tarefa: ${chalk.bold(options.task)}`)

    const spinner = ora(`@${agent} processando...`).start()

    try {
      const response = await ask(agentContent, options.task, {
        provider,
        model: options.model,
        verbose: options.verbose,
      })

      spinner.succeed(`@${agent} concluiu!`)

      console.log('\n' + chalk.dim('─'.repeat(60)))
      console.log(response)
      console.log(chalk.dim('─'.repeat(60)))

      // Salvar resposta em docs/outputs/
      const outputDir = join(PROJECT_ROOT, 'docs/outputs')
      fs.ensureDirSync(outputDir)
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const outputFile = join(outputDir, `${agent}-${ts}.md`)
      const outputContent = `# @${agent} — ${new Date().toLocaleString('pt-BR')}\n\n## Tarefa\n${options.task}\n\n## Resposta\n${response}\n`
      fs.writeFileSync(outputFile, outputContent)

      p.outro(chalk.green(`✅ Resposta salva em: ${outputFile}`))

    } catch (error) {
      spinner.fail(`Erro ao executar @${agent}`)
      p.log.error(error.message)

      if (error.message.includes('não instalado')) {
        p.log.info('Execute: npm install groq-sdk @google/generative-ai openai')
      } else if (error.message.includes('API key')) {
        p.log.info('Configure as chaves no .env: GROQ_API_KEY, GOOGLE_API_KEY, etc.')
      }

      process.exit(1)
    }
  })

// =============================================================================
// COMANDO: workflow
// =============================================================================
program
  .command('workflow <tipo>')
  .description('Executa workflow encadeado de agentes BMAD')
  .option('-r, --requirement <texto>', 'Requisito ou objetivo do workflow')
  .option('-p, --provider <provider>', 'Provider LLM: groq, gemini, openai, ollama')
  .option('-s, --skip <agentes>', 'Pular agentes (ex: analyst,sm)')
  .option('--dry-run', 'Apenas mostra o plano sem executar')
  .action(async (tipo, options) => {
    p.intro(chalk.bgGreen.black(` Cleudocode Hub — Workflow BMAD: ${tipo} `))

    // Sequências de workflow
    const workflows = {
      bmad: ['analyst', 'pm', 'architect', 'sm', 'dev', 'qa'],
      plan: ['analyst', 'pm', 'architect'],
      build: ['architect', 'sm', 'dev', 'qa'],
      review: ['qa'],
      full: ['analyst', 'pm', 'architect', 'sm', 'dev', 'qa', 'devops'],
    }

    const sequence = workflows[tipo]
    if (!sequence) {
      p.log.error(`Workflow "${tipo}" não encontrado`)
      p.log.info(`Workflows disponíveis: ${Object.keys(workflows).join(', ')}`)
      process.exit(1)
    }

    // Filtrar agentes ignorados
    const skip = options.skip ? options.skip.split(',') : []
    const agents = sequence.filter(a => !skip.includes(a))

    const requirement = options.requirement || await p.text({
      message: 'Qual o requisito ou objetivo?',
      placeholder: 'Ex: Sistema de autenticação JWT com refresh token',
    })

    if (p.isCancel(requirement)) { p.cancel('Cancelado'); return }

    console.log()
    console.log(chalk.bold('📋 Workflow BMAD:'))
    agents.forEach((a, i) => {
      const arrow = i < agents.length - 1 ? ' →' : ' ✓'
      process.stdout.write(chalk.cyan(`@${a}${arrow} `))
    })
    console.log('\n')

    if (options.dryRun) {
      p.outro(chalk.yellow('Dry-run: nenhuma execução realizada'))
      return
    }

    const { ask, getBestProvider } = await import('../core/llm/llm-provider.js')
    const provider = options.provider || getBestProvider()

    // Diretório de saída do workflow
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const workflowDir = join(PROJECT_ROOT, 'docs/workflows', `${tipo}-${ts}`)
    fs.ensureDirSync(workflowDir)

    // Contexto acumulado — cada agente recebe o output do anterior
    let accumulatedContext = `## Requisito Original\n${requirement}\n`
    const results = []

    for (const agentName of agents) {
      console.log(chalk.bold(`\n${'─'.repeat(60)}`))
      console.log(chalk.bgCyan.black(` @${agentName} `))

      // Carregar system prompt do agente
      const agentPaths = [
        join(__dirname, '../agents', agentName, 'AGENT.md'),
        join(PROJECT_ROOT, 'agents', agentName, 'AGENT.md'),
        join(PROJECT_ROOT, '.agents/agents', `${agentName}.md`),
      ]
      let agentPrompt = null
      for (const ap of agentPaths) {
        if (fs.existsSync(ap)) { agentPrompt = fs.readFileSync(ap, 'utf-8'); break }
      }
      if (!agentPrompt) {
        p.log.warn(`@${agentName} não encontrado, pulando...`)
        continue
      }

      // Tarefa contextualizada com outputs anteriores
      const userMessage = `${accumulatedContext}\n\n## Sua Tarefa\nCom base no contexto acima, execute seu papel como @${agentName} para o requisito: "${requirement}"`

      const spinner = ora(`@${agentName} processando...`).start()

      try {
        const response = await ask(agentPrompt, userMessage, { provider })
        spinner.succeed(`@${agentName} concluiu`)

        console.log('\n' + response)

        // Salvar output individual
        const agentFile = join(workflowDir, `${String(results.length + 1).padStart(2, '0')}-${agentName}.md`)
        fs.writeFileSync(agentFile, `# @${agentName}\n\n## Tarefa\n${requirement}\n\n## Output\n${response}\n`)

        // Acumular contexto para próximo agente
        accumulatedContext += `\n\n## Output do @${agentName}\n${response}`
        results.push({ agent: agentName, output: response, file: agentFile })

      } catch (error) {
        spinner.fail(`@${agentName} falhou: ${error.message}`)
        p.log.warn('Continuando com próximo agente...')
      }
    }

    // Gerar documento final consolidado
    const finalDoc = join(workflowDir, '00-WORKFLOW-COMPLETO.md')
    const header = `# Workflow BMAD: ${tipo}\n**Requisito:** ${requirement}\n**Data:** ${new Date().toLocaleString('pt-BR')}\n**Provider:** ${provider}\n\n---\n\n`
    fs.writeFileSync(finalDoc, header + accumulatedContext)

    console.log(`\n${'─'.repeat(60)}`)
    p.outro(chalk.green(`\n✅ Workflow concluído!\n\n📁 Arquivos em: ${workflowDir}\n📄 Consolidado: 00-WORKFLOW-COMPLETO.md\n`))
  })

// =============================================================================
// COMANDO: update

// =============================================================================
program
  .command('update')
  .description('Atualiza cleudocode-core para última versão')
  .option('-g, --global', 'Atualizar instalação global')
  .action(async (options) => {
    const spinner = ora('Verificando atualizações...').start()

    try {
      const { stdout } = await execa('npm', ['view', 'cleudocode-core', 'version'])
      const latestVersion = stdout.trim()

      if (semver.gt(latestVersion, VERSION)) {
        spinner.info(`Nova versão disponível: ${latestVersion} (atual: ${VERSION})`)
        
        if (options.global) {
          const updateSpinner = ora('Atualizando instalação global...').start()
          await execa('npm', ['update', '-g', 'cleudocode-core'])
          updateSpinner.succeed('Atualizado com sucesso!')
        } else {
          console.log(`
Para atualizar:

${chalk.cyan('Global:')}
  npm update -g cleudocode-core

${chalk.cyan('Local (projeto):')}
  npm update cleudocode-core

${chalk.cyan('Usando npx (sempre mais recente):')}
  npx cleudocode-core@latest
`)
        }
      } else {
        spinner.succeed('Você já está na versão mais recente!')
      }
    } catch (error) {
      spinner.fail('Erro ao verificar atualizações')
      p.log.error(error.message)
    }
  })

// =============================================================================
// COMANDO: templates
// =============================================================================
program
  .command('templates')
  .description('Lista templates disponíveis')
  .action(async () => {
    const templatesDir = join(__dirname, '../templates')

    if (!fs.existsSync(templatesDir)) {
      p.log.warn('Nenhum template encontrado')
      return
    }

    const templates = fs.readdirSync(templatesDir)

    console.log(chalk.bold('\nTemplates disponíveis:\n'))
    templates.forEach(t => {
      console.log(`  ${chalk.cyan('•')} ${t}`)
    })
    console.log()
  })

// =============================================================================
// COMANDO: plugin
// =============================================================================
program
  .command('plugin <acao> [nome]')
  .description('Gerencia plugins')
  .option('-l, --list', 'Listar plugins instalados')
  .action(async (acao, nome, options) => {
    p.intro(chalk.bgGreen.black(` SuperCleudocode - Plugin ${acao} `))

    const pluginsDir = join(PROJECT_ROOT, 'plugins')

    if (acao === 'list' || options.list) {
      if (!fs.existsSync(pluginsDir)) {
        p.log.info('Nenhum plugin instalado')
        return
      }

      const plugins = fs.readdirSync(pluginsDir)
        .filter(p => fs.statSync(join(pluginsDir, p)).isDirectory())

      if (plugins.length === 0) {
        p.log.info('Nenhum plugin instalado')
        return
      }

      console.log(chalk.bold('\nPlugins instalados:\n'))
      plugins.forEach(plugin => {
        console.log(`  ${chalk.cyan('•')} ${plugin}`)
      })
      console.log()
      return
    }

    if (acao === 'install' && nome) {
      const spinner = ora(`Instalando plugin ${nome}...`).start()
      
      try {
        // Verificar se é o supercleudocode-plugin
        if (nome === 'supercleudocode-plugin' || nome === 'supercleudocode') {
          const pluginPath = join(PROJECT_ROOT, 'supercleudocode-plugin')
          
          if (!fs.existsSync(pluginPath)) {
            spinner.fail('Plugin não encontrado localmente')
            p.log.info('Execute a partir do diretório do cleudocodehub.skill')
            return
          }

          // Criar symlink ou copiar
          const targetPath = join(pluginsDir, 'supercleudocode-plugin')
          
          if (!fs.existsSync(pluginsDir)) {
            fs.ensureDirSync(pluginsDir)
          }

          if (fs.existsSync(targetPath)) {
            fs.removeSync(targetPath)
          }

          fs.symlinkSync(pluginPath, targetPath, 'dir')
          
          spinner.succeed('supercleudocode-plugin instalado!')
          
          p.log.info(`
${chalk.bold('Comandos disponíveis:')}
  cleudocode-core super-skill --list
  cleudocode-core super-plan "minha feature"
  cleudocode-core super-execute
  cleudocode-core super-review
  cleudocode-core super-test
  cleudocode-core super-debug "problema"
  cleudocode-core super-deploy staging

${chalk.bold('Skills disponíveis:')}
  @brainstorming
  @test-driven-development
  @systematic-debugging
  @writing-plans
  @using-supercleudocode

${chalk.bold('Próximos passos:')}
  1. Execute: cleudocode-core super-skill --list
  2. Veja: supercleudocode-plugin/QUICKSTART.md
`)
          return
        }

        spinner.fail(`Plugin "${nome}" não suportado`)
        
      } catch (error) {
        spinner.fail('Erro ao instalar plugin')
        p.log.error(error.message)
      }
      return
    }

    if (acao === 'uninstall' && nome) {
      const pluginPath = join(pluginsDir, nome)
      
      if (!fs.existsSync(pluginPath)) {
        p.log.error(`Plugin "${nome}" não encontrado`)
        return
      }

      const spinner = ora(`Removendo plugin ${nome}...`).start()
      
      try {
        fs.unlinkSync(pluginPath)
        spinner.succeed(`Plugin "${nome}" removido`)
      } catch (error) {
        spinner.fail('Erro ao remover plugin')
        p.log.error(error.message)
      }
      return
    }

    p.log.warn(`Ação "${acao}" não suportada`)
    p.log.info('Use: cleudocode-core plugin install <nome>')
    p.log.info('     cleudocode-core plugin uninstall <nome>')
    p.log.info('     cleudocode-core plugin list')
  })

// =============================================================================
// COMANDOS SUPERCLUEDOCODE
// =============================================================================

// super-skill
program
  .command('super-skill [nome]')
  .description('Ativa ou mostra documentação de skill')
  .option('-l, --list', 'Listar todas as skills')
  .option('-s, --status', 'Mostrar status das skills ativas')
  .action(async (nome, options) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Skills '))

    const skillsPath = join(PROJECT_ROOT, 'supercleudocode-plugin', 'skills')

    if (!fs.existsSync(skillsPath)) {
      p.log.error('Diretório de skills não encontrado')
      p.log.info(`Procure em: ${skillsPath}`)
      return
    }

    if (options.list || !nome) {
      const files = fs.readdirSync(skillsPath)
      const skills = files
        .filter(f => fs.statSync(join(skillsPath, f)).isDirectory())

      if (skills.length === 0) {
        p.log.info('Nenhuma skill encontrada')
        return
      }

      console.log(chalk.bold('\nSuper-Skills disponíveis:\n'))
      skills.forEach(skill => {
        const hasDoc = fs.existsSync(join(skillsPath, skill, 'SKILL.md'))
        const icon = hasDoc ? chalk.green('✓') : chalk.yellow('⚠')
        console.log(`  ${icon} ${chalk.cyan(skill)}`)
      })
      console.log()
      return
    }

    if (options.status) {
      const configPath = join(PROJECT_ROOT, '.cleudocode-core')
      if (fs.existsSync(configPath)) {
        const config = yaml.load(fs.readFileSync(configPath, 'utf-8'))
        const enabledSkills = config?.supercleudocode?.skills?.enabled || []
        
        console.log(chalk.bold('\nSkills ativas:\n'))
        enabledSkills.forEach(skill => {
          console.log(`  ${chalk.green('•')} ${skill}`)
        })
        console.log()
      }
      return
    }

    // Mostrar documentação da skill
    const skillDocPath = join(skillsPath, nome, 'SKILL.md')
    if (fs.existsSync(skillDocPath)) {
      const content = fs.readFileSync(skillDocPath, 'utf-8')
      console.log('\n' + content)
    } else {
      p.log.error(`Skill "${nome}" não encontrada`)
      p.log.info('Use "cleudocode-core super-skill --list" para ver skills disponíveis')
    }
  })

// super-plan
program
  .command('super-plan [descricao]')
  .description('Cria plano de implementação')
  .option('-p, --priority <nivel>', 'Prioridade: low, medium, high, critical', 'medium')
  .action(async (descricao, options) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Planning '))

    if (!descricao) {
      descricao = await p.text({
        message: 'Descrição da feature/tarefa:'
      })

      if (p.isCancel(descricao)) {
        p.cancel('Operação cancelada')
        return
      }
    }

    const spinner = ora('Criando plano de implementação...').start()

    try {
      const plansDir = join(PROJECT_ROOT, 'docs/plans')
      fs.ensureDirSync(plansDir)
      
      const date = new Date().toISOString().split('T')[0]
      const fileName = `${date}--${descricao.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
      const planPath = join(plansDir, fileName)

      const planContent = `# Implementation Plan: ${descricao}

**Date:** ${date}
**Priority:** ${options.priority}
**Status:** draft

## Overview

${descricao}

## Tasks

### Task 1: Setup
**Time:** 5 minutes

**Files Changed:**
- \`src/\` - Create structure

**Steps:**
1. Create directory structure
2. Setup configuration files
3. Initialize version control

**Verification:**
- [ ] Directory structure created
- [ ] Configuration files in place
- [ ] Git initialized

**Dependencies:**
- Blocks: Task 2
- Blocked by: None

---

## Approval

- [ ] Design reviewed
- [ ] Tasks are appropriately sized
- [ ] Dependencies are correct
- [ ] Verification steps are clear

**Approved by:** _______________
**Approved at:** _______________
`
      fs.writeFileSync(planPath, planContent)
      spinner.succeed(`Plano criado: ${planPath}`)
      p.log.info(`Edite o plano e execute com: cleudocode-core super-execute`)
      
    } catch (error) {
      spinner.fail('Erro ao criar plano')
      p.log.error(error.message)
    }
  })

// super-execute
program
  .command('super-execute [plano]')
  .description('Executa plano aprovado')
  .action(async (plano) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Execution '))

    const plansDir = join(PROJECT_ROOT, 'docs/plans')
    
    if (!plano) {
      if (!fs.existsSync(plansDir)) {
        p.log.warn('Nenhum plano encontrado')
        return
      }

      const files = fs.readdirSync(plansDir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''))

      if (files.length === 0) {
        p.log.info('Nenhum plano encontrado. Crie com: cleudocode-core super-plan')
        return
      }

      const selected = await p.select({
        message: 'Selecione o plano:',
        options: files.map(f => ({ label: f, value: f }))
      })

      if (p.isCancel(selected)) {
        p.cancel('Operação cancelada')
        return
      }

      plano = selected
    }

    const planPath = join(plansDir, `${plano}.md`)
    if (!fs.existsSync(planPath)) {
      p.log.error(`Plano "${plano}" não encontrado`)
      return
    }

    p.log.info(`Executando plano: ${plano}`)
    p.log.info('@madmax *orchestrate para execução completa')
  })

// super-review
program
  .command('super-review [alvo]')
  .description('Solicita code review')
  .option('-s, --security', 'Foco em segurança')
  .action(async (alvo, options) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Code Review '))

    const target = alvo || '.'
    
    p.log.info(`Solicitando review para: ${target}`)
    
    if (options.security) {
      p.log.info('Foco: Segurança')
    }

    p.log.info('@code-review *review para execução')
  })

// super-test
program
  .command('super-test')
  .description('Executa testes')
  .option('-c, --coverage', 'Gerar relatório de cobertura')
  .action(async (options) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Testing '))

    p.log.info('Executando testes...')
    
    if (options.coverage) {
      p.log.info('Com cobertura')
    }

    p.log.info('Configure npm test no seu projeto')
  })

// super-debug
program
  .command('super-debug [issue]')
  .description('Inicia debug sistemático')
  .action(async (issue) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Debugging '))

    if (!issue) {
      issue = await p.text({
        message: 'Descrição do problema:'
      })

      if (p.isCancel(issue)) {
        p.cancel('Operação cancelada')
        return
      }
    }

    p.log.info(`Iniciando debug sistemático: ${issue}`)
    p.log.info('Fases: Reproduzir → Isolar → Hipotetizar → Corrigir')
    p.log.info('@systematic-debugging para execução completa')
  })

// super-deploy
program
  .command('super-deploy [ambiente]')
  .description('Deploy para ambiente')
  .option('--dry-run', 'Simular deploy')
  .action(async (ambiente, options) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Deploy '))

    const env = ambiente || 'staging'
    
    if (options.dryRun) {
      p.log.info(`[DRY RUN] Deploy para: ${env}`)
    } else {
      p.log.info(`Deploy para: ${env}`)
    }

    p.log.info('Configure CI/CD para deploy automatizado')
  })

// super-init
program
  .command('super-init [projeto]')
  .description('Inicializa projeto com SuperCleudocode')
  .action(async (projeto) => {
    p.intro(chalk.bgGreen.black(' SuperCleudocode - Project Init '))

    let projectName = projeto

    if (!projectName) {
      projectName = await p.text({
        message: 'Nome do projeto:',
        defaultValue: 'my-project'
      })

      if (p.isCancel(projectName)) {
        p.cancel('Operação cancelada')
        return
      }
    }

    const spinner = ora('Criando estrutura do projeto...').start()

    try {
      const projectPath = join(PROJECT_ROOT, projectName)
      fs.ensureDirSync(projectPath)

      const dirs = ['src', 'tests', 'docs', 'docs/plans', 'scripts']

      for (const dir of dirs) {
        fs.ensureDirSync(join(projectPath, dir))
      }

      fs.writeFileSync(
        join(projectPath, 'README.md'),
        `# ${projectName}\n\nProjeto criado com SuperCleudocode\n`
      )

      spinner.succeed(`Projeto criado: ${projectPath}`)
      p.outro(chalk.green('✨ Projeto inicializado!'))
      
    } catch (error) {
      spinner.fail('Erro ao inicializar')
      p.log.error(error.message)
    }
  })

// =============================================================================
// COMANDO: yolo - MODO DE DESENVOLVIMENTO AUTOMÁTICO
// =============================================================================
program
  .command('yolo [feature]')
  .description('🚀 MADMAX YOLO Mode - Desenvolvimento Automático End-to-End')
  .option('-f, --feature <descricao>', 'Descrição da feature')
  .option('--no-commit', 'Não fazer commit automático')
  .option('--no-test', 'Não criar testes')
  .option('--verbose', 'Output detalhado')
  .action(async (feature, options) => {
    p.intro(chalk.bgRed.black(' MADMAX YOLO MODE '))

    console.log(chalk.red.bold('\n⚠️  YOLO MODE ACTIVATED ⚠️'))
    console.log(chalk.red('Nenhuma pergunta. Nenhuma confirmação. Apenas código.\n'))

    let featureDesc = options.feature || feature

    if (!featureDesc) {
      featureDesc = await p.text({
        message: 'O que você quer desenvolver? (YOLO vai fazer tudo)',
        placeholder: 'ex: API de autenticação de usuários'
      })

      if (p.isCancel(featureDesc)) {
        p.cancel('Operação cancelada')
        return
      }
    }

    console.log(chalk.red(`🚀 Iniciando YOLO mode para: ${featureDesc}\n`))

    try {
      // Importar módulo YOLO
      const { YOLODevelopmentModule } = await import(
        join(__dirname, '../supercleudocode-plugin/lib/yolo-mode.js')
      )

      const yolo = new YOLODevelopmentModule({
        autoCommit: options.commit !== false,
        autoTest: options.test !== false,
        verbose: options.verbose || false
      })

      // Executar desenvolvimento automático
      const result = await yolo.run(featureDesc, {
        type: 'auto',
        skipQuestions: true,
        autoApprove: true
      })

      if (result.success) {
        p.outro(chalk.green('✅ YOLO Mode completado com sucesso!'))
      } else {
        p.outro(chalk.yellow('⚠️  YOLO Mode completado com erros tratados'))
      }

    } catch (error) {
      p.log.error(chalk.red(`Erro: ${error.message}`))
      p.outro(chalk.red('❌ YOLO Mode falhou'))
    }
  })

// =============================================================================
// COMANDO: swarm - SWARM DE AGENTES SEMÂNTICOS
// =============================================================================
program
  .command('swarm [task]')
  .description('🐝 Semantic Agent Swarm - Enxame de Agentes IA')
  .option('-t, --task <descricao>', 'Descrição da tarefa')
  .option('-a, --agents <numero>', 'Número de agentes (3-10)', '5')
  .option('-m, --mode <modo>', 'Modo: democratic|consensus|leader', 'democratic')
  .option('--verbose', 'Output detalhado')
  .action(async (task, options) => {
    p.intro(chalk.bgBlue.black(' SEMANTIC AGENT SWARM '))

    console.log(chalk.blue.bold('\n🐝 SWARM DE AGENTES SEMÂNTICOS 🐝'))
    console.log(chalk.blue('Múltiplos agentes IA trabalhando juntos\n'))

    let taskDesc = options.task || task

    if (!taskDesc) {
      taskDesc = await p.text({
        message: 'Qual tarefa o swarm deve executar?',
        placeholder: 'ex: Criar API REST com autenticação JWT'
      })

      if (p.isCancel(taskDesc)) {
        p.cancel('Operação cancelada')
        return
      }
    }

    const numAgents = Math.min(Math.max(parseInt(options.agents) || 5, 3), 10)

    console.log(chalk.blue(`🎯 Tarefa: ${taskDesc}`))
    console.log(chalk.blue(`🐝 Agentes: ${numAgents}`))
    console.log(chalk.blue(`📊 Modo: ${options.mode}\n`))

    try {
      // Importar módulo Swarm
      const { SemanticAgentSwarm } = await import(
        join(__dirname, '../supercleudocode-plugin/lib/semantic-swarm.js')
      )

      // Criar swarm
      const swarm = new SemanticAgentSwarm({
        maxAgents: numAgents,
        coordinationStrategy: options.mode,
        verbose: options.verbose || false
      })

      // Event listeners
      swarm.on('coordination', (data) => {
        console.log(chalk.dim(`  [COORDINATION] ${JSON.stringify(data.decision)}`))
      })

      swarm.on('architecture', (data) => {
        console.log(chalk.dim(`  [ARCHITECTURE] Pattern: ${data.architecture?.pattern}`))
      })

      swarm.on('development', (data) => {
        console.log(chalk.dim(`  [DEVELOPMENT] Files: ${data.files?.length || 0}`))
      })

      swarm.on('review', (data) => {
        console.log(chalk.dim(`  [REVIEW] Score: ${data.qualityScore}/10`))
      })

      swarm.on('testing', (data) => {
        console.log(chalk.dim(`  [TESTING] Coverage: ${data.coverage}%`))
      })

      swarm.on('consensus', (data) => {
        console.log(chalk.dim(`  [CONSENSUS] ${data.decision} (${(data.score * 100).toFixed(0)}%)`))
      })

      // Inicializar swarm
      swarm.initialize(taskDesc)

      // Executar tarefa
      const result = await swarm.execute({
        type: 'feature',
        description: taskDesc
      })

      // Gerar relatório
      swarm.generateReport({ description: taskDesc }, result)

      if (result.success) {
        p.outro(chalk.green('✅ Swarm completado com sucesso!'))
      } else {
        p.outro(chalk.yellow('⚠️  Swarm não alcançou consenso'))
      }

    } catch (error) {
      p.log.error(chalk.red(`Erro: ${error.message}`))
      p.outro(chalk.red('❌ Swarm falhou'))
      if (options.verbose) {
        console.error(error.stack)
      }
    }
  })

// =============================================================================
// COMANDO: marketplace - INTEGRAÇÃO COM SKILLS MARKETPLACE
// =============================================================================
program
  .command('marketplace [acao] [nome]')
  .description('🔌 Skills Marketplace - 86,396+ skills (skills.sh)')
  .option('-s, --search <query>', 'Buscar skills')
  .option('-i, --install <skill>', 'Instalar skill')
  .option('-l, --list', 'Listar skills')
  .option('-c, --category <nome>', 'Listar por categoria')
  .option('--enable <skill>', 'Ativar skill')
  .option('--disable <skill>', 'Desativar skill')
  .option('--hot', 'Hot skills (1h)')
  .option('--trending', 'Trending skills (24h)')
  .option('--all-time', 'All-time top skills')
  .option('--stats', 'Estatísticas do marketplace')
  .action(async (acao, nome, options) => {
    p.intro(chalk.bgBlue.black(' SKILLS MARKETPLACE '))

    console.log(chalk.blue.bold('\n🔌 Skills Marketplace Integration'))
    console.log(chalk.blue('86,396+ skills disponíveis via skills.sh\n'))

    try {
      // Importar módulo Marketplace
      const { SkillsMarketplaceIntegration } = await import(
        join(__dirname, '../supercleudocode-plugin/lib/marketplace-integration.js')
      )

      const marketplace = new SkillsMarketplaceIntegration()
      await marketplace.initialize()

      // Hot skills (última hora)
      if (options.hot) {
        const hotSkills = await marketplace.getHotSkills(20)
        console.log(chalk.bgRed.black(' 🔥 HOT SKILLS (1h) '))
        console.log()
        hotSkills.forEach(skill => {
          console.log(chalk.yellow(`  #${skill.rank} ${skill.name}`))
          console.log(chalk.dim(`     Repo: ${skill.repository}`))
          console.log(chalk.dim(`     1H: ${skill.installs1h} installs (${skill.change})`))
          console.log()
        })
        p.outro(chalk.green(`✅ Top ${hotSkills.length} hot skills`))
        return
      }

      // Trending skills (24h)
      if (options.trending) {
        const trendingSkills = await marketplace.getTrendingSkills(20)
        console.log(chalk.bgCyan.black(' 📈 TRENDING SKILLS (24h) '))
        console.log()
        trendingSkills.forEach(skill => {
          console.log(chalk.cyan(`  #${skill.rank} ${skill.name}`))
          console.log(chalk.dim(`     Repo: ${skill.repository}`))
          console.log(chalk.dim(`     24H: ${skill.installs24h} installs (${skill.growth})`))
          console.log()
        })
        p.outro(chalk.green(`✅ Top ${trendingSkills.length} trending skills`))
        return
      }

      // All-time skills
      if (options.allTime || acao === 'all-time') {
        const allTimeSkills = await marketplace.getAllTimeSkills(20)
        console.log(chalk.bgYellow.black(' 🏆 ALL-TIME TOP SKILLS '))
        console.log()
        allTimeSkills.forEach(skill => {
          console.log(chalk.yellow(`  #${skill.rank} ${skill.name}`))
          console.log(chalk.dim(`     Repo: ${skill.repository}`))
          console.log(chalk.dim(`     Total: ${skill.totalInstalls} installs`))
          console.log()
        })
        p.outro(chalk.green(`✅ Top ${allTimeSkills.length} all-time skills`))
        return
      }

      if (options.search) {
        const results = await marketplace.searchSkills(options.search)
        console.log(chalk.blue(`\n🔍 Resultados para: "${options.search}"`))
        results.skills.forEach(skill => {
          console.log(chalk.green(`  ✓ ${skill.name} (${skill.category})`))
        })
        p.outro(chalk.green(`✅ ${results.total} skills encontradas`))
        return
      }

      if (options.install) {
        const result = await marketplace.installSkill(options.install)
        if (result.success) {
          p.outro(chalk.green('✅ Skill instalada!'))
        } else {
          p.outro(chalk.red('❌ Erro ao instalar'))
        }
        return
      }

      if (options.enable) {
        await marketplace.toggleSkill(options.enable, true)
        p.outro(chalk.green('✅ Skill ativada!'))
        return
      }

      if (options.disable) {
        await marketplace.toggleSkill(options.disable, false)
        p.outro(chalk.green('✅ Skill desativada!'))
        return
      }

      if (options.category) {
        marketplace.listByCategory(options.category)
        return
      }

      if (options.list || !acao) {
        marketplace.listAll()
        return
      }

      if (options.stats || acao === 'stats') {
        const stats = marketplace.getStats()
        console.log(chalk.bgBlue.black('\n MARKETPLACE STATS '))
        console.log(chalk.blue(`\n📊 Skills: ${stats.totalSkills}`))
        console.log(chalk.blue(`📦 Instaladas: ${stats.installedSkills}`))
        console.log(chalk.blue(`📚 Knowledge: ${stats.knowledgeBase.docs} docs`))
        console.log(chalk.blue(`🤖 Agentes: ${stats.agents}`))
        console.log(chalk.blue(`🎯 Missões: ${stats.activeMissions}\n`))
        p.outro(chalk.green('✅ Stats atualizados!'))
        return
      }

      // Ações diretas
      if (acao === 'search' && nome) {
        const results = await marketplace.searchSkills(nome)
        results.skills.forEach(s => console.log(chalk.green(`  ✓ ${s.name}`)))
        return
      }

      if (acao === 'install' && nome) {
        await marketplace.installSkill(nome)
        return
      }

      if (acao === 'list') {
        marketplace.listAll()
        return
      }

      p.log.warn('Ação não especificada')
      p.log.info('Use: cleudocode-core marketplace --list')
      p.log.info('     cleudocode-core marketplace --hot')
      p.log.info('     cleudocode-core marketplace --trending')
      p.log.info('     cleudocode-core marketplace --all-time')
      p.log.info('     cleudocode-core marketplace --search "query"')
      p.log.info('     cleudocode-core marketplace --stats')

    } catch (error) {
      p.log.error(chalk.red(`Erro: ${error.message}`))
      p.outro(chalk.red('❌ Erro no marketplace'))
    }
  })

// =============================================================================
// HELP PERSONALIZADO
// =============================================================================
program.addHelpText('after', `
${chalk.bold('Exemplos:')}
  ${chalk.cyan('npx cleudocode-core init')}              Inicializa no projeto atual
  ${chalk.cyan('cleudocode-core install')}               Instala globalmente
  ${chalk.cyan('cleudocode-core agents --list')}         Lista agentes
  ${chalk.cyan('cleudocode-core doctor')}                Verifica saúde da instalação
  ${chalk.cyan('cleudocode-core config settings')}       Mostra configurações
  ${chalk.cyan('cleudocode-core run dev -t "criar API"')} Executa agente
  ${chalk.cyan('cleudocode-core plugin install supercleudocode-plugin')} Instala SuperCleudocode
  ${chalk.cyan('cleudocode-core super-skill --list')}    Lista Super-Skills
  ${chalk.cyan('cleudocode-core yolo "minha feature"')}  🚀 YOLO MODE
  ${chalk.cyan('cleudocode-core swarm "API REST"')}      🐝 SWARM DE AGENTES
  ${chalk.cyan('cleudocode-core marketplace --list')}    🔌 MARKETPLACE DE SKILLS

${chalk.bold('SuperCleudocode Commands:')}
  ${chalk.cyan('super-skill [nome]')}       Ativa ou mostra skill
  ${chalk.cyan('super-plan [descricao]')}   Cria plano de implementação
  ${chalk.cyan('super-execute [plano]')}    Executa plano
  ${chalk.cyan('super-review [alvo]')}      Solicita review
  ${chalk.cyan('super-test [alvo]')}        Executa testes
  ${chalk.cyan('super-debug [issue]')}      Inicia debug
  ${chalk.cyan('super-deploy [env]')}       Deploy para ambiente
  ${chalk.cyan('super-init [projeto]')}     Inicializa projeto
  ${chalk.cyan('yolo [feature]')}           🚀 YOLO MODE - Desenvolvimento automático
  ${chalk.cyan('swarm [task]')}             🐝 SWARM - Agentes semânticos
  ${chalk.cyan('marketplace [acao]')}       🔌 Skills Marketplace (160K+ skills)

${chalk.bold('Marketplace Commands:')}
  ${chalk.cyan('marketplace --list')}              Lista skills locais
  ${chalk.cyan('marketplace --search "query"')}    Busca skills
  ${chalk.cyan('marketplace --install skill')}     Instala skill
  ${chalk.cyan('marketplace --stats')}             Estatísticas
  ${chalk.cyan('marketplace --category name')}     Lista por categoria

${chalk.bold('Links:')}
  Documentação: https://github.com/cleudocode/cleudocode-core
  Issues: https://github.com/cleudocode/cleudocode-core/issues
  NPM: https://www.npmjs.com/package/cleudocode-core
  SuperCleudocode: supercleudocode-plugin/README.md
  YOLO Mode: supercleudocode-plugin/lib/yolo-mode.js
  Semantic Swarm: supercleudocode-plugin/lib/semantic-swarm.js
  Marketplace: supercleudocode-plugin/lib/marketplace-integration.js
`)

// =============================================================================
// EXECUÇÃO
// =============================================================================
program.parse()

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

function getDefaultConfig(template) {
  return `# Cleudocode Core Configuration
# Template: ${template}
# Gerado em: ${new Date().toISOString()}

version: "1.0.0"

settings:
  language: "pt-BR"
  default_agent: "general-purpose"
  verbose: false
  log_mode: "console"

llms:
  models:
    - name: "qwen3:4b"
      backend: "ollama"
      hostname: "http://localhost:11434"
      enabled: true

agents:
  enabled:
    - "general-purpose"
    - "code-review"
    - "testing"
  default: "general-purpose"

paths:
  rules: ".agents/rules"
  agents: ".agents/agents"
  tasks: ".agents/tasks"
  templates: ".agents/templates"
`
}

function getDefaultAgentsMd() {
  return `# AGENTS.md - Cleudocode Hub

## Agentes Disponíveis

| Agente | Descrição |
|--------|-----------|
| @general-purpose | Agente de uso geral |
| @code-review | Revisão de código |
| @testing | Criação de testes |

## Uso

\`\`\`bash
# Listar agentes
cleudocode-core agents --list

# Executar agente
cleudocode-core run general-purpose -t "minha tarefa"
\`\`\`
`
}

function getDefaultEnvExample() {
  return `# Cleudocode Hub - Environment Variables
# Copie para .env e preencha com suas credenciais

# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Ollama (Local)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:4b
`
}

function getAgentTemplate(name) {
  return `# ${name.toUpperCase()}

## Descrição
Agente especializado em ${name}.

## Comandos
- *help - Mostrar ajuda
- *status - Status atual
- *exit - Sair do modo agente

## Exemplo de Uso
\`\`\`bash
cleudocode-core run ${name} -t "descrição da tarefa"
\`\`\`
`
}

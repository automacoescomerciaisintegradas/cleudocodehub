#!/usr/bin/env node

/**
 * SuperCleudocode Plugin Commands
 * 
 * Comandos estendidos para o Cleudocode Core
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as p from '@clack/prompts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = process.cwd()
const PLUGIN_ROOT = join(PROJECT_ROOT, 'supercleudocode-plugin')

/**
 * Registrar comandos do SuperCleudocode
 */
export function registerSuperCleudocodeCommands(program) {
  
  // =============================================================================
  // COMANDO: super-skill
  // =============================================================================
  program
    .command('super-skill [nome]')
    .description('Ativa ou mostra documentação de skill')
    .option('-l, --list', 'Listar todas as skills')
    .option('-a, --activate <nome>', 'Ativar skill específica')
    .option('-s, --status', 'Mostrar status das skills ativas')
    .action(async (nome, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Skills '))

      const skillsPath = join(PLUGIN_ROOT, 'skills')

      if (!fs.existsSync(skillsPath)) {
        p.log.error('Diretório de skills não encontrado')
        p.log.info(`Procure em: ${skillsPath}`)
        return
      }

      if (options.list || !nome) {
        const files = fs.readdirSync(skillsPath)
        const skills = files
          .filter(f => fs.statSync(join(skillsPath, f)).isDirectory())
          .map(f => f.replace('/SKILL.md', ''))

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
        } else {
          p.log.warn('Configuração não encontrada')
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

  // =============================================================================
  // COMANDO: super-plan
  // =============================================================================
  program
    .command('super-plan [descricao]')
    .description('Cria plano de implementação')
    .option('-f, --from-design <arquivo>', 'Usar documento de design existente')
    .option('-p, --priority <nivel>', 'Prioridade: low, medium, high, critical', 'medium')
    .option('-o, --output <arquivo>', 'Salvar plano em arquivo')
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
        // Criar estrutura do plano
        const plan = {
          title: descricao,
          date: new Date().toISOString().split('T')[0],
          priority: options.priority,
          design: options.fromDesign || 'pending',
          tasks: [],
          status: 'draft'
        }

        // Salvar plano
        const plansDir = join(PROJECT_ROOT, 'docs/plans')
        fs.ensureDirSync(plansDir)
        
        const fileName = `${plan.date}--${descricao.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`
        const planPath = options.output || join(plansDir, fileName)

        const planContent = generatePlanMarkdown(plan)
        fs.writeFileSync(planPath, planContent)

        spinner.succeed(`Plano criado: ${planPath}`)
        p.log.info(`Edite o plano e execute com: cleudocode-core super-execute`)
        
      } catch (error) {
        spinner.fail('Erro ao criar plano')
        p.log.error(error.message)
      }
    })

  // =============================================================================
  // COMANDO: super-execute
  // =============================================================================
  program
    .command('super-execute [plano]')
    .description('Executa plano aprovado')
    .option('--from-task <n>', 'Começar da tarefa N')
    .option('--to-task <n>', 'Terminar na tarefa N')
    .option('--parallel', 'Executar tarefas em paralelo')
    .option('--agents <n>', 'Número de subagentes', '1')
    .action(async (plano, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Execution '))

      const plansDir = join(PROJECT_ROOT, 'docs/plans')
      
      if (!plano) {
        // Listar planos disponíveis
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

      const content = fs.readFileSync(planPath, 'utf-8')
      
      p.log.info(`Executando plano: ${plano}`)
      p.log.info(`Tarefas: ${options.fromTask || '1'} até ${options.toTask || 'todas'}`)
      
      if (options.parallel) {
        p.log.info(`Execução paralela com ${options.agents} subagentes`)
      }

      console.log(chalk.dim('\n(Execução do plano - funcionalidade em desenvolvimento)'))
      console.log(chalk.dim('Use @madmax *orchestrate para execução completa\n'))
    })

  // =============================================================================
  // COMANDO: super-review
  // =============================================================================
  program
    .command('super-review [alvo]')
    .description('Solicita code review')
    .option('-t, --target <caminho>', 'Revisar caminho específico')
    .option('-s, --security', 'Foco em segurança')
    .option('-p, --performance', 'Foco em performance')
    .option('--pr <numero>', 'Revisar pull request')
    .action(async (alvo, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Code Review '))

      const target = options.target || alvo || '.'
      
      p.log.info(`Solicitando review para: ${target}`)
      
      if (options.security) {
        p.log.info('Foco: Segurança')
      }
      
      if (options.performance) {
        p.log.info('Foco: Performance')
      }

      if (options.pr) {
        p.log.info(`Pull Request: #${options.pr}`)
      }

      console.log(chalk.dim('\n(Review solicitado - use @code-review *review para execução)\n'))
    })

  // =============================================================================
  // COMANDO: super-test
  // =============================================================================
  program
    .command('super-test [alvo]')
    .description('Executa testes')
    .option('-t, --type <tipo>', 'Tipo: unit, integration, e2e, all', 'all')
    .option('-c, --coverage', 'Gerar relatório de cobertura')
    .option('-w, --watch <caminho>', 'Modo watch')
    .option('-v, --verbose', 'Output verboso')
    .action(async (alvo, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Testing '))

      const spinner = ora(`Rodando testes (${options.type})...`).start()

      try {
        // Detectar package manager
        let testCommand = 'npm test'
        
        if (fs.existsSync(join(PROJECT_ROOT, 'yarn.lock'))) {
          testCommand = 'yarn test'
        } else if (fs.existsSync(join(PROJECT_ROOT, 'pnpm-lock.yaml'))) {
          testCommand = 'pnpm test'
        } else if (fs.existsSync(join(PROJECT_ROOT, 'bun.lockb'))) {
          testCommand = 'bun test'
        }

        // Adicionar flags
        if (options.coverage) {
          testCommand += ' --coverage'
        }
        
        if (options.verbose) {
          testCommand += ' --verbose'
        }

        if (options.watch) {
          testCommand += ` --watch ${options.watch}`
        }

        spinner.stop()
        p.log.info(`Comando: ${testCommand}`)
        p.log.info('(Execute manualmente ou configure hooks)')
        
      } catch (error) {
        spinner.fail('Erro ao executar testes')
        p.log.error(error.message)
      }
    })

  // =============================================================================
  // COMANDO: super-debug
  // =============================================================================
  program
    .command('super-debug [issue]')
    .description('Inicia debug sistemático')
    .option('-i, --issue <descricao>', 'Descrição do problema')
    .option('-l, --log <arquivo>', 'Analisar arquivo de log')
    .option('-r, --repro <passos>', 'Passos para reproduzir')
    .action(async (issue, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Debugging '))

      let issueDesc = options.issue || issue

      if (!issueDesc) {
        issueDesc = await p.text({
          message: 'Descrição do problema:'
        })

        if (p.isCancel(issueDesc)) {
          p.cancel('Operação cancelada')
          return
        }
      }

      p.log.info(`Iniciando debug sistemático: ${issueDesc}`)
      
      if (options.log) {
        p.log.info(`Analisando log: ${options.log}`)
      }

      if (options.repro) {
        p.log.info(`Reprodução: ${options.repro}`)
      }

      console.log(chalk.dim('\n(Siga o processo de 4 fases: Reproduzir → Isolar → Hipotetizar → Corrigir)\n'))
      console.log(chalk.dim('Use @systematic-debugging para execução completa\n'))
    })

  // =============================================================================
  // COMANDO: super-deploy
  // =============================================================================
  program
    .command('super-deploy [ambiente]')
    .description('Deploy para ambiente')
    .option('-v, --verify', 'Verificar após deploy')
    .option('--rollback <versao>', 'Rollback para versão')
    .option('--dry-run', 'Simular deploy')
    .action(async (ambiente, options) => {
      p.intro(chalk.bgGreen.black(' SuperCleudocode - Deploy '))

      const env = ambiente || 'staging'
      
      if (options.dryRun) {
        p.log.info(`[DRY RUN] Deploy para: ${env}`)
      } else {
        p.log.info(`Deploy para: ${env}`)
      }

      if (options.verify) {
        p.log.info('Verificação pós-deploy: habilitada')
      }

      if (options.rollback) {
        p.log.info(`Rollback para: ${options.rollback}`)
      }

      console.log(chalk.dim('\n(Configure CI/CD para deploy automatizado)\n'))
    })

  // =============================================================================
  // COMANDO: super-init
  // =============================================================================
  program
    .command('super-init [projeto]')
    .description('Inicializa projeto com SuperCleudocode')
    .option('-t, --template <nome>', 'Template: nodejs-api, react-app, python-api, fullstack', 'fullstack')
    .option('--skip-install', 'Pular instalação de dependências')
    .option('--no-git', 'Não inicializar git')
    .action(async (projeto, options) => {
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

        // Criar estrutura básica
        const dirs = [
          'src',
          'tests',
          'docs',
          'docs/plans',
          'scripts'
        ]

        for (const dir of dirs) {
          fs.ensureDirSync(join(projectPath, dir))
        }

        // Criar README
        fs.writeFileSync(
          join(projectPath, 'README.md'),
          `# ${projectName}\n\nProjeto criado com SuperCleudocode\n`
        )

        // Criar .gitignore
        fs.writeFileSync(
          join(projectPath, '.gitignore'),
          getDefaultGitignore()
        )

        spinner.succeed(`Projeto criado: ${projectPath}`)

        if (!options.skipInstall) {
          p.log.info('Instale dependências manualmente conforme necessário')
        }

        p.outro(chalk.green('✨ Projeto inicializado!'))
        
      } catch (error) {
        spinner.fail('Erro ao inicializar')
        p.log.error(error.message)
      }
    })
}

/**
 * Gerar Markdown do plano
 */
function generatePlanMarkdown(plan) {
  return `# Implementation Plan: ${plan.title}

**Date:** ${plan.date}
**Priority:** ${plan.priority}
**Status:** ${plan.status}

## Overview

${plan.title}

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

## Execution Order

\`\`\`
1 → 2 → 3 → 4
\`\`\`

## Approval

- [ ] Design reviewed
- [ ] Tasks are appropriately sized
- [ ] Dependencies are correct
- [ ] Verification steps are clear

**Approved by:** _______________
**Approved at:** _______________
`
}

/**
 * Gitignore padrão
 */
function getDefaultGitignore() {
  return `# Dependencies
node_modules/
vendor/
.venv/
venv/

# Build
dist/
build/
out/

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
`
}

export default registerSuperCleudocodeCommands

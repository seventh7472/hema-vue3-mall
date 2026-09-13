import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const DIST = resolve(ROOT, 'dist')
const REMOTE = 'https://github.com/seventh7472/hema-vue3-mall.git'
const BRANCH = 'gh-pages'

function run(cmd, cwd = DIST) {
  execSync(cmd, { cwd, stdio: 'inherit' })
}

function hasRemote() {
  try {
    execSync('git remote get-url origin', { cwd: DIST, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

if (!existsSync(resolve(DIST, 'index.html'))) {
  console.error('[deploy] 未找到 dist/index.html，请先执行 npm run build')
  process.exit(1)
}

// 双保险：进程 cwd 切到 dist，确保所有 git 命令只作用于 dist 仓库，绝不污染项目根仓库
process.chdir(DIST)

// vite build 会清空 dist（含 .git），需重新初始化独立仓库，避免 clone 依赖凭据交互
if (!existsSync(resolve(DIST, '.git'))) {
  run('git init -b ' + BRANCH)
}
if (!hasRemote()) {
  run('git remote add origin ' + REMOTE)
}

run('git add -A')
try {
  run('git commit -m "deploy: 盒马生鲜商城"')
} catch {
  console.log('[deploy] 无变更，跳过提交')
}
run(`git push -f origin ${BRANCH}`)
console.log('[deploy] 完成：https://seventh7472.github.io/hema-vue3-mall/')

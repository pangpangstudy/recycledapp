# 包工具

`yarn add -D prettier -w``--ignore-workspace-root-check`
将依赖项添加到工作空间的根目录，而不是特定的子包中。
`"format:check": "yarn format --check",`
检查代码是否符合 Prettier 的格式要求，但不会自动更改任何文件。如果格式不正确，会显示差异。
`"format:write": "yarn format --write"`
自动格式化代码，使其符合 Prettier 的格式要求，并覆盖文件。
`npx nx@latest init`
Nx 是一个用于构建和管理 Monorepo 的工具(依赖package.json的workspaces)，尤其适用于大型项目。它提供以下功能：

模块化开发：支持将项目拆分为多个独立模块或库。
依赖管理：自动处理模块之间的依赖关系。
任务执行：高效执行和缓存构建、测试、部署任务。
集成工具：与多个框架和工具（如 React、Angular、NestJS 等）集成良好。
增量构建：只重建和测试改动部分，提升开发效率。
Nx 帮助开发者更好地管理复杂的项目架构，提升开发体验。
Which scripts need to be run in order?

`build, lint, tsc`: 确定脚本的运行顺序，例如在构建项目之前需要运行哪些脚本。
Which scripts are cacheable?
`build, lint, tsc`
确定哪些脚本可以缓存，以提高效率。
Does the "build" script create any outputs?

`.next, dist, build`: 指定 "build" 脚本的输出目录，这些是相对于项目根目录的路径。
Does the "lint" script create any outputs?

`.`: 说明 "lint" 脚本没有生成特定的输出目录，通常不会创建持久文件。
Does the "test" script create any outputs?

`.`: 说明 "test" 脚本没有生成特定的输出目录，测试脚本通常不会创建持久文件。
这些信息用于配置 Nx 的缓存和构建逻辑，以优化项目管理。
`tsc --noEmit 的作用是让 TypeScript 编译器进行类型检查，但不输出编译结果。`
`npx husky-init`
Husky

Husky 是一个工具，用于在 Git 钩子（如 pre-commit、pre-push 等）上运行自定义脚本。它的主要作用是：

自动化检查：在提交代码之前自动运行 lint、测试或其他检查，确保代码质量。
增强团队协作：统一代码风格和质量标准，减少代码审查中的问题。
防止错误提交：在本地捕获问题，避免将不合格的代码推送到远程仓库。
预提交

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn validate
```

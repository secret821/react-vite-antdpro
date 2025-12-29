# AntD Pro Lite

基于 Vite + React + TypeScript + Ant Design Pro Components + tailwindv4 + @tanstack/react-query 的轻量级后台管理系统。

## 技术栈

- **Vite** - 构建工具
- **React 19** - UI 框架
- **TypeScript** - 类型系统
- **Ant Design 5** - UI 组件库
- **@ant-design/pro-components** - Pro 组件（ProLayout、ProTable 等）
- **React Router** - 路由管理
- **React Query** - 数据获取和状态管理
- **Zustand** - 状态管理（用于认证）
- **Tailwind CSS** - 工具类 CSS 框架
- **Axios** - HTTP 客户端

## 项目结构

```
src/
├── main.tsx              # 应用入口
├── router.tsx            # React Router 路由配置
├── index.css             # 全局样式（Tailwind）
├── lib/
│   └── cookies.ts        # Cookie 工具函数
├── stores/
│   └── auth-store.ts     # 认证状态管理（Zustand）
├── context/
│   └── AuthProvider.tsx  # 认证上下文提供者
├── layout/
│   └── ProShell.tsx      # ProLayout 布局组件
├── pages/
│   ├── LoginPage.tsx     # 登录页
│   ├── Dashboard.tsx     # 仪表盘
│   └── StockOrderList.tsx # 新股申购订单列表（示例）
└── services/
    └── stock.ts          # API 服务（示例）
```

## 功能特性

- ✅ 登录认证（基于 Cookie + Zustand）
- ✅ 路由守卫（未登录自动跳转）
- ✅ ProLayout 布局（侧边栏 + 顶部导航）
- ✅ ProTable 表格（搜索、排序、分页）
- ✅ React Query 数据管理
- ✅ Tailwind CSS 样式支持

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 登录说明

默认登录页面使用模拟数据，你可以：

1. 输入任意邮箱和密码
2. 登录后会生成模拟 token 和用户信息
3. Token 存储在 Cookie 中（key: `thisisjustarandomstring`）

## 自定义配置

### 修改 API 基础 URL

编辑 `src/services/stock.ts`，修改 `baseURL`：

```typescript
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})
```

### 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/router.tsx` 添加路由
3. 在 `src/layout/ProShell.tsx` 的 `menuData` 中添加菜单项

### 修改主题

编辑 `src/layout/ProShell.tsx`，修改 `ConfigProvider` 的 `theme` 属性。

## 注意事项

- 本项目使用 **Ant Design 5.x**（ProComponents 目前不支持 AntD 6.x）
- 认证 token 存储在 Cookie 中，与 `auth-store.ts` 保持一致
- API 服务使用模拟数据，实际项目中需要替换为真实接口调用

## License

MIT

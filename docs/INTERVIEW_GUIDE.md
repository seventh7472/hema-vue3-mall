# 盒马生鲜 · 面试复盘指南

> 一份为自己准备的面试「作弊小抄」。重点讲**原理、思路、话术**，不讲死代码。
> 使用建议：面试前通读一遍，把每部分的「一句话总结」背熟，遇到追问再展开。

---

## 第一部分：项目全局架构与数据流

### 1.1 目录结构是怎么设计的？各层如何配合？

项目的核心思路是**分层解耦**，让「数据」和「界面」互不直接依赖：

```
src/
├── api/          # 接口层：每个业务域一个文件，只负责「发请求」
│   ├── request.js   # axios 实例 + 自定义 adapter（mock 入口）
│   ├── home.js / category.js / user.js
├── mock/         # 数据层：本地假数据 + 路由表
│   ├── home.js / category.js / user.js
│   └── routes.js    # 把「URL → 数据」对应起来，模拟后端接口
├── store/        # 状态层：Pinia
│   └── modules/     # cart.js（购物车）、user.js（用户）
├── router/       # 路由层：懒加载 + keepAlive 配置
├── views/        # 页面层：home / category / cart / user 四个 Tab 页
├── components/   # 组件层：TabBar 等可复用组件
├── layouts/      # 布局层：TabBarLayout（keep-alive 的宿主）
└── utils/        # 工具层：format.js（金额）、asset.js（图片前缀）
```

**一句话总结**：`views` 只负责「画」，`store` 只负责「状态」，`api` 只负责「取数」，`mock` 只负责「造假数据」。页面永远不直接 import mock 数据，而是走 `api` 这一层——这是为了将来切真实后端时**一行业务代码都不用改**。

**面试话术（讲配合关系）**：

> "我做的时候刻意做了分层。页面组件里只调用 `api` 层封装好的函数，`api` 层内部是一个 axios 实例，我重写了它的 `adapter`，把请求路由到本地 mock 数据，还用 `setTimeout` 模拟了网络延迟。所以现在看起来是无后端的 Demo，但数据流和真实项目完全一致——哪天后端好了，我只要删掉这个 adapter、把 baseURL 指到真实域名，前端代码零改动。"

---

### 1.2 核心数据流闭环（加购 → 角标响应的完整链路）

这是整个项目最值钱的一条链路，务必能脱口而出：

```
用户点击「+」加购按钮
      │
      ▼
views/home 的 onAddCart(goods)
      │   调用 cartStore.addItem({ id, name, price, img })
      ▼
Pinia store 的 list（ref 数组）被修改
      │   ├─ 已存在 → count + 1
      │   └─ 不存在 → push 新对象（count=1, selected=true）
      ▼
pinia-plugin-persistedstate 拦截到 state 变化
      │   自动把整个 cart store 序列化写入 localStorage
      ▼
cartCount = computed(() => list.reduce(总件数))
      │   list 变了 → computed 自动重算 → 触发依赖它的视图更新
      ▼
TabBar 组件的 cartCount 同步更新 → 角标数字 +1
```

**关键点（面试官最想听的）**：

1. **单一数据源**：整个购物车只有 `cartStore.list` 一份数据，角标、购物车页、总价全部从它派生，不存在「多处各存一份、要手动同步」的问题。
2. **持久化是「被动」的**：我不需要在 `addItem` 里手动写 `localStorage.setItem`，是插件帮我在 state 变化后自动落盘的，业务代码里完全无感知。
3. **角标是「派生」的**：角标数字不是单独一个变量去 `+1`，而是 `computed` 从 list 算出来的——所以不管在哪加购、删购、清空，角标永远对。

**一句话总结**：**「改数据 → 自动落盘 → computed 自动派生 → 视图自动刷新」，全程没有一个手动同步的步骤。**

---

## 第二部分：核心技术深度拆解（结合代码）

### 2.1 CSS Variables 设计 Token 体系

**为什么做？**
传统做法里，颜色、字号、间距是散落在几百个组件里的「魔法数字」：`#00A9E0`、`14px`、`12px`……想改一个主题色，得全局搜索替换，还容易漏。所以我用 CSS 自定义属性把「设计变量」统一收敛到 `variables.css` 一份文件里。

**怎么做的？**
在 `:root` 上定义一整套 Token，按语义命名，而不是按色值命名：

```css
:root {
  --color-primary: #00A9E0;    /* 盒马蓝 · 主色 */
  --color-price:   #FF6A00;    /* 价格 · 橙 */
  --font-size-base: 14px;      /* 正文 */
  --space-md: 12px;            /* 间距 */
  --radius-round: 999px;       /* 胶囊圆角 */
}
```

组件里只写 `var(--color-primary)`，绝不写死色值。

**面试话术（怎么实现换肤）**：

> "我把颜色、字号、间距、圆角、层级全部抽成 CSS 变量，组件里只用 `var()` 引用。这样做换肤特别简单：比如要做暗黑模式，我不需要改任何组件，只要写一份 `[data-theme='dark'] { --color-primary: ...; --bg-page: ...; }` 覆盖同名变量，再在根节点切换 `data-theme` 属性，全站就一次性换肤了。这是 CSS 变量和 JS 变量最大的不同——它能参与级联、能被后代覆盖、还能被运行时动态改。"

**加分点**：
- 变量按**语义**命名（`--color-price` 而非 `--color-orange`），换主题时改的是「价格色是什么」，而不是「橙色改成什么」。
- 我把这套 Token 同时用在组件样式和**内联 style** 里（比如分类图标的渐变背景用了 `:style` 绑定），保证全局一致。

---

### 2.2 Pinia 持久化原理（pinia-plugin-persistedstate 是怎么生效的？）

**先说结论**：这个插件本质上是「**订阅 store 的变化，自动同步到 localStorage**」，是 Pinia 插件机制的一个典型应用。

**它靠两个机制生效**：

1. **Pinia 的插件机制**：`pinia.use(plugin)` 注册的插件，会在**每个 store 被创建时**拿到一个 context，里面有 store 实例和它的 `$subscribe` 方法。
2. **`$subscribe` 订阅**：插件内部对 store 做了 `store.$subscribe(...)`，只要 state 发生变化（不管是通过 action 还是直接改 ref），回调就会被触发，插件就 `JSON.stringify(state)` 后写入 localStorage。

**我的接入代码**（就三处）：

```js
// main.js —— 注册插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// cart.js —— 声明要持久化
export const useCartStore = defineStore('cart', () => {...}, { persist: true })
```

**面试话术**：

> "这个插件做的事，一句话就是：监听 state 变化，自动存进 localStorage。它利用 Pinia 的插件机制，在 store 创建时给它挂一个 `$subscribe` 订阅，state 一变就序列化写盘；应用启动、store 首次实例化时，它再从 localStorage 把上次的数据读回来做「水合」，覆盖初始值。所以我代码里只写了 `persist: true` 这一行，刷新不丢失就实现了。默认 key 就是 store 的 id（'cart'），存的是一份 JSON。"

**能体现深度的追问点**（如果面试官追问）：
- `$subscribe` 默认是**同步**触发的，每次改动都会立刻落盘——对这个体量完全够用。如果是高频更新场景，可以开 `debounce` 或按需只持久化部分字段（插件的 `pick`/`omit` 配置）。
- 序列化用的是 JSON，所以 store 里不能存 `Map`/`Set`/函数等 JSON 不支持的类型，只能存纯数据——这正是「状态与逻辑分离」的原因。

---

### 2.3 计算属性（computed）驱动视图 —— 为什么角标不用 watch 必须用 computed？

**先说结论**：角标是「**状态 A 的派生值**」，不是「独立的另一个状态」。这种场景 `computed` 是语义上唯一正确的选择，`watch` 是错的。

**核心区别**：

| | computed | watch |
|---|---|---|
| 本质 | **声明式**派生：`总件数 = 函数(list)` | **命令式**副作用：list 变了 → 我去干件事 |
| 有没有缓存 | 有，依赖不变不重算 | 无，每次触发都执行 |
| 是否同步求值 | 是，读它时就是最新值 | 默认异步（下次 tick），且需要额外变量承载结果 |
| 心智模型 | 我只关心「结果怎么算」 | 我要关心「变化后该做什么」 |

**用 watch 实现角标的反例**（体会它错在哪）：

```js
const list = ref([])
const cartCount = ref(0)              // 凭空多出一个「要手动维护的状态」

watch(list, (v) => {
  cartCount.value = v.reduce((s, i) => s + i.count, 0)   // 手动同步，容易漏、易出错
}, { deep: true, immediate: true })    // 还得考虑 immediate 和 deep 的坑
```

问题：`cartCount` 变成了一个「可能和 list 不同步」的第二个真相来源，且初始化、深度监听、异步时机全是坑。

**computed 的正确姿势**：

```js
const cartCount = computed(() =>
  list.value.reduce((sum, item) => sum + item.count, 0)
)
```

**面试话术**：

> "角标数字不是独立的数据，它是 list 的派生值，所以必须用 computed。computed 是声明式的——我只声明『总件数等于所有商品 count 之和』这个关系，list 一改它自动重算，而且有缓存、依赖不变不重算，读它永远是同步的最新值。如果用 watch，我就得手动维护第二个变量 cartCount，在回调里自己去同步，还要处理 immediate、deep 这些细节，既啰嗦又容易漏更新。一句话：『有来源的、能算出来的值』用 computed，『值变了要去干点啥副作用』才用 watch。"

---

### 2.4 `<keep-alive>` 路由缓存机制（include 和 meta 怎么配合？为什么滚动条不丢？）

**先说 `keep-alive` 干了什么**：
它是个抽象组件，包裹动态组件时，会在组件「切换离开」时把它**缓存起来而不是销毁**，下次切回来直接复用缓存的实例，跳过重新创建和挂载。所以组件的 `data`/滚动位置/输入框内容等**实例状态全部保留**——这就是「滚动条不丢」的根本原因（不是把滚动位置单独存了，而是整个 DOM 和状态根本没销毁）。

**我的实现分三步**：

**第一步：路由配置里打标记**

```js
{ path: 'home', name: 'Home', component: () => import('@/views/home/index.vue'),
  meta: { keepAlive: true, title: '首页' } }
```

**第二步：从路由表自动收集要缓存的组件 name**

```js
export const cachedViews = routes
  .flatMap((r) => r.children || [])
  .filter((r) => r.meta?.keepAlive && r.name)
  .map((r) => r.name)      // → ['Home', 'Category', 'Cart', 'Profile']
```

**第三步：在布局里用 include 精确控制缓存谁**

```vue
<router-view v-slot="{ Component }">
  <keep-alive :include="includeList">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

**三个关键细节（面试官爱追问）**：

1. **`include` 匹配的是组件 `name`，不是路由 name**——但这里我把两者做成了同名（`Home`/`Category`…），所以能对上。`<script setup>` 里组件默认不导出 name，我用 `defineOptions({ name: 'Home' })` 显式声明，否则匹配不上、缓存会失效。

2. **为什么用 `include` 而不是全缓存**：如果不用 include，`keep-alive` 会缓存所有进过 `<router-view>` 的组件，包括将来可能加的详情页、登录页，这些不该缓存，会造成内存浪费和「脏状态」。用 include 白名单，只缓存我要的那四个 Tab 页，精准。

3. **配合 `onActivated`/`onDeactivated`**：缓存组件切走时不是 `onUnmounted`，而是 `onDeactivated`。我在首页轮播里就利用这个——`onDeactivated` 里停掉 `setInterval` 定时器（避免切走后还在后台空转耗资源），`onActivated` 里再启动。这是「有缓存组件」和「无缓存组件」在生命周期上的关键差异。

**面试话术**：

> "核心 Tab 页我要的是「切走再切回，状态还在」——比如分类页翻到第三屏、购物车勾选了哪些商品，切走再回来应该原样保留。所以我给这四个路由打了 `meta.keepAlive` 标记，在布局的 `<router-view>` 外包一层 `<keep-alive :include="白名单">`。include 里放的是组件 name，我是从路由表里自动收集的，所以加新页面只要在 meta 上打个标就行，不用手动维护两份名单。滚动条不丢的原理，是 keep-alive 把整个组件实例连 DOM 一起缓存了，根本没销毁，所以状态自然在。"

---

### 2.5 金额计算如何处理浮点数精度问题

**问题本质**：JS 的数字是 IEEE 754 双精度浮点数，`0.1 + 0.2 !== 0.3`。电商金额如果直接拿「元」当浮点数累加，会出现 `19.9 + 0.1 = 20.000000000000004` 这种脏数据，结算时差一分钱都是事故。

**我的方案：金额一律以「分」为单位存整数，只在展示时转回元。**

```js
// 存：商品价格 price = 1290（代表 12.90 元），纯整数参与运算
const totalPrice = computed(() =>
  list.value.reduce((sum, item) => sum + (item.selected ? item.price * item.count : 0), 0)
)   // 全程整数乘法/加法，无任何精度损失

// 展示：最后一刻才把「分」格式化成「元」的字符串
export function formatPrice(fen = 0) {
  const yuan = Math.floor(fen / 100)
  const dec = String(fen % 100).padStart(2, '0')
  return `\u00A5${yuan}.${dec}`     // → ¥12.90
}
```

**面试话术**：

> "金额我全部用「分」作单位存整数，运算全程是整数乘加，天然没有浮点精度问题；只在最后渲染时用一个 `formatPrice` 把分转成 `¥12.90` 这种字符串。这样做有三个好处：一是整数运算零误差；二是『存』和『显示』彻底分离，后端要的分、前端要的元，只在边界做一次换算；三是不用引入 Decimal.js 这类库，代码更轻。这也是业界通行做法——微信、支付宝的接口金额字段都是『分』为单位的整数。"

**加分追问点**：
- 为什么不是 `toFixed(2)` 兜底？——`toFixed` 只是「显示层」四舍五入，内部累加时浮点误差已经产生了，治标不治本；整数分单位是「从源头」消灭误差。
- 大额场景还可用 BigInt 或 Decimal 库，但移动端购物车金额量级下，整数分完全够。

---

## 第三部分：高频面试官灵魂拷问与满分话术

> 以下话术都写成「口语」，想象你坐在面试桌前，看着面试官的眼睛说。括号里是临场应变提示。

---

### 问题 1：你为什么用 Pinia，不用 Vuex？它们有什么区别？

**满分话术**：

> "Vuex 是 Vue2 时代官方推荐的方案，但它在 TS 支持、模块嵌套、命名空间、写法繁琐度上都不太舒服——比如要写 mutation、commit 那一套。Pinia 是 Vue3 官方新推的状态库，我是从这几个维度选的：第一，它去掉了 mutation，直接改 state 就行，代码量明显更少；第二，它原生支持 TypeScript，类型推导很完整；第三，它没有 Vuex 那种嵌套模块 + namespace 的复杂度，一个 store 就是一个函数式的 `defineStore`，很扁平；第四，它对 Composition API 是天然友好的，我可以直接在 setup 里用。而且它体积更小、还内置了 DevTools 支持。另外我项目里用 `pinia-plugin-persistedstate` 做持久化也很顺，插件生态成熟。"

**追问应变**（如果问「那 Vuex 就一无是处吗」）：
> "也不是，Vuex 有它历史地位和大型老项目的存量，而且如果你的团队对 Vuex 已经很熟、项目又大又稳，迁移成本要评估。但新项目起 Vue3，我会直接上 Pinia，这是现在社区的主流选择。"

---

### 问题 2：你的购物车刷新后数据不丢失，具体怎么实现的？持久化的原理是什么？

**满分话术**：

> "我用的是 `pinia-plugin-persistedstate` 插件，在 store 的定义里加一个 `persist: true` 就实现了。它背后其实就两件事：写——插件通过 Pinia 的插件机制，在 store 创建时对它 `$subscribe`，只要 state 一变，就把 state 序列化成 JSON 写进 localStorage；读——应用启动、store 第一次被用到时，插件从 localStorage 读回数据覆盖初始值，叫『水合』。所以我的业务代码里完全不用手动写 `localStorage.setItem`，加购、改数量这些操作改的只是内存里的 state，落盘是插件自动帮我在背后做的。"

**追问应变**（如果问「为什么不直接手写 localStorage」）：
> "手写也能做，但要自己处理序列化、读回的时机、多 store 的 key 管理、以及什么时候清空，代码会散得到处都是。用插件把这套横切逻辑统一收口，业务里干净，也不容易漏。当然，插件底层也就是 localStorage 的封装，原理没变。"

**深度加分**：
> "另外这里有个细节——state 里只能存可被 JSON 序列化的纯数据，不能放函数、Map、Set，因为落盘是 JSON.stringify。这也是我 store 里只放 `list`、`token`、`userInfo` 这些数据、把 `addItem` 这些动作当函数导出、不混进去的原因。"

---

### 问题 3：讲讲 keep-alive 的原理，你是怎么配置的？为什么切走再切回滚动条还在？

**满分话术**：

> "keep-alive 是一个抽象组件，它包裹动态组件时，会把「切换离开」的组件缓存进内存而不是销毁，下次切回来直接复用缓存的实例，跳过重新创建和挂载。所以滚动条不丢，本质不是『把滚动位置单独存起来恢复了』，而是那个组件的整个实例和 DOM 压根没被销毁，状态自然还在。

> 我的配置是三步：第一，在路由的 `meta` 里给核心 Tab 页打 `keepAlive: true` 标记；第二，从路由表里自动收集这些打了标记的组件的 name，生成一个白名单数组；第三，在布局的 `<router-view v-slot>` 外面套 `<keep-alive :include="白名单">`。include 匹配的是组件 name，所以我在 `<script setup>` 里用 `defineOptions({ name })` 显式声明了 name，保证和路由 name 对得上，否则缓存会失效。

> 这里还有个体感很好的细节：缓存组件切走时触发的是 `onDeactivated` 而不是 `onUnmounted`，我在首页轮播里就利用它——切走时停掉轮播定时器，避免后台空转，切回来再重启。这也是 keep-alive 场景下生命周期管理的一个关键点。"

**追问应变**（如果问「缓存会不会有内存问题」）：
> "会，所以我用 include 白名单精准控制，只缓存那四个需要保留状态的 Tab 页，不缓存将来可能有的详情页、登录页。否则 keep-alive 会把所有进过 router-view 的组件都缓存，既费内存又可能带出脏状态。"

---

### 问题 4：金额计算为什么要用「分」，不用「元」的浮点数？

**满分话术**：

> "因为 JS 的数字是 IEEE 754 双精度浮点数，`0.1 + 0.2` 都不等于 `0.3`。如果拿『元』做浮点累加，会出现 `19.9 + 0.1 = 20.000000000000004` 这种结果，电商结算差一分钱都是线上事故。我的方案是金额全部以『分』为单位存整数，运算全程是整数乘加，天然零误差；只在最后展示的时候用一个 `formatPrice` 把分转成 `¥12.90` 的字符串。这样『存』和『显示』分离，边界只做一次换算，还不用引入 Decimal.js，代码更轻。这也是业界通行做法，微信支付宝的接口金额字段都是分单位的整数。"

**追问应变**（如果问「toFixed 不行吗」）：
> "`toFixed` 只是显示层做了四舍五入，但内部累加时浮点误差其实已经产生了，属于『事后补救』；用整数分是从『源头』消灭误差。而且 `toFixed` 还有银行家舍入、不同浏览器实现不一致的坑，不适合拿来做金额精度的最终方案。"

---

### 问题 5：路由懒加载是怎么做的？Vite 打包出来为什么会有多个 JS 文件？

**满分话术**：

> "我用的是动态 `import()`——路由组件写成 `component: () => import('@/views/home/index.vue')` 这种形式，Vite 在打包时就会把每个动态 import 拆成一个独立的 chunk。首屏只加载用户当前访问的那个页面对应的 JS，其他页面按需再加载，这样首屏体积小、白屏时间短。我连布局组件 TabBarLayout 也懒加载了，把首屏做到最精简。

> 打包出多个 JS 文件，本质是 Vite（底层 Rollup）的代码分割（code splitting）在起作用——它把「公共依赖」和「各个懒加载的页面」拆成不同的 chunk，一方面能按需加载，另一方面公共代码（比如 vue、pinia 这些）单独打一份，被多个页面复用，还方便浏览器做缓存。"

**追问应变**（如果问「懒加载有什么副作用」）：
> "首屏会多一次网络请求去拉对应 chunk，如果网络慢可能出现短暂 loading。所以要在「首屏速度」和「加载体验」之间权衡，通常会配合 loading 状态、以及把真正首屏必需的模块不打散。另外动态 import 返回的是 Promise，组件加载失败要有兜底处理（比如 error 边界或重试），这是生产环境要考虑的。"

---

## 附：临场速记卡（面试前 30 秒扫一眼）

| 话题 | 一句话结论 |
|---|---|
| 架构 | 五层分层：views 画 / store 状态 / api 取数 / mock 数据 / utils 工具，页面永远不直接碰 mock |
| 数据流 | 改数据 → 插件自动落盘 → computed 自动派生 → 视图自动刷新，零手动同步 |
| Token 换肤 | 变量语义化收敛到 `:root`，换肤 = 覆盖同名变量 + 切 `data-theme`，组件零改动 |
| Pinia 持久化 | 插件机制 + `$subscribe` 监听 state → JSON 写 localStorage，启动时水合读回 |
| computed vs watch | 有来源的派生值用 computed（声明式 + 缓存 + 同步）；「变了要干副作用」才用 watch |
| keep-alive | include 白名单匹配**组件 name**，缓存整个实例故滚动不丢，切走触发 onDeactivated |
| 金额精度 | 一律「分」整数运算，展示时才 `formatPrice` 转元，源头消灭浮点误差 |
| 懒加载 | 动态 `import()` → Vite/Rollup code splitting 拆 chunk，按需加载 + 公共代码复用缓存 |

> 记住这条主线，任何追问都能顺着它展开：**「数据是单一来源，视图是数据派生，持久化是自动副作用，缓存是实例复用。」**

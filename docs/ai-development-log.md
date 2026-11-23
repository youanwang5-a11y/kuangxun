# 「智核杯」AI 开发迭代记录

本日志保留用户 Prompt 和可核实的 AI 工具产出。版本变化可参照 [CHANGELOG](CHANGELOG.md)，本地 Git 历史提供提交时间和变更内容。

## 界面概念和设计反馈

- **使用的 AI 工具**　Codex、ImageGen。
- **AI 产出**　三张界面概念图，每张包含两个页面的桌面端与移动端布局。[生图工具实际提示词](../ui-concepts/imagegen-prompts.txt)和[概念图](design.md)已保留。广场概念图的一次工具迭代将结果数字改为「清除搜索条件」。
- **用户反馈及实际改动**　用户确认可以采用概念图，并指定项目品牌为「矿寻」。项目规范采用该名称，原始概念图作为过程记录保留。

<details>
<summary>用户 Prompt 原文</summary>

> # 中国矿业大学校园失物招领网站——界面概念设计
>
> 你是一名专业的 UI/UX 设计师，请为一款面向中国矿业大学学生的 AI 校园失物招领网站设计界面概念图。使用生图功能。
>
> ## 一、项目定位
>
> 网站主要帮助校园里的同学发布、寻找和认领丢失物品，同时为失物委员提供信息整理与协助发布的入口。
>
> 网站需要同时适配电脑端和移动端，整体设计应现代、美观、简洁，符合大学生的使用习惯。
>
> ## 二、基本功能
>
> **1. 首页**
>
> - 网站名称与导航栏
> - AI 智能搜索框
> - “我丢了东西”“我捡到了东西”两个主要按钮
> - 最新失物招领信息展示
>
> **2. 失物招领广场**
>
> - 卡片式展示寻物和招领信息
> - 支持分类、地点和时间筛选
> - 点击卡片查看详情
>
> **3. 信息发布页**
>
> - 选择发布寻物或招领信息
> - 上传物品图片，支持批量上传
> - 填写物品名称、地点、时间和描述
> - 预留 AI 图片识别与自动填写入口
>
> **4. 物品详情页**
>
> - 物品图片与详细信息
> - 发布者信息及失物委员身份标识
> - 联系发布者或申请认领按钮
>
> **5. 个人中心**
>
> - 我的发布
> - 我的消息
> - 我的认领记录
>
> **6. 失物委员工作台（融入到个人中心板块）**
>
> - 待处理信息
> - 信息整理与批量上传
> - 协助发布和转发入口
>
> ## 三、AI 功能的界面体现
>
> 在设计中适当体现以下 AI 功能：
>
> - AI 图片识别，辅助填写发布信息
> - 自然语言搜索，例如“昨天晚上在图书馆丢了一部手机”
> - 寻物与招领信息智能匹配
>
> 目前只需要设计功能入口和交互展示，不需要实现 AI 算法。
>
> ## 四、视觉设计要求
>
> 1. 采用现代、简洁、有设计感的 Web UI 风格，可以略微温馨可爱一点。
> 2. 注重排版、留白、字体层次、卡片样式和整体协调性。
> 3. 不要设计成传统学校教务系统或复杂的后台管理平台。
> 4. 可以自主发挥审美，设计具有辨识度的网站视觉风格。
> 5. 所有页面保持统一的设计语言，但允许根据页面功能采用不同布局。
> 6. 同时考虑电脑端和移动端的响应式效果。

</details>

## 项目规范和持续维护规则

- **使用的 AI 工具**　Codex。
- **AI 产出**　创建项目规范、范围、设计、版本变化、开发日志与忽略规则。
- **用户反馈及实际改动**　用户选择浏览器演示版与 Codex 提交署名，并明确要求每次功能迭代持续维护规范。将规范审查、更新、验证、提交和汇报列为每次迭代的完成条件。

<details>
<summary>用户 Prompt 原文</summary>

> 可以采用。
>
> ## 项目规范与 Git 版本管理
>
> 在正式开发「矿寻」V0.1 网站之前，请先完成以下项目初始化工作。
>
> ### 1. 创建项目规范文件
>
> 自动创建并维护：
>
> - `AGENTS.md`：Codex 开发规范，明确代码质量、组件复用、响应式设计、测试及修改原则。
> - `README.md`：项目介绍、功能、技术栈和运行方法。
> - `docs/requirements.md`：记录当前已确定的基本功能和开发范围。
> - `docs/design.md`：记录网站整体风格、页面结构和设计规范。
> - `.gitignore`：排除依赖、环境变量、构建产物等不应提交的文件。
>
> 规范应简洁、实用，避免创建过多没有实际用途的文档。
>
> ### 2. 初始化 Git
>
> - 检查当前项目是否已经存在 Git 仓库；如果没有，则自动初始化。
> - 创建初始提交。
> - 完成一个稳定的开发阶段后，自动创建一次 Git 提交。
> - 使用清晰的中文或英文提交说明。
> - 在重要版本创建 Git 标签，例如 `v0.1.0`、`v0.2.0`。
> - 修改代码前检查现有工作区，不覆盖用户未提交的修改。
> - 不执行破坏性的 Git 操作。
> - 暂时不需要自动推送远程仓库，除非我明确要求。
>
> ### 3. 维护项目记录
>
> 每完成一个阶段：
>
> - 更新相关项目文档。
> - 运行可用的构建或检查命令。
> - 确认项目能够正常运行。
> - 创建 Git 提交。
> - 简要向我汇报完成内容、当前版本和下一步计划。
>
> 另外创建一个简单的 `docs/CHANGELOG.md`，记录主要版本变化。
>
> ### 4. 比赛材料记录
>
> 由于项目将参加首届“智核杯”AI 创作大赛，请保留真实的开发迭代记录。
>
> 创建 `docs/ai-development-log.md`，按照以下格式记录重要开发阶段：
>
> - 使用的 AI 工具
> - 我提供的 Prompt
> - AI 生成或修改的内容
> - 我提出的修改意见及实际改动
>
> 无法确认的信息不要编造。Git 提交记录可以作为开发过程的辅助证明，但不能替代 Prompt 日志。
>
> ### 5. 继续开发网站
>
> 完成初始化后，按照此前的 V0.1 开发要求继续实现网站，不需要停下来等待我逐项确认。
>
> 优先保证网站页面完整、交互正常、PC 与移动端适配。
>
> 不要为当前项目引入不必要的复杂工程配置。

用户后续原文

> 每完成一次功能的更新或者迭代，需要更新规范文件，也就是说要持续维护。

</details>

## V0.1 应用视觉素材

- **使用的 AI 工具**　Codex、ImageGen。
- **用户要求及实际改动**　用户采纳概念设计并要求开发 V0.1。沿用校园图书馆、松绿色与真实物品照片的视觉方向，生成站点可用的图书馆插图与六宫格物品照片。[校园插图](../public/assets/campus-library.png) · [物品照片](../public/assets/item-photos.png)
- **图片工具提示词**　以下为 Codex 传给 ImageGen 的实际文本。用户实施 Prompt 见本日志的 V0.1 实现记录。

<details>
<summary>ImageGen 实际提示词</summary>

### 校园图书馆插图

Create a clean website hero illustration, 3:2 landscape, for a Chinese university campus lost-and-found app. Show a welcoming Chinese university library with cream stone walls and blue-grey glass, standing on the right, mature soft green trees framing the upper right, a sage-green lawn, and in the lower foreground a small stack of two books, a silver key on a teal ring and a simple folded scrap of paper. The library, trees and books are arranged as one compact cohesive landscape with interesting silhouette to the right and light negative space on left. Blue sky drawn only as a few faint wavy clouds, no gradient and no sky rectangle. Uniform flat very pale mint #e9f5ec background runs to every edge so it blends into a mint website panel, warm cream and dusty greens with muted ochre, sophisticated hand-painted editorial architectural illustration, gentle realistic detail, contemporary student-friendly warmth. NO WORDS or typography or letters on the building, no logos, no human figures, no frame or canvas border. Do not create a screenshot, produce the illustration asset alone.

### 物品照片

Create a 3:2 landscape product photography contact sheet for a university lost property website. Exact three equal columns and two equal rows, six totally separate edge-to-edge square photos with no gaps and no dividers, each object centered with ample clear breathing space (minimum ~18% on each side inside its own square) so each square functions as an independent product thumbnail. Top left: black front-screen smartphone in an olive green bumper case on warm pale oak desk, tilted diagonally, no emblem. Top middle: pastel blue university campus card, pale blue wave illustration across the bottom and simple abstract icon, no actual names/numbers and no readable lettering, on pale offwhite fabric. Top right: compact black folded travel umbrella with wrist loop, on a warm beige surface. Bottom left: open ivory-white wireless earbud charging case with two compact earbuds on pale warm stone. Bottom middle: two silver keys and one bottle-green circular keychain on oatmeal surface. Bottom right: upright sage-green insulated water tumbler with lid on light cream surface. Soft indirect daylight, tactile matte surfaces, lovely realistic details, consistent minimal studio product photography. No captions, no logos, no watermarks, no UI or outer frame. Straight-on photo framing for thumbnails (angled objects okay).

</details>

## V0.1 基础框架与交互

- **使用的 AI 工具**　Codex 生成和修改代码、文档与测试，并使用 Codex 浏览器工具验证本地站点。ImageGen 的视觉素材记录见上一节。
- **AI 产出**　基于概念图实现六个功能区、组件和响应式布局。完成本地搜索、筛选、选图、发布、留言、认领、身份切换和委员操作，使用 IndexedDB 持久化。
- **用户反馈及实际改动**　用户补充了 V0.1 的演示范围，要求关键词搜索、发布前预览和确认、AI 模拟标识以及委员 AI 整理。补齐这些入口和反馈，使用本地存储，按批准的技术方案保持零第三方依赖。

<details>
<summary>实施计划指令原文</summary>

> PLEASE IMPLEMENT THIS PLAN:
> # 「矿寻」V0.1 初始化、开发与持续维护
>
> ## 交付目标
>
> 在现有 `main` 分支交付可本机运行的「矿寻」浏览器演示版。采用已确认的概念设计，保留暖白底色、松绿色按钮和卡片布局，统一使用「矿寻」品牌。桌面端和移动端均可完成搜索、发布、认领和委员处理流程。
>
> ## 初始化与持续维护
>
> - 修改前检查工作区和暂存区，保留用户现有修改、三张概念图及生图提示词。创建 `AGENTS.md`、`README.md`、`.gitignore`，以及 `docs/requirements.md`、`docs/design.md`、`docs/CHANGELOG.md` 和 `docs/ai-development-log.md`。核对内容和引用后，建立初始提交 `初始化项目规范与设计资料`。
> - **在 `AGENTS.md` 写入迭代完成条件。** 每次功能新增、调整或修复，都要审查项目规范、更新受影响的文档、运行适用的检查、验证实际行为。功能与对应文档进入同一次提交。每个独立验收通过的迭代形成一次 Git 提交。
> - 功能范围或交互变化同步到 `requirements.md`，界面或响应式规则变化同步到 `design.md`，运行方式、技术栈或用户可见功能变化同步到 `README.md`，开发约定变化同步到 `AGENTS.md`。每次迭代都在 `CHANGELOG.md` 的「未发布」节留条目，发版时归入对应版本。
> - AI 参与的迭代同步记录实际工具、用户 Prompt 原文、AI 产出、用户反馈和落实结果。引用已保存的设计稿与生图提示词，标清用户输入和工具提示词。Git 提交可链接作为辅助证据。
> - 使用 `Codex <codex@local.invalid>` 执行本地提交，署名仅对相关命令生效。通过整体验收后创建附注标签 `v0.1.0`。每阶段简报完成内容、验证结果、提交、当前版本和下一步。远程推送须由用户明确要求。
>
> ## V0.1 实现
>
> 使用原生 HTML、CSS、JavaScript 模块和 Node.js 本地静态服务器。`npm start` 启动 `http://127.0.0.1:4173`。用哈希路由支持详情直达和浏览器返回，用 IndexedDB 保存演示记录与上传图片，并提供学生和失物委员两个演示身份。
>
> | 功能区 | 可操作行为 |
> |---|---|
> | 首页与广场 | 自然语言搜索、寻物和招领发布入口、最新信息卡片。广场支持组合筛选、清空条件和查看详情。 |
> | 发布与详情 | 切换寻物或招领，批量上传与移除图片，填写物品名称、地点、时间及描述。保存后进入详情，可查看发布者及委员标识、发送站内消息或申请认领。 |
> | 个人中心 | 查看我的发布、消息和认领记录。发布者可处理认领申请，申请人可查看处理结果。 |
> | 委员工作台 | 从个人中心进入。批量导入图片生成待整理条目，整理后带入发布表单，发布成功后移出待办。提供协助发布和复制转发文案入口。 |
>
> AI 功能用本地交互演示。搜索提取物品、地点和时间条件，图片识别提供可编辑的示例建议，智能匹配按类别、地点和时间展示相关候选。V0.1 数据保存在当前浏览器，真实账号、跨设备同步、AI 服务和部署留待后续版本。
>
> ## 检查与交付
>
> - 用 `npm run check` 执行语法检查和 Node 内置测试，覆盖筛选、搜索、匹配、发布校验和认领状态流转。启动站点并验证页面及资源可访问。
> - 在约 1440px 和 390px 的视口检查全部页面与核心流程，验证键盘操作、表单反馈、图片预览、窄屏布局，以及刷新后记录保留。验证重复认领有提示，存储失败时可保留表单并重试。
> - 每次迭代提交前核对功能、文档和日志是否一致。发版时核对版本记录、`v0.1.0` 标签及工作区状态，交付本地运行方法、验证结果和提交标识。

</details>

<details>
<summary>用户补充 Prompt 原文</summary>

> # 补充：中国矿业大学 AI 校园失物招领网站 V0.1
>
> ##
>
> **本阶段目标是实现网站基本框架、页面布局和基础交互，不要求实现完整的后端业务。**
>
> ## 二、设计要求
>
> 1. 严格参考之前生成并确定的界面概念图，尽可能还原其配色、排版、组件样式及整体视觉效果。
> 2. 如果概念图存在不合理的布局或交互，可以在保持原有设计语言的前提下适当优化。
> 3. 网站同时适配 PC 和移动端，采用响应式布局。
> 4. 保证页面之间的视觉风格统一，同时允许不同页面采用不同的内容排版。
> 5. 注重字体层次、间距、留白、图标、按钮反馈等细节。
> 6. 暂时不需要复杂动画，以自然流畅的基础交互为主。
> 7. 不要擅自大幅改变已经确定的界面风格。
>
> ## 三、网站基本页面
>
> ### 1. 首页
>
> 包含：
>
> - 网站 Logo、名称和导航栏。
> - AI 智能搜索框。
> - “我丢了东西”“我捡到了东西”两个主要入口。
> - 最新寻物和招领信息卡片。
> - 点击卡片可以进入对应详情页。
>
> ### 2. 失物招领广场
>
> 包含：
>
> - 寻物信息和招领信息展示。
> - 物品卡片列表。
> - 关键词搜索。
> - 物品类别、地点、时间筛选。
> - 点击卡片进入详情页。
>
> 使用合理的模拟物品数据填充页面，避免出现大量空白。
>
> ### 3. 信息发布页
>
> 包含：
>
> - “寻物”和“招领”两种发布类型。
> - 图片上传区域，支持多张图片选择和预览。
> - 物品名称、类别、地点、时间、描述等基础表单。
> - AI 图片识别与自动填写按钮。
> - 发布预览和确认按钮。
>
> 暂时使用模拟 AI 识别结果展示交互效果，明确标注模拟状态。
>
> 用户填写的内容应能够生成一条新的本地演示记录，并出现在失物招领广场和个人中心中。
>
> ### 4. 物品详情页
>
> 包含：
>
> - 物品图片。
> - 物品名称、类别、时间、地点和详细描述。
> - 发布者信息。
> - 普通用户或“失物委员”身份标识。
> - 联系发布者、申请认领等操作入口。
>
> 暂时使用模拟交互，不需要实现真实聊天。
>
> ### 5. 个人中心
>
> 包含：
>
> - 我的发布。
> - 我的消息。
> - 我的认领记录。
> - 已发布物品的基础状态展示。
>
> 使用模拟数据呈现完整界面，并支持查看自己在当前演示过程中发布的信息。
>
> ### 6. 失物委员工作台
>
> 包含：
>
> - 委员身份标识。
> - 待处理信息列表。
> - 信息整理与批量上传入口。
> - 协助发布和分享入口。
>
> 目前只需要搭建基本页面和交互框架，不需要开发完整的委员权限管理系统。
>
> 可以提供普通用户与失物委员的演示身份切换功能，方便展示不同界面。
>
> ## 四、基础交互要求
>
> 请确保网站不是只有外观的静态页面，而是能够实际点击体验。
>
> 至少实现以下交互：
>
> 1. 导航栏正常跳转。
> 2. 搜索输入与模拟结果筛选。
> 3. 分类和筛选功能正常工作。
> 4. 物品卡片进入详情页。
> 5. 寻物和招领发布类型切换。
> 6. 图片选择、上传预览和删除。
> 7. 表单填写、基础校验、预览和发布。
> 8. 新发布记录出现在列表中。
> 9. 个人中心查看已发布记录。
> 10. 普通同学和失物委员演示视角切换。
> 11. 基础按钮、弹窗和操作反馈。
>
> 对于本阶段尚未实现的功能，可以使用明确标注的模拟交互或“即将开放”提示，不要制作点击后毫无反应的按钮，也不要把模拟结果伪装成真实 AI 处理结果。
>
> ## 五、AI 功能暂时预留
>
> 本阶段不需要接入真实 AI 模型。
>
> 请为以下功能预留清晰的界面入口：
>
> - AI 图片识别与自动填写。
> - 自然语言智能搜索。
> - 寻物和招领信息智能匹配。
> - 失物委员 AI 信息整理。
>
> 可以使用固定演示数据模拟效果，确保后续能够方便地替换为真实 AI 接口。
>
> ## 六、技术与开发要求
>
> 1. 推荐使用 React + TypeScript + Tailwind CSS，也可以根据实际情况选择成熟、稳定的前端方案。
> 2. 采用组件化开发方式。
> 3. 将导航栏、搜索框、物品卡片、筛选组件、发布表单等设计为可复用组件。
> 4. 统一管理网站主题颜色、字体、间距、圆角等设计参数，方便后期美化。
> 5. 页面结构、模拟数据和业务逻辑尽量分离。
> 6. 本阶段可以使用 localStorage 保存演示数据，刷新页面后尽可能保留用户操作结果。
> 7. 不需要配置正式数据库、服务器端账号系统或真实 AI API。
> 8. 保证项目能够在本地正常启动，不出现明显运行错误。
> 9. 注意移动端适配，避免横向溢出、按钮过小、布局错乱等问题。
>
> ## 七、开发顺序
>
> 请按照以下顺序执行：
>
> **第一步：建立项目框架**
>
> 完成项目初始化、路由、全局样式及基础布局组件。
>
> **第二步：实现全部主要页面**
>
> 优先还原概念图，保证页面内容完整、风格统一。
>
> **第三步：连接页面交互**
>
> 实现搜索、筛选、详情、发布、个人中心等主要操作。
>
> **第四步：补充模拟数据**
>
> 使用符合中国矿业大学校园生活场景的示例信息填充网站，例如校园卡、雨伞、耳机、手机、水杯等。
>
> **第五步：检查响应式布局**
>
> 分别测试电脑端和手机端，修复布局及交互问题。
>
> **第六步：整体检查**
>
> 检查页面跳转、按钮反馈、数据展示、表单操作及运行情况，修复明显问题。
>
> ## 八、重要限制
>
> - 不要在这一阶段开发复杂的后端系统。
> - 不要自行扩展大量未提出的新功能。
> - 不需要实现完整的用户登录认证。
> - 不需要训练或部署 AI 模型。
> - 不要为了追求技术复杂度而牺牲界面质量。
> - 不要将本阶段制作成只有一个页面的静态展示。
> - 不要擅自推翻之前确定的界面概念图。
>
> ## 九、交付要求
>
> 完成后应提供：
>
> 1. 一个完整、可运行的前端项目。
> 2. 六个主要页面及必要的详情页面。
> 3. 能够正常操作的基础交互。
> 4. PC 和移动端适配。
> 5. 合理的模拟数据。
> 6. 清晰的项目目录和启动说明。
> 7. 简要说明已实现功能、模拟功能及尚未实现的功能。
>
> 如果当前环境允许，请直接启动开发服务器，在浏览器中检查页面效果，并修复发现的问题。
>
> ## 十、最终目标
>
> 当前版本为 **V0.1 基础框架版**。
>
> 最重要的是：
>
> **页面完整、视觉统一、交互顺畅、结构合理、方便后续修改。**
>
> 请以已经确定的界面概念图为主要设计依据，直接开展开发工作。
>
> 这一阶段不需要过度追求复杂功能，也不需要进行最终的视觉精修。
>
> 后续我们会继续迭代 AI 功能、失物委员协作机制，并对整个网站进行统一的 UI/UX 美化。

</details>

- **实际验证**　Node 语法检查和 8 项测试通过。使用本地浏览器验证 1440px 与 390px 下六个功能区的无横向溢出，走通关键词及 AI 搜索、模拟留言、认领处理、多图发布并刷新、委员收件和整理发布。存储写入失败与重试用自动化测试模拟。

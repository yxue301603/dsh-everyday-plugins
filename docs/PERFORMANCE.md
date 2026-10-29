# 长对话性能回归 / Long-chat performance

用户报告长对话滚动卡住、输入变慢，停用插件后恢复。本次检查定位到插件后台对整段历史的重复处理，并针对这些路径增加回归。下述数字来自合成宿主，不代表所有机器、所有 DSH 版本的实际速度。

## 已测结果

`scripts/test-performance.mjs` 在同一份 **production React 合成宿主**中分别加载：停用插件、冻结的旧版 **0.1.1 实际客户端**、当前实际预构建客户端。它增加 1,000 条提问与 1,000 条回答，加上固定测试消息后共有 1,002 条提问；在工具面板关闭时发送 30 次流式更新，再模拟用户滚动和连续输入更新。

以下是同一轮 `artifacts/performance-results.json` 的记录：

| 指标 / Metric | 停用 / Disabled | 旧版 0.1.1 / Baseline | 修复版 / Fixed |
| --- | ---: | ---: | ---: |
| 全局聊天行查询 / Global chat-row queries | 0 | 1,002 | 0 |
| 元素矩形读取 / Element rectangle reads | 0 | 499 | 1 |
| 记录到的长任务 / Observed long tasks | 0 | 1 次，540ms | 0 |
| 30 次流式更新中的节点读取 / Node reads over 30 stream updates | 30 | 60,120 | 30 |

这里的查询计数特指 `document.querySelectorAll` 中包含 `data-chat-*` 的查询；矩形计数特指 `Element.getBoundingClientRect`。长任务使用浏览器 `PerformanceObserver` 的 `longtask` 记录；没有长任务不等于主线程完全没有工作。

节点计数包含宿主每次流式更新所需的一次读取，因此停用插件也有 30 次。修复版回到这一宿主基线，不能把这 30 次都算作插件额外开销。阅读位置仍有保存，测试没有提交消息，也没有 JavaScript 错误。

计时受机器、浏览器、系统负载和冷热状态影响。未将其他轮次的冷启动长任务拼入这张表，也不据此宣称固定加速倍数。

脚本另使用 `pressSequentially` 真实浏览器键盘事件补测，检查输入结果是否完整，并记录总耗时。本轮结果如下，完整字段保留在运行报告中。


真实键盘补测：同轮每组通过浏览器 `pressSequentially` 输入 30 个字符、每字符指定间隔 25ms。耗时分别为停用 **943ms**、旧版 **1488ms**、修复版 **995ms**，三组完整文本都保留。此数值包含浏览器自动化开销；比较同轮结果，不作为真实用户的每键延迟承诺。修复版采样间隔最大 **18.2ms**，停用 **17.9ms**，旧版 **540.9ms**。

## 根因与修复

### 滚动后的平方级历史查找

旧版阅读位置 Observer 为每条提问调用一次全局锚点查找；每次查找又枚举整页聊天行，再为候选读取布局。当提问数量与已渲染行数一起增长时，这条路径接近 **O(提问数 × 页面行数)**，即长对话中的 **O(n²)**。即使滚动处理延迟了 450ms，延迟结束后的整段工作仍同步占用主线程，足以挡住随后输入。

现在只在确认用户滚动当前会话后取样，使用少量视口点命中消息行，再从原生 Chat 身份解析对应提问。常规命中路径不枚举全页历史；空白间隙的降级查找限定在当前滚动区，并限制布局读取预算。程序自动跟随生成、代码块滚动和其他会话不会反复重写阅读位置。

### 面板关闭后仍消费全部流式历史

旧版目录后台订阅整个 Chat 快照，每次回答增量都重新解析全部消息；面板未打开也支付这笔成本。现在提问列表只在面板打开时订阅，保留稳定提问的增量缓存。后台阅读监听不订阅全量 Chat，也不因每个生成 token 扫描历史。

### 其他后台成本

- 选文操作合并为窗口内单组、按会话登记的监听。输入框中的折叠选区、重复选区和无关滚动尽早退出；被动监听不阻止原生滚动。
- 草稿历史仅订阅原始草稿文本与自动记录开关。暂停输入 900ms 后安排空闲写入，空闲回调有 1,500ms 超时；误清空、会话切换、页面关闭和卸载仍立即保存待记录文本，不降低原有容量上限。
- 本地存储缓存已经校验过的原始 JSON；写前仍检查跨标签页变化。相同内容不重复写盘或发布更新，损坏数据和写入失败继续提示。
- 提醒只处理原生事件增量并缓存轮次，不为流式状态或结束回退展开整段历史；未变化的会话状态不反复生成对象。
- 共用样式在同一窗口去重，避免安装整套时多份相同样式增加浏览器样式处理；最后一个使用者卸载时释放。

以上是修复的路径说明。对比表衡量整套插件的合计结果，没有把合计差异归功于某一项未单独计时的修改。

## 自行复现

在仓库根目录使用 Node.js 24。先安装开发依赖和浏览器，并生成当前客户端：

```sh
npm ci
npx playwright install chromium
npm run build
```

从保留旧版客户端的提交提取基线。下面直接写入 Git 返回的字节，保留 UTF-8，避免 Windows shell 重定向把 JavaScript 转成 UTF-16：

```sh
node --input-type=module -e "import {execFileSync} from 'node:child_process'; import {mkdirSync,writeFileSync} from 'node:fs'; mkdirSync('.cache',{recursive:true}); writeFileSync('.cache/perf-baseline-0.1.1.js',execFileSync('git',['show','a2abe34f987502a8f5dfc27929ee9da9e50c6424:lib/client.js'],{maxBuffer:20971520,windowsHide:true}));"
node scripts/test-performance.mjs
```

需要本地 Git 历史包含该提交。报告写入忽略提交的 `artifacts/performance-results.json`；确认其中同时存在 `disabled`、`baseline` 和 `fixed` 三组。基线文件不存在时脚本会跳过该组，这种结果不能用作修复前后对比。

可通过 `DSH_PERF_BASELINE` 指定另一份冻结的旧客户端，`DSH_PERF_HISTORY` 调整合成提问/回答对数量（100–5,000），`DSH_TEST_BROWSER_EXECUTABLE` 指定浏览器可执行文件。`DSH_PERF_OBSERVE_ONLY` 仅用于观察时跳过性能断言；发布回归应保留断言。

脚本使用独立的无界面浏览器和合成会话，不连接个人 DSH profile，不读取个人消息，不调用模型。它会输出浏览器版本、客户端 SHA256、流式与输入计数、主线程计时和错误；性能断言同时检查闭面板历史处理、查询与布局预算、阅读位置保存。

## 范围与边界

- 这是实际客户端运行于合成宿主的浏览器回归，不是原生 DSH 中运行长对话、真实模型或工具的端到端测速。
- 合成宿主渲染约两千条消息行；实际 DSH 的虚拟列表、文件预览、模型输出形态和扩展组合可能不同。
- 程序化输入更新、真实键盘输入和原生宿主兼容性是不同检查，不能互相替代；没有测量操作系统通知送达或文件管理器启动速度。
- 功能、损坏存储、生命周期及调度语义由相应模型与浏览器测试覆盖；原生 DSH 适配结果及最终检查记录见[验证说明](VERIFICATION.md)。本页不把尚未完成的原生复验写成已通过。

## English summary

Users reported stalls while scrolling and typing in long conversations. The old reader performed a global row lookup for every question, and each lookup walked the page's chat rows: **O(questions × rendered rows)**, approaching **O(n²)**. The closed outline also rebuilt its question list on every streaming Chat update.

The fix uses user-intent-gated, session-scoped hit-testing with a bounded layout fallback; subscribes to question data only while the panel is open; shares passive selection listeners; narrows draft subscriptions and defers routine writes to bounded idle work; caches validated storage JSON; consumes alert event deltas; and deduplicates shared styles. Clear, switch, pagehide and disposal still flush draft history, with storage limits unchanged.

The table reports one matched run using production React, a synthetic long chat, and the actual frozen **0.1.1** and current client bundles. Disabled-mode node reads belong to the host, not the plugin. No observed long task does not mean zero main-thread work, and runs from different cold/warm conditions are not combined into a speedup claim. A real-keyboard probe has been added to the script; its final results should be read from the latest report.

Use the commands above to extract the baseline as unchanged Git bytes, build the current client and run `node scripts/test-performance.mjs`. Keep all three modes in the report. This test uses a separate headless browser, synthetic messages and no model calls or personal DSH profile. It does **not** establish real-model long-chat performance or native-host compatibility; see [verification notes](VERIFICATION.md) for those separately scoped checks.

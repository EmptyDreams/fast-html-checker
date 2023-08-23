## 快速开始

使用如下代码检查 HTML 内容：

```javascript
const HTMLChecker = require('fast-html-checker')

const htmlContent = '<a href="https://kmar.top/"></a>'
const result = HTMLChecker.check(htmlContent, {
    allowTags: ['a']
})  // undefined
```

当 `check` 函数返回 `undefined` 时表示检查通过，不存在非法元素，若返回一个非空字符串则表示发现了非法元素，字符串内容用来标明非法的原因。

## 配置项

调用 `check` 时第二个参数为配置项：

```typescript
export type CheckResult = string | undefined
export type ElementChecker = (element: HTMLElement) => CheckResult

export interface CheckerOptional {

    /** 允许的标签列表 */
    allowTags: (TagItemInfo | string)[],
    /** 元素内容检查器 */
    checkers?: {[propName: string]: ElementChecker}

}

export interface TagItemInfo {

    /** 标签名称 */
    name: string,
    /** 允许的 attr */
    allowAttrs: {
        [key: string]: ((content: string) => CheckResult) | undefined | null
    }

}
```

当 `allowTags` 的值为 `string` 类型时标明允许所有的 `attr`，传入 `TagItemInfo` 类型来对 `attr` 进行验证。

`allowAttrs` 中的 `key` 为 `attr` 的名称，`value` 为内容检查器，传入 `undefined` 或 `null` 表明允许任何内容。
import {HTMLElement} from 'fast-html-parser'
import * as HTMLParser from 'fast-html-parser'

export type CheckResult = string | undefined

/** 检查指定 HTML 内容 */
export function check(content: string, optional: CheckerOptional): CheckResult {
    let html: HTMLElement
    try {
        html = HTMLParser.parse(content, {
            style: true,
            script: true
        })
    } catch (e) {
        return 'HTML 解析失败'
    }
    /** 检查元素的头部信息 */
    function checkElementHead(element: HTMLElement): CheckResult {
        for (let item of optional.allowTags) {
            if (typeof item === 'string') {
                if (element.tagName === item) return undefined
            } else if (element.tagName === item.name) {
                for (let attrName in element.attributes) {
                    if (!(attrName in item.allowAttrs)) return `${element.tagName} 的 ${attrName} 属性不在白名单中`
                    const attrChecker = item.allowAttrs[attrName] ?? defaultAttrChecker
                    const result = attrChecker(element.attributes[attrName])
                    if (result) return result
                }
                return undefined
            }
        }
        return `${element.tagName} 不在白名单中`
    }
    function checkElement(list: HTMLElement[]): CheckResult {
        for (let item of list) {
            const headCheckResult = checkElementHead(item)
            if (headCheckResult) return headCheckResult
            const contentChecker = optional.checkers[item.tagName]
            if (contentChecker) {
                const result = contentChecker(item)
                if (result) return result
            }
        }
        return undefined
    }
    return checkElement(html.childNodes)
}

/** 缺省的 attr 检查器 */
export const defaultAttrChecker = () => undefined

/** 元素检查器 */
export type ElementChecker = (element: HTMLElement) => CheckResult

export interface CheckerOptional {

    /** 允许的标签列表 */
    allowTags: (TagItemInfo | string)[],
    /** 元素内容检查器 */
    checkers: {[propName: string]: ElementChecker}

}

export interface TagItemInfo {

    /** 标签名称 */
    name: string,
    /** 允许的 attr */
    allowAttrs: {
        [key: string]: ((content: string) => CheckResult) | undefined | null
    }

}
import { REACT_TEXT } from "./constants";

/**
 * 把虚拟DOM转成真实的DOM并插入到容器中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container) {
    let newDOM = createDOM(vdom);
    container.appendChild(newDOM);
}
/**
 * 把虚拟DOM转成真实的DOM
 * @param {*} vdom 
 */
function createDOM(vdom) {
    let { type, props } = vdom;
    let dom;
    if (type === REACT_TEXT) {
        dom = document.createTextNode(props)
    } else if (typeof type === "function") {
        if (type.isReactComponent) {
            return mountClassComponent(vdom);
        } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type)
    }
    if (props) {
        updateProps(dom, {}, props)
        if (props.children && typeof props.children === "object" && props.children.type === REACT_TEXT) {
            render(props.children, dom)
        } else if (Array.isArray(props.children)) {
            reconcileChildren(props.children, dom)
        }
    }
    vdom.dom = dom;
    return dom
}
/**
 * 挂载class组件
 * @param {*} vdom 
 */
function mountClassComponent(vdom) {
    const { type: ClassCom, props } = vdom;
    const classInstance = new ClassCom(props);
    let renderVdom = classInstance.render();
    //把类组件渲染的虚拟dom保存在类的实例上
    classInstance.oldRenderVdom = renderVdom;
    const dom = createDOM(renderVdom);
    return dom
}
/**
 * 挂载函数式组件
 * @param {*} vdom 
 */
function mountFunctionComponent(vdom) {
    const { type: fn, props } = vdom;
    const renderVdom = fn(props);
    vdom.oldRenderVdom = renderVdom;
    const dom = createDOM(renderVdom);
    return dom
}
function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        render(childrenVdom[i], parentDOM);
    }
}
/**
 * 根据虚拟dom查找对应的真实dom
 * @param {*} vdom 
 * @returns 
 */
export function findDOM(vdom) {
    if (!vdom) return null;
    if (vdom.dom) {
        return vdom.dom;
    } else {
        const renderVdom = vdom.oldRenderVdom;
        return findDOM(renderVdom);
    }
}
/**
 * 对比
 * @param {*} parentDOM 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
    const oldDOM = findDOM(oldVdom);
    const newDOM = createDOM(newVdom);
    parentDOM.replaceChild(newDOM, oldDOM);
}
/**
 * 将新的属性同步到真实DOM上
 * @param {*} dom 
 * @param {*} oldProps 
 * @param {*} newProps 
 */
function updateProps(dom, oldProps = {}, newProps = {}) {
    for (const key in newProps)
        if (key === "children") {
            continue;
        } else if (key === "style") {
            const styleObj = newProps[key]
            for (const attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        } else if (/^on[A-Z].*/.test(key)) { //处理事件
            dom[key.toLowerCase()] = newProps[key];
        } else {// id  className ...其他属性
            dom[key] = newProps[key]
        }
    // 处理删除属性   
    for (const key in oldProps) {
        if (!newProps.hasOwnProperty(key)) {
            delete dom[key]
        }
    }
}
const ReactDOM = {
    render
}
export default ReactDOM


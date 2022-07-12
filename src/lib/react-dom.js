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
    return createDOM(renderVdom)
}
/**
 * 挂载函数式组件
 * @param {*} vdom 
 */
function mountFunctionComponent(vdom) {
    const { type: fn, props } = vdom;
    const renderVdom = fn(props);
    return createDOM(renderVdom)
}
function reconcileChildren(childrenVdom, parentDOM) {
    for (let i = 0; i < childrenVdom.length; i++) {
        render(childrenVdom[i], parentDOM);
    }
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


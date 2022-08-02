import { REACT_FORWARD_REF_TYPE, REACT_TEXT } from "./constants";
import { addEvent } from './event';
/**
 * 把虚拟DOM转成真实的DOM并插入到容器中
 * @param {*} vdom 
 * @param {*} container 
 */
function render(vdom, container) {
    let newDOM = createDOM(vdom);
    container.appendChild(newDOM);
    if (newDOM.componentDidMount) newDOM.componentDidMount();
}
/**
 * 把虚拟DOM转成真实的DOM
 * @param {*} vdom 
 */
function createDOM(vdom) {
    let { type, props, ref } = vdom;
    let dom;
    if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
        return mountForwardComponent(vdom);
    } else if (type === REACT_TEXT) {
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
    if (ref) ref.current = dom;
    return dom
}
/**
 * 挂载forwardRef转发组件
 * @param {*} vdom 
 */
function mountForwardComponent(vdom) {
    const { type, props, ref } = vdom;
    const renderVdom = type.render(props, ref);
    vdom.oldRenderVdom = renderVdom;
    const dom = createDOM(renderVdom);
    return dom
}
/**
 * 挂载class组件
 * @param {*} vdom 
 */
function mountClassComponent(vdom) {
    const { type: ClassCom, props, ref } = vdom;
    const classInstance = new ClassCom(props);
    vdom.classInstance = classInstance;
    if (ref) ref.current = classInstance;
    if (classInstance.componentWillMount) classInstance.componentWillMount();
    let renderVdom = classInstance.render();
    //把类组件渲染的虚拟dom保存在类的实例上
    classInstance.oldRenderVdom = renderVdom;
    const dom = createDOM(renderVdom);
    // 这里是把方法绑定在 dom 上，就可以在 render 时获取到了
    if (classInstance.componentDidMount) dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
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
        const renderVdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom;
        return findDOM(renderVdom);
    }
}
/**
 * 对比
 * @param {*} parentDOM 
 * @param {*} oldVdom 
 * @param {*} newVdom 
 * @param {*} nextDOM 
 */
export function compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM) {
    if (!oldVdom && !newVdom) {//老和新都是没有
        return
    } else if (!!oldVdom && !newVdom) {//老有新没有要卸载
        unMountVdom(oldVdom);
    } else if (!oldVdom && !!newVdom) {//老没有新的有，要新增
        const newDOM = createDOM(newVdom);
        if (nextDOM) {
            parentDOM.insertBefore(newDOM, nextDOM)
        } else {
            parentDOM.appendChild(newDOM)
        }
        if (newDOM.componentDidMount) newDOM.componentDidMount();
    } else if (!!oldVdom && !!newVdom && oldVdom.type !== newVdom.type) {
        //新老都有，但类型不同
        const newDOM = createDOM(newVdom);
        unMountVdom(oldVdom);
        if (newDOM.componentDidMount) newDOM.componentDidMount();
    } else {
        updateElement(oldVdom, newVdom);
    }
}
function unMountVdom(vdom) {
    const { props, ref } = vdom;
    const currentDOM = findDOM(vdom);//获取此虚拟DOM对应的真实DOM
    //vdom可能是原生组件span 类组件 classComponent 也可能是函数组件Function
    if (vdom.classInstance && vdom.classInstance.componentWillUnmount) {
        vdom.classInstance.componentWillUnmount();
    }
    if (ref) {
        ref.current = null;
    }
    debugger
    //如果此虚拟DOM有子节点的话，递归全部删除
    if (props.children) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        children.forEach(unMountVdom);
    }
    //把自己这个虚拟DOM对应的真实DOM从界面删除
    if (currentDOM) currentDOM.remove();
}
function updateElement(oldVdom, newVdom) {
    const currentDOM = newVdom.dom = findDOM(oldVdom);
    if (oldVdom.type === REACT_TEXT) {
        if (oldVdom.props !== newVdom.props) {
            currentDOM.textContent = newVdom.props;
        }
    } else if (typeof oldVdom.type === 'string') {
        updateProps(currentDOM, oldVdom.props, newVdom.props);
        updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    } else if (typeof oldVdom.type === 'function') {
        if (oldVdom.type.isReactComponent) {
            updateClassComponent(oldVdom, newVdom);
        } else {
            updateFunctionComponent(oldVdom, newVdom);
        }
    }
}
function updateFunctionComponent(oldVdom, newVdom) {
    let currentDOM = findDOM(oldVdom);
    if (!currentDOM) return;
    let parentDOM = currentDOM.parentNode;
    let { type, props } = newVdom;
    let newRenderVdom = type(props);
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, newRenderVdom);
    newVdom.oldRenderVdom = newRenderVdom;
}
function updateClassComponent(oldVdom, newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance;
    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps(newVdom.props);
    }
    classInstance.updater.emitUpdate(newVdom.props);
}
function updateChildren(parentDOM, oldVChildren, newVChildren) {
    oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : oldVChildren ? ([oldVChildren]).filter(item => item) : [];
    newVChildren = Array.isArray(newVChildren) ? newVChildren : newVChildren ? ([newVChildren]).filter(item => item) : [];
    const maxLength = Math.max(oldVChildren.length, newVChildren.length);
    for (let i = 0; i < maxLength; i++) {
        const nextVdom = oldVChildren.find((item, index) => index > i && item && findDOM(item));
        compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVdom && findDOM(nextVdom));
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
        } else if (key.startsWith('on')) { //处理事件
            addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
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


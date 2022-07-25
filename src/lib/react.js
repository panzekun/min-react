import { Component } from "./Component";
import { REACT_ELEMENT, REACT_FORWARD_REF_TYPE } from "./constants";
import { wrapToVdom } from "./utils";

/**
 *  创建react元素
 * @param {*} type 
 * @param {*} config 
 * @param  {...any} children 
 */
function createElement(type, config, children) {
    let ref;
    let key;
    if (config) { //删除无用的数据，让数据结构看起来更干净
        delete config.__source;
        delete config.__self;
        ref = config.ref;
        key = config.key;
    }
    let props = { ...config };
    if (arguments.length > 3) { //说明有多个子元素，
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
    } else {
        props.children = wrapToVdom(children);
    }
    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
        ref,
        key,
    }
}
function createRef() {
    return { current: null }
}
function forwardRef(render) {
    const elementType = {
        $$typeof: REACT_FORWARD_REF_TYPE,
        render: render
    }
    return elementType
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef,
}

export default React
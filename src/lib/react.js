import { REACT_ELEMENT } from "./constants";
import { wrapToVdom } from "./utils";

/**
 *  创建react元素
 * @param {*} type 
 * @param {*} config 
 * @param  {...any} children 
 */
function createElement(type, config, children) {
    if (config) { //删除无用的数据，让数据结构看起来更干净
        delete config.__source;
        delete config.__self
    }
    let props = { ...config };
    if (arguments.length > 3) { //说明有多个子元素，
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom)
    } else {
        props.children = wrapToVdom(children); 
    }
    console.log(props)
    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
    }
}

const React = {
    createElement
}

export default React
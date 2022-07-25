import { updateQueue } from './Component';
/**
 * 所有事件绑定到document上
 * @param {*} dom 
 * @param {*} eventType 
 * @param {*} handler 
 */
export function addEvent(dom, eventType, handler) {
    let store = dom.store || (dom.store = {}); //dom上面绑定个store属性用来存储用户的事件函数
    store[eventType] = handler;
    if (!document[eventType]) {
        document[eventType] = dispatchEvent;
    }
}
function dispatchEvent(event) {
    let { target, type } = event;
    let eventType = `on${type}`;
    let syntheticEvent = createSyntheticEvent(event);
    updateQueue.isBatchingUpdate = true;
    while (target) {//模拟冒泡
        let { store } = target;
        let handler = store && store[eventType]
        handler && handler(syntheticEvent);
        //在执行handler的过程中有可能会阻止冒泡
        if (syntheticEvent.isPropagationStopped) {
            break;
        }
        target = target.parentNode;
    }
    updateQueue.batchUpdate();
}
function createSyntheticEvent(nativeEvent) {
    let syntheticEvent = {};
    for (let key in nativeEvent) {//把原生事件上的属性拷贝到合成事件对象上去
        let value = nativeEvent[key];
        if (typeof value === 'function') value = value.bind(nativeEvent);
        syntheticEvent[key] = nativeEvent[key];
    }
    syntheticEvent.nativeEvent = nativeEvent;
    syntheticEvent.isDefaultPrevented = false;
    syntheticEvent.isPropagationStopped = false;
    syntheticEvent.preventDefault = preventDefault;
    syntheticEvent.stopPropagation = stopPropagation;
    return syntheticEvent;
}

function preventDefault() {
    this.defaultPrevented = true;
    const event = this.nativeEvent;
    if (event.preventDefault) {
        event.preventDefault();
    } else {//IE
        event.returnValue = false;
    }
    this.isDefaultPrevented = true;
}

function stopPropagation() {
    const event = this.nativeEvent;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {//IE
        event.cancelBubble = true;
    }
    this.isPropagationStopped = true;
}
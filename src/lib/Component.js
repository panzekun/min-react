import { findDOM, compareTwoVdom } from "./react-dom";
export const updateQueue = {
    isBatchingUpdate: false,//是否批量更新
    updaters: new Set(),
    batchUpdate() {
        updateQueue.isBatchingUpdate = false;
        for (var updater of updateQueue.updaters) {
            updater.updateComponent();
        }
        updateQueue.updaters.clear();
    }
}
class Updater {
    constructor(componentInstance) {
        this.classInstance = componentInstance;
        this.pendingStates = []; //缓存修改的所有状态
        this.callbacks = []; //状态更新后的回调
        this.nextProps = null;
    }
    addState(partialState, callback) {
        this.pendingStates.push(partialState);///等待更新的状态
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
        this.emitUpdate()
    }
    emitUpdate(nextProps) {
        this.nextProps = nextProps;
        if (updateQueue.isBatchingUpdate) {
            updateQueue.updaters.add(this);
        } else {
            this.updateComponent()
        }
    }
    /**
     * 更新视图
     * 1、计算新的组件状态
     * 2、重新执行组件的render方法，拿到最新的虚拟dom
     * 3、把新的虚拟dom同步到页面的真实dom上
     */
    updateComponent() {
        const { classInstance, pendingStates } = this;
        if (this.nextProps || pendingStates.length > 0) {
            shouldUpdate(classInstance, this.nextProps, this.getState());
        }
    }
    getState() {
        const { classInstance, pendingStates } = this;
        let { state } = classInstance;
        pendingStates.forEach(nextState => {
            if (typeof nextState === 'function') {
                nextState = nextState(state)
            }
            state = { ...state, ...nextState };//合并更新数据
        })
        pendingStates.length = 0; //清空更新队列
        return state;
    }
}
function shouldUpdate(classInstance, nextProps, nextState) {
    let willUpdate = true; // 是否要更新,默认更新
    if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
        willUpdate = false;
    }
    if (willUpdate && classInstance.componentWillUpdate) {
        classInstance.componentWillUpdate();
    }
    if (nextProps) classInstance.props = nextProps;
    classInstance.state = nextState;
    if (willUpdate) classInstance.forceUpdate();
}
export class Component {
    //标识是class组件
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        this.updater = new Updater(this)
    }
    /**
     * 类组件唯一能更改状态state的方法
     * @param {*} partialState 
     * @param {*} callback 
     */
    setState(partialState, callback) {
        this.updater.addState(partialState, callback)
    }
    forceUpdate() {
        const oldRenderVdom = this.oldRenderVdom;
        const oldDOM = findDOM(oldRenderVdom);
        const newRenderVdom = this.render();
        compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = newRenderVdom;
        if (this.componentDidUpdate) {
            this.componentDidUpdate(this.props, this.state);
        }
    }
}
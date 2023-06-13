
import { _decorator, Component, Node, UITransform, Vec3, Label, resources, Prefab, instantiate, director } from 'cc';
import { MechanicSceneTS } from '../MechanicSceneTS';
import { task_elem } from '../UI/task_elem';
import { FactoryTS } from './FactoryTS';
import { Level } from './LevelTS';
const { ccclass, property } = _decorator;

@ccclass('TaskTS')
export class TaskTS extends Component {

    @property({ type: Node })
    private effect = null;
    @property({ type: Node })
    private task = null;

    private level: Level = null;
    static target: Map<string, number> = new Map();
    static current_target: Map<string, number> = new Map();
    static view: Array<task_elem> = Array();
    start() {

    }
    public setLevel(level: Level): void {
        this.level = level;
        TaskTS.target = level.target;
        TaskTS.current_target = level.target;
        for (const iterator of TaskTS.current_target) {
            iterator[1] = 0;
        }
        this.buildInterface();
    }
    public buildInterface() {

        resources.load("prefab/task_pre", Prefab, (err, prefab) => {
            let counter = 150;
            for (const iterator of TaskTS.target) {
                let nd: Node = instantiate(prefab);

                let str: string = iterator[0];
                let targ: number = iterator[1];
                let tmp = nd.getChildByName("task_elem");
                let tsk: task_elem = tmp.getComponent(task_elem);
                tsk.setTarget(targ);
                tsk.setCurrent(0);
                tsk.updateView();
                tsk.setGem(str);
                this.task.addChild(nd);
                nd.setPosition(new Vec3(0, counter, 1));
                tsk.global_position = new Vec3(0,counter, 1);
                tsk.global_position.y += this.task.position.y;
                tsk.global_position.x += this.task.position.x;
                TaskTS.view.push(tsk);
                counter -= 50;
            }
        });

    }
    isHasGem(str: string): boolean {
        for (let i = 0; i < TaskTS.view.length; i++) {
            const element = TaskTS.view[i];
            if (element.str === str && !element.isEnded())
                return true;
        }
        return false;
    }
    endFly(str: string): void {
        for (let i = 0; i < TaskTS.view.length; i++) {
            const element = TaskTS.view[i];
            if (element.str === str) {
                element.plusCurrent();
                element.updateView();
                break;
            }
        }
        let is_win: boolean = true;
        for (let j = 0; j < TaskTS.view.length; j++) {
            const elem = TaskTS.view[j];
            if (!elem.isEnded()) {
                is_win = false;
                break;
            }
        }
        if (is_win) {
            let part = director.getScene().getComponentsInChildren(MechanicSceneTS);
            for (let i = 0; i < part.length; i++) {
                const element = part[i];
                element.showWin();
                
            }
        }
    }
    getGlobalPosition(str: string) : Vec3
    {
         let result = new Vec3(0,0,1);
        for (let i = 0; i < TaskTS.view.length; i++) {
            const element = TaskTS.view[i];
            if (element.str === str)
                {
                    return element.global_position;
                }
        }
        return result;
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */

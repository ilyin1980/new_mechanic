
import { _decorator, Component, Node, Label, Vec3, Color } from 'cc';
import { FactoryTS } from '../cmp/FactoryTS';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = task_elem
 * DateTime = Sun Jan 02 2022 23:36:42 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = task_elem.ts
 * FileBasenameNoExtension = task_elem
 * URL = db://assets/Scripts/UI/task_elem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('task_elem')
export class task_elem extends Component {
    @property({ type: Label })
    private label = null;
    @property({ type: Node })
    private gem = null;

    private target: number = 0;
    private current: number = 0;
    private _str: string = "";
    public global_position : Vec3 = new Vec3(0,0,3);
    public get str(): string {
        return this._str;
    }
    start() {
        // [3]
    }
    setCurrent(arg: number) {
        this.current = arg;
    }
    setTarget(arg: number) {
        this.target = arg;
    }
    setGem(str: string) {
        let gem: Node = FactoryTS.getInstance().getGem(str);
        this.gem.addChild(gem);
        gem.setScale(new Vec3(0.7, 0.7, 1));
        this._str = str;
    }
    plusCurrent() {
        if (!this.isEnded()) {
            this.current++;
            if(this.isEnded())
            {
                this.label.color = Color.GREEN;
                
            }
        }
    }
    updateView() {
        let lbl = this.label.getComponent(Label);
        lbl.string = String(this.target) + " / " + String(this.current)
    }
    isEnded(): boolean {
        if (this.current >= this.target)
            return true;
        return false;
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

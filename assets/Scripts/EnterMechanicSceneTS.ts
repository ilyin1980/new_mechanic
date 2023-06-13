
import { _decorator, Component, Node, Vec2, tween, Vec3 , Tween, TweenSystem, TweenEasing, director} from 'cc';
import { MechanicCmp } from './MechanicCmp';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = EnterMechanicSceneTS
 * DateTime = Thu Dec 16 2021 23:15:49 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = EnterMechanicSceneTS.ts
 * FileBasenameNoExtension = EnterMechanicSceneTS
 * URL = db://assets/Scripts/EnterMechanicSceneTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('EnterMechanicSceneTS')
export class EnterMechanicSceneTS extends Component {
    // [1]
    // dummy = '';

    // [2]
    @property({ type: Node })
    private window = null;

    constructor()
    {
        super();
        if(this.window)
        this.window.active = false;
       
    }

    onLoad(){
        this.window.active = true;
        let node = this.window;
        node.setPosition(0,600,0);
        let tw = tween(node).to(1,
        { position: new Vec3(0, 0, 0) }
        , { easing: 'elasticOut'}
        ).start();
        
    }

    start () {

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
    closeEvt()
    {
        let node = this.window;
        let tw = tween(node).to(1,
            { position: new Vec3(0, 600, 0) }
            , { easing: 'elasticIn'
            , 'onComplete' : function(){
               director.loadScene("BlackScene");
            }}

            ).start();
    }
    startLevel(obj, lvl_num)
    {
        let node = this.window;
        MechanicCmp.stage = +lvl_num;
        tween(node).to(1,
            { position: new Vec3(0, 600, 0) }
            , { easing: 'elasticIn'
            , 'onComplete' : function(){
               director.loadScene("MechanicScene");
            }}

            ).start();
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */

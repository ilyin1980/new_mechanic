
import { _decorator, Component, Node, tween, Vec3, resources, ParticleSystem2D, instantiate, Prefab } from 'cc';
import { Item } from './FieldTS';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = EffectTS
 * DateTime = Wed Dec 22 2021 23:18:45 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = EffectTS.ts
 * FileBasenameNoExtension = EffectTS
 * URL = db://assets/Scripts/cmp/EffectTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('EffectTS')
export class EffectTS extends Component {

    @property({ type: Node })
    private effect = null;
    @property({ type: Node })
    private field = null;
    
    effectMissClick(item : Item) : void
    {
        if(!item.img)
        {
            return;
        }
        let sca : Vec3 = new Vec3(item._img.scale);
        tween(item._img).to(0.1, {scale : new Vec3(1.1, 1.1, 1)}).to(0.1, {scale : sca}).start();
    }
    effectBang(item : Item)
    {
        if(!item)
        return;
        resources.load("particles/boom", Prefab, (err, part) => {
            let newNode = instantiate(part);
            this.field.addChild(newNode);
            newNode.setPosition(item._pos_now);
            
            
        });
    }
    start () {
        // [3]
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

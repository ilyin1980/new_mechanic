
import { _decorator, Component, Node, resources, Prefab, instantiate, Vec3, tween, Graphics, Color, Sprite, randomRangeInt, randomRange} from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BackTS
 * DateTime = Fri Dec 17 2021 17:19:05 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = BackTS.ts
 * FileBasenameNoExtension = BackTS
 * URL = db://assets/Scripts/cmp/BackTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('BackTS')
export class BackTS extends Component {

    @property({ type: Node })
    private back_img = null;
    static _back_img: Node = null;
    start() {
    }
    onEnable() {
        console.log("onEnable");
        BackTS._back_img = this.back_img;
        if (!BackTS._back_img)
            return;

        resources.load("prefab/back", Prefab, (err, prefab) => {
            let newNode = instantiate(prefab);
            newNode.setPosition(new Vec3(0, 0, 0));
            BackTS._back_img.addChild(newNode);
            BackTS.onFinishTween();
            // tween(BackTS._back_img).to(1,{position : new Vec3(10,10,0)})
            // .to(1,{position:new Vec3(0, 10, 0), scale : new Vec3(0.99, 0.99, 1)})
            // .to(1,{position:new Vec3(0, 0, 0), scale : new Vec3(1, 1, 1)})
            // .start();
        });
    }
    update (dt: number) {
        // [4]
    }
    static onFinishTween()
    {
        let x = randomRangeInt(0,10);
        let y = randomRangeInt(0,10);
        let scale = randomRange(0.98, 1);
        tween(BackTS._back_img).to(1, {position : new Vec3(x,y,0), scale : new Vec3(scale, scale, 1)}).call(BackTS.onFinishTween).start();
    }
}




import { _decorator, Component, Node, ButtonComponent, Sprite, resources, Prefab, instantiate, tween, Vec3, director } from 'cc';
import { FactoryTS } from './cmp/FactoryTS';
import { MechanicCmp } from './MechanicCmp';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MechanicSceneTS
 * DateTime = Fri Dec 17 2021 20:39:06 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = MechanicSceneTS.ts
 * FileBasenameNoExtension = MechanicSceneTS
 * URL = db://assets/Scripts/MechanicSceneTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('MechanicSceneTS')
export class MechanicSceneTS extends Component {

    @property({ type: MechanicCmp })
    private cmp = null;
    @property({ type: Node })
    private start_btn = null;
    @property({ type: Node })
    private close_btn = null;


    start() {
        console.log("MechanicSceneTS");
        this.cmp.setVisible(false);
        this.startMechanic();
    }

    update(dt: number) {
        FactoryTS.getInstance().update(dt);
    }
    onResize() {
        console.log("Resize");
    }
    startMechanic() {
        this.cmp.setVisible(true);
        setTimeout(() => { this.cmp.startMechanic() }, 1000);
        this.start_btn.active = false;
        this.close_btn.active = true;
    }
    close() {
        this.showLoose();
    }
    showLoose() {
        resources.load("win/loose_prefab", Prefab, (err, prefab) => {
            let n: Node = instantiate(prefab);
            this.cmp.node.addChild(n);
            n.setPosition(new Vec3(0, 600, 0));
            tween(n).to(1,
                { position: new Vec3(0, 0, 0) }
                , {
                    easing: 'elasticIn'
                    , 'onComplete': function () {
                        let tw = tween(n).to(1,
                            { position: new Vec3(0, 600, 0) }
                            , {
                                easing: 'elasticIn'
                                , 'onComplete': function () {
                                    director.loadScene("EnterMechanicScene");
                                }
                            }
            
                        );
                        setTimeout(() => { tw.start(); }, 2000);
                        
                    }
                }

            ).start();
        });
        console.log("Loose");
    }
    showWin() {
        resources.load("win/winner_prefab", Prefab, (err, prefab) => {
            let n: Node = instantiate(prefab);
            this.cmp.node.addChild(n);
            n.setPosition(new Vec3(0, 600, 0));
            tween(n).to(1,
                { position: new Vec3(0, 0, 0) }
                , {
                    easing: 'elasticIn'
                    , 'onComplete': function () {
                        let tw = tween(n).to(1,
                            { position: new Vec3(0, 600, 0) }
                            , {
                                easing: 'elasticIn'
                                , 'onComplete': function () {
                                    director.loadScene("EnterMechanicScene");
                                }
                            }
            
                        );
                        setTimeout(() => { tw.start(); }, 2000);
                        
                    }
                }

            ).start();
        });
        console.log("win");
    }
}


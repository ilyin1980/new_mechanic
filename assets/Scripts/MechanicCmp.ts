
import { _decorator, Component, Node, Sprite } from 'cc';
import { DockTS } from './cmp/DockTS';
import { EffectTS } from './cmp/EffectTS';
import { FieldTS } from './cmp/FieldTS';
import { Level, LevelTS } from './cmp/LevelTS';
import { TaskTS } from './cmp/TaskTS';
import { TimerTS } from './UI/TimerTS';
const { ccclass, property } = _decorator;


@ccclass('MechanicCmp')
export class MechanicCmp extends Component {

    @property({ type: TimerTS })
    private timer = null;
    @property({ type: Node })
    private hints = null;
    @property({ type: TaskTS })
    private tasks = null;
    @property({ type: FieldTS })
    private fieldts = null;
    @property({ type: DockTS })
    private dockts = null;
    @property({ type: EffectTS })
    private effectts = null;
    @property({ type: Node })
    private effect = null;

    private _timer: TimerTS = null;
    static SIDE : number = 50;
    static stage : number = 1;
    start() {
        // [3]
    }

    onLoad() {

    }
    init() {

    }
    update(dt: number) {
        // [4]
    }
    startMechanic() {
        let lvl: Level = LevelTS.getLevel(MechanicCmp.stage);
        (this.dockts as DockTS).setLevel(lvl);
        (this.fieldts as FieldTS).setLevel(lvl);
        (this.tasks as TaskTS).setLevel(lvl);
        (this.timer as TimerTS).setTimerValue(lvl.time);
    }
    setVisible(in_visible: boolean) {
        this.node.active = in_visible;
    }
}


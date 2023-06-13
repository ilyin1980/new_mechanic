
import { _decorator, Component, Node, director, ParticleSystem2D, math, Color } from 'cc';
import { MechanicSceneTS } from '../MechanicSceneTS';
import { NixieTS } from './NixieTS';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TimerTS
 * DateTime = Sat Dec 18 2021 18:22:24 GMT+0200 (Eastern European Standard Time)
 * Author = ilyin13091980
 * FileBasename = TimerTS.ts
 * FileBasenameNoExtension = TimerTS
 * URL = db://assets/Scripts/UI/TimerTS.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('TimerTS')
export class TimerTS extends Component {

    @property({ type: NixieTS })
    private digit_0 = null;
    @property({ type: NixieTS })
    private digit_1 = null;
    @property({ type: NixieTS })
    private digit_2 = null;
    @property({ type: NixieTS })
    private digit_3 = null;

    static THIS: TimerTS = null;

    private _curr_time: number = 0;
    public get curr_time(): number {
        return this._curr_time;
    }
    public set curr_time(value: number) {
        this._curr_time = value;
    }
    private _working = false;
    public get working() {
        return this._working;
    }
    public set working(value) {
        this._working = value;
    }

    private _round_time: number = 0;
    public get round_time(): number {
        return this._round_time;
    }
    public set round_time(value: number) {
        this._round_time = value;
    }
    private _alarm: boolean = false;


    start() {
        TimerTS.THIS = this;
    }

    update(dt: number) {
        if (this._working) {
            this._curr_time -= dt;
            if (this._curr_time < 0) {
                this.alarm();
                this._working = false;
            }
            if(this._alarm)
            {
                this.setValue(0);
                let part = director.getScene().getComponentsInChildren(MechanicSceneTS);
                for (let i = 0; i < part.length; i++) {
                    const element = part[i];
                    element.showLoose();
                    
                }
            }
            else
            {
                if(Math.floor(this._curr_time) !== Math.round(this._round_time))
                {
                    this.setValue(Math.floor(this._curr_time));
                }
            }
        }
    }
    setTimerValue(in_time: number) {
        this._curr_time = in_time + 0.5;
        this._round_time = Math.round(in_time);
    }
    alarm() {
        this._alarm = true;
    }
    go() {
        if (!this._round_time)
            return;
        this._working = true;
    }
    setValue(in_time: number)
    {
        if(Math.abs(in_time - 10) < 0.1)
        {
            let part = director.getScene().getComponentsInChildren(ParticleSystem2D);
            for (let i = 0; i < part.length; i++) {
                const element = part[i];
                element.startColor = new math.Color(200, 0, 0, 255);
            }
        }
        let val_left = +Math.trunc(in_time / 60);
        let val_right = +in_time % 60;
        this.setDigitVal(this.digit_0, +Math.trunc(val_left / 10));
        this.setDigitVal(this.digit_1, +val_left % 10);

        this.setDigitVal(this.digit_2, +Math.trunc(val_right / 10));
        this.setDigitVal(this.digit_3, +val_right % 10);
    }
    private setDigitVal(node: NixieTS, val: number) {
            node.setValue(val);
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

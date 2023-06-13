import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('NixieTS')
export class NixieTS extends Component {
    // [1]
    // dummy = '';

    // [2]
    @property({type:Node})
    private digit_0 = null;
    @property({type:Node})
    private digit_1 = null;
    @property({type:Node})
    private digit_2 = null;
    @property({type:Node})
    private digit_3 = null;
    @property({type:Node})
    private digit_4 = null;
    @property({type:Node})
    private digit_5 = null;
    @property({type:Node})
    private digit_6 = null;
    @property({type:Node})
    private digit_7 = null;
    @property({type:Node})
    private digit_8 = null;
    @property({type:Node})
    private digit_9 = null;
    private _val_curr: number = 0;
    private _val_next: number = 0;
    private _arr : Array<Node> = null;

    onLoad () {
        console.log("onLoad NixieTS");
        this._arr = [this.digit_0, this.digit_1, this.digit_2, this.digit_3, this.digit_4, this.digit_5, this.digit_6, this.digit_7, this.digit_8, this.digit_9 ];
        for (const iterator of this._arr) {
            iterator.active = false;
        }
        this.setValue(0);
        this._arr[0].active = true;
    }
    reset()
    {
         this._val_curr = 0;
         this._val_next = 0;
         this._arr = null;
    
    }
    public setValue(val : number) : void{

        this._val_next = val;
    }
    update (dt: number) {
        if(this._val_next != this._val_curr)
        {
            if(this._val_next < 0 || this._val_next > 9)
            {
                for (const iterator of this._arr) {
                    iterator.active = false;
                }
                this._arr[0].active = true;
            }
            else
            {
                for (const iterator of this._arr) {
                    iterator.active = false;
                }
                this._arr[this._val_next].active = true;
                
            }
            this._val_curr = this._val_next ;
        }
    }
}


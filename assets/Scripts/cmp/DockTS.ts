
import { _decorator, Component, Node, Vec3, randomRangeInt, tween } from 'cc';
import { MechanicCmp } from '../MechanicCmp';
import { FactoryTS } from './FactoryTS';
import { FieldTS, Item } from './FieldTS';
import { Level } from './LevelTS';
const { ccclass, property } = _decorator;

@ccclass('DockTS')
export class DockTS extends Component {

    @property({ type: Node })
    private dock = null;
    @property({ type: Node })
    private effect = null;
    @property({ type: Node })
    private field = null;

    private level: Level = null;
    private count: number = 0;

    public _pos_list: Array<Vec3> = new Array();
    private cells: Array<Item> = new Array();

    static SPEED: number = 600;
    start() {
        // [3]
    }
    public setLevel(level: Level): void {
        this.level = level;
        this.drawField();
    }
    private drawField(): void {
        this.count = this.level.dock;
        let y = -(this.count * MechanicCmp.SIDE / 2) + MechanicCmp.SIDE / 2;
        for (let i = 0; i < this.count; i++) {
            let cell: Node = FactoryTS.getInstance().getFieldCell();
            this.dock.addChild(cell);
            let pos: Vec3 = new Vec3(0, y, 1);
            cell.setPosition(pos);
            this._pos_list.push(pos);
            y += MechanicCmp.SIDE;
        }
        let portal: Node = FactoryTS.getInstance().getPortal();
        this.dock.addChild(portal);
        let portal_pos = new Vec3(0, -(this.count * MechanicCmp.SIDE / 2) + MechanicCmp.SIDE / 4, 1)
        portal.setPosition(portal_pos);

        this.fillGems();
    }
    private fillGems() {
        for (let i = 0; i < this.count; i++) {
            this.cells.push(new Item);
        }
        for (let j = 1; j < this.cells.length; j++) {
            let str: string = this.getRandomGem();
            this.cells[j]._img = FactoryTS.getInstance().getGem(str);
            this.cells[j].id = str;
            this.cells[j]._img.setScale(new Vec3(0.7, 0.7, 1));
            this.cells[j]._pos_now = this._pos_list[j];
            this.dock.addChild(this.cells[j]._img);
            this.cells[j]._img.setPosition(this._pos_list[j]);
            this.cells[j].row = j;

        }
    }
    private getRandomGem(): string {
        let rnd_max = this.level.set.length;
        let rnd = randomRangeInt(0, rnd_max);
        return this.level.set[rnd];
    }
    public getReceiverMainCmpCoord(): Vec3 {
        let y: number = -(this.count * MechanicCmp.SIDE / 2) + MechanicCmp.SIDE / 2;
        let x: number = 0;
        let result: Vec3 = new Vec3(x + this.dock.position.x, y + this.dock.position.y, 1);
        return result;
    }
    public pushItem(in_item: Item): void {
        if(!this.cells[0])
        this.cells[0] = new Item();
        if (this.cells[0].id == '' && !this.cells[0]._img) {
            this.cells[0].id = in_item.id;
            this.cells[0]._img = in_item._img;
            this.cells[0]._img.setPosition(this._pos_list[0]);
            this.cells[0]._img.removeFromParent();
            let y: number = -(this.count * MechanicCmp.SIDE / 2) + MechanicCmp.SIDE / 2;
            let x: number = 0;
            in_item = null;
            this.dock.addChild(this.cells[0]._img);
            this.cells[0]._img.setPosition(new Vec3(x, y, 1));
        }
        else {
            console.log("Quere dock exception");
        }
    }
    public moveQuere(): void {
        let i = this.cells.length - 1
        for (; i >= 0; i--) {
            const element = this.cells[i];
            if (element)
                break;
        }
        if (i === this.cells.length - 1 && this.cells[1])
            return;

        let new_arr: Array<Item> = new Array<Item>();
        for (let j = 0; j < this.cells.length; j++) {
            if (this.cells[j]) {
                new_arr.push(this.cells[j]);
            }
        }
        let fieldts: FieldTS = this.field.getComponent(FieldTS);
        for (let ele = 0; ele < new_arr.length; ele++) {
            const element = new_arr[ele];
            if (!element) {
                new_arr.splice(ele, 1);
                ele = 0;
                continue;
            }
        }
        for (let c = new_arr.length; c < this.count - 1; c++) { // new gem
            let str: string = fieldts.getRandomGem();
            let item: Item = new Item();
            item.id = str;
            let newGem: Node = FactoryTS.getInstance().getGem(str);
            this.dock.addChild(newGem);
            let y: number = -(this.count * MechanicCmp.SIDE / 2) + MechanicCmp.SIDE / 2;
            let x: number = 0;
            newGem.setPosition(new Vec3(x, y, 1));
            newGem.setScale(new Vec3(0.8, 0.8, 1));
            item._img = newGem;

            new_arr.unshift(item);
        }
        if (Math.round(this.count - new_arr.length) === 1)
            new_arr.unshift(null);

        this.cells = new_arr;
        for (let row = 0; row < this.cells.length; row++) {
            let element = this.cells[row];
            if (!element)
                continue;
            element.column = 0;
            element.row = row;
            if (element._img) {
                let new_pos: Vec3 = this._pos_list[element.row];
                tween(element._img)
                    .to(0.1, { position: new_pos }, { onComplete: (target) => { console.log("end move") } })
                    .start();
            }
        }
    }
    public getFirstItem(): Item {
        for (let i = this.cells.length - 1; i >= 0; i--) {
            let element = this.cells[i];

            if (!element) continue;
            
            let new_item: Item = Item.copy(this.cells[i]);
            tween(this.cells[i]).stop();
            this.cells[i] = null;
            this.moveQuere();
            return new_item;
        }
        return null;
    }
    public getGlobalPosition(pos : Vec3) : Vec3
    {
        let result : Vec3 = new Vec3(0,0,1);
        result.x += this.dock.position.x;
        result.y += this.dock.position.y;
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
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */

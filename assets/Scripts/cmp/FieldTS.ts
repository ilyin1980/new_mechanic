import { _decorator, Component, Node, UITransform, Vec3, tween, randomRangeInt, Input, EventTouch, Vec2, Sprite, Color, math, Quat, Tween } from 'cc';
import { MechanicCmp } from '../MechanicCmp';
import { TimerTS } from '../UI/TimerTS';
import { DockTS } from './DockTS';
import { EffectTS } from './EffectTS';
import { FactoryTS } from './FactoryTS';
import { Level } from './LevelTS';
import { TaskTS } from './TaskTS';
const { ccclass, property } = _decorator;

export enum DIRECT {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3

}
export class Item {

    public _pos_now: Vec3 = new Vec3;
    public _pos_destination: Vec3 = new Vec3;
    public _is_moved_now: boolean = false;
    public _img: Node = null;
    public get img(): Node {
        return this._img;
    }
    public set img(value: Node) {
        let alpha = this.alpha;
        this._img = value;
        if (!value)
            return;
        this.alpha = alpha;
    }

    public row: number = -1;
    public column: number = -1;
    public id: string = "";
    private _alpha = 255;
    public get alpha() {
        return this._img.getChildByName(this.id).getComponent(Sprite).color.a;
    }
    public set alpha(value) {
        this._alpha = value;
        if (!this._img)
            return;
        let color: Color = this._img.getChildByName(this.id).getComponent(Sprite).color;
        color.a = value;
        this._img.getChildByName(this.id).getComponent(Sprite).color = color;
    }
    public isEmpty(): boolean {
        if (this.id == '' && this._img == null)
            return true;
        return false;
    }
    static copy(in_item: Item): Item {
        let result = new Item();
        result._pos_now = in_item._pos_now;
        result._pos_destination = in_item._pos_destination;
        result._is_moved_now = in_item._is_moved_now;
        result._img = in_item._img;
        result.row = in_item.row;
        result.column = in_item.column;
        result.id = in_item.id;
        result._alpha = in_item._alpha;
        return result;
    }
    static compare(first: Item, second: Item): boolean {
        if (first.id === second.id && first.column === second.column && first.row === second.row)
            return true;
        return false;
    }
    constructor() {

    }
}
@ccclass('FieldTS')
export class FieldTS extends Component {
    @property({ type: Node })
    private field = null;
    @property({ type: Node })
    private dock = null;
    @property({ type: Node })
    private task = null;
    @property({ type: TaskTS })
    private task_ts = null;

    @property({ type: TimerTS })
    private timer = null;

    @property({ type: Node })
    private dock_ts = null;
    @property({ type: Node })
    private effect = null;
    @property({ type: EffectTS })
    private effect_ts = null;

    private level: Level = null;

    private _pos_list: Array<Vec3> = new Array();
    private _cells: Array<string> = new Array();
    private cells: Array<Item> = new Array();
    private _scan_columns: Array<boolean> = new Array();
    private _event_cell: Vec2 = null;
    private _visited_cells: Array<Item> = new Array();
    static THIS: FieldTS = null;
    static TIME_FLY_TO_DOCK: number = 0.5;
    static TIME_FLY_TO_TASK_TARGET: number = 1;
    static TIME_DELETE_GEM: number = 0.07;
    static TIME_FLY_TO_TASK: number = 1;
    static TIME_GEMS_FALL: number = 0.2;
    static SPEED_BORN_SPEED: number = 0.04;
    static TIME_BORN_MOVE: number = 0.15;
    static BOMB_COUNT_CREATE: number = 8;
    start() {
        FieldTS.THIS = this;
    }
    public setLevel(level: Level): void {
        this.level = level;
        for (let i = 0; i < level.width; i++) {
            this._scan_columns.push(false);

        }
        this.drawField();
    }
    private drawField(): void {
        const uiTrans: UITransform = this.field.getComponent(UITransform)!;
        let cont_height = uiTrans.contentSize.height;
        let cont_width = uiTrans.contentSize.width;

        for (let r = 0; r < this.level.height; r++) {
            for (let c = 0; c < this.level.width; c++) {
                const index = r * this.level.width + c;
                const str: string = this.level.cells[index];
                let x = c * MechanicCmp.SIDE - (cont_width / 2) + MechanicCmp.SIDE / 2;
                let y = (cont_height / 2) - r * MechanicCmp.SIDE - MechanicCmp.SIDE / 2;
                let pos: Vec3 = new Vec3(x, y, 1);
                this._pos_list.push(pos);

                if (str === "cell") {
                    this._cells.push("");
                    let cell: Node = FactoryTS.getInstance().getFieldCell();
                    cell.setScale(new Vec3(0, 0, 1));
                    this.field.addChild(cell);
                    cell.setPosition(pos);
                    tween(cell).to(0.5, { scale: new Vec3(1, 1, 1) }).start();
                }
                else {
                    this._cells.push("free");
                }
            }
        }
        for (let i = 0; i < this._cells.length; i++) {
            let cell = this._cells[i];
            if (cell == "") {
                let rnd_gem = "";
                do {
                    rnd_gem = this.getRandomGem();
                } while (rnd_gem === 'target')

                this._cells[i] = rnd_gem;
            }
        }

        for (let row = 0; row < this.level.height; row++) {
            for (let col = 0; col < this.level.width; col++) {
                const ind = row * this.level.width + col;
                let str: string = this._cells[ind];

                let item: Item = new Item();
                item.row = row;
                item.column = col;
                item.id = str;
                if (str !== "free") {
                    let newGem: Node = FactoryTS.getInstance().getGem(str);
                    this.field.addChild(newGem);
                    newGem.setPosition(this._pos_list[ind]);
                    newGem.setScale(new Vec3(0, 0, 1));
                    item._img = newGem;
                    item._pos_now = this._pos_list[ind];
                }
                this.cells.push(item);
            }
        }
        setTimeout(() => {
            this.showGems();
        }, 700);
    }
    public getRandomGem(): string {
        let rnd_max = this.level.set.length;
        let rnd = randomRangeInt(0, rnd_max);
        return this.level.set[rnd];
    }
    private showGems() {
        for (let i = 0; i < this.cells.length; i++) {
            let element: Item = this.cells[i];
            if (element._img) {
                tween(element._img).to(0.5, { scale: new Vec3(0.8, 0.8, 1) }, { easing: 'bounceInOut' }).start();
            }
        }
        setTimeout(() => {
            (this.timer as TimerTS).go();
            this.initMouseLisneners();
        }, 700);
    }
    private initMouseLisneners(): void {
        this.field.on(Node.EventType.TOUCH_START, this.click, this);
    }
    private removeMouseListeners(): void {
        this.field.off(Node.EventType.TOUCH_START, this.click, this);
    }
    private click(event: EventTouch) {
        if(this._event_cell)
            return;
        let pos_click: Vec2 = event.getUILocation();
        let pos: Vec3 = this.field.worldPosition;
        let x_left: number = pos.x - MechanicCmp.SIDE * this.level.width / 2;
        let y_left: number = pos.y + MechanicCmp.SIDE * this.level.height / 2;
        let x = Math.trunc((pos_click.x - x_left) / MechanicCmp.SIDE);
        let y = Math.trunc((y_left - pos_click.y) / MechanicCmp.SIDE);
        this.clickByGrid(x, y);
    }
    private clickByGrid(x: number, y: number): void {
        if (this.isValidToClick(x, y)) {
            this.removeToDock(x, y);
            this._event_cell = new Vec2(x, y);
        }
        else {
            let item: Item = this.getItemByGrid(x, y);
            let eff: EffectTS = this.node.parent.getComponentInChildren(EffectTS);
            eff.effectMissClick(item);
        }
    }
    public getItemByGrid(x: number, y: number): Item {
        if (x < 0 || y < 0)
            return null;
        if (x >= this.level.width || y >= this.level.height)
            return null;
        let index = y * this.level.width + x;
        return this.cells[index];
    }
    public getNeigborItem(x: number, y: number, direct: DIRECT): Item {
        let result: Item = null;
        switch (direct) {
            case DIRECT.UP:
                result = this.getItemByGrid(x, y - 1)
                break;
            case DIRECT.RIGHT:
                result = this.getItemByGrid(x + 1, y)
                break;
            case DIRECT.DOWN:
                result = this.getItemByGrid(x, y + 1)
                break;
            case DIRECT.LEFT:
                result = this.getItemByGrid(x - 1, y)
                break;
            default:
                break;
        }
        return result;
    }
    public isValidToClick(x: number, y: number): boolean {
        let id: string = "";
        if (this.getItemByGrid(x, y)) {
            if (id === "free")
                return false;
            id = this.getItemByGrid(x, y).id;
        }
        let up: string = "";
        if (this.getNeigborItem(x, y, DIRECT.UP)) {
            up = this.getNeigborItem(x, y, DIRECT.UP).id;
        }
        let down: string = "";
        if (this.getNeigborItem(x, y, DIRECT.DOWN)) {
            down = this.getNeigborItem(x, y, DIRECT.DOWN).id;
        }
        let right: string = "";
        if (this.getNeigborItem(x, y, DIRECT.RIGHT)) {
            right = this.getNeigborItem(x, y, DIRECT.RIGHT).id;
        }
        let left: string = "";
        if (this.getNeigborItem(x, y, DIRECT.LEFT)) {
            left = this.getNeigborItem(x, y, DIRECT.LEFT).id;
        }
        if (id === "" || id === up) {
            return false;
        }

        if (up === down && up !== 'target' && up !== 'bomb')
            return true;
        if ((up === left || up === right) && up !== 'target'&& up !== 'bomb')
            return true;
        return false;
    }
    public getNeigbors(x: number, y: number, null_included = false): Array<Item> {
        let item_up = this.getItemByGrid(x, y - 1);
        let item_right = this.getItemByGrid(x + 1, y);
        let item_down = this.getItemByGrid(x, y + 1);
        let item_left = this.getItemByGrid(x - 1, y);
        let result: Array<Item> = Array();
        if (null_included) {
            result = [item_up, item_right, item_down, item_left];
        }
        else {
            if (item_left)
                result.push(item_left);
            if (item_down)
                result.push(item_down);
            if (item_right)
                result.push(item_right);
            if (item_up)
                result.push(item_up);
        }
        return result;
    }
    public getDiagonalNeigbors(x: number, y: number, left = false) {
        if (left) return this.getItemByGrid(x - 1, y - 1);
        return this.getItemByGrid(x + 1, y - 1);
    }
    private addToScanColumn(col: number): void {
        FieldTS.THIS._scan_columns[col] = true;
    }
    public removeToDock(x: number, y: number) {
        let dck: DockTS = this.dock_ts.getComponent(DockTS);
        let zero_cell: Vec3 = dck.getReceiverMainCmpCoord();
        let index: number = y * this.level.width + x;
        let thisMainCompCoor: Vec3 = new Vec3(this._pos_list[index]);
        thisMainCompCoor.x += this.field.position.x;
        thisMainCompCoor.y -= this.field.position.y;
        let item = this.getItemByGrid(x, y);
        if (item && item._img) {

            // let view: Node = item._img;
            let pos: Vec3 = item._img.position;
            item._img.removeFromParent();
            let new_item = Item.copy(item);
            item._img = null;
            item.id = "";

            this.effect.addChild(new_item._img);
            pos.x += this.field.position.x;
            pos.y -= this.field.position.y;
            new_item._img.setPosition(pos);
            let vec: Vec3 = new Vec3(zero_cell.x, zero_cell.y, 1);
            this._event_cell = new Vec2(x, y);
            this.gemsFall();
            tween(new_item._img)
                .to(FieldTS.TIME_FLY_TO_DOCK, { position: vec },
                    {
                        easing: 'quintInOut',
                        onComplete: (target?: object) => {
                            this.dock_ts.getComponent(DockTS).pushItem(new_item);
                            let col_arr = this.getColumn(this._event_cell.x);
                            let is_born = false;
                            for (let i = 0; i < col_arr.length; i++) {
                                const element = col_arr[i];
                                if (this.isGemGenerator(element) && element.isEmpty()) {
                                    is_born = true;
                                    let dck: DockTS = this.dock_ts.getComponent(DockTS);
                                    let item_from_dock: Item = dck.getFirstItem();
                                    item_from_dock._img.removeFromParent();

                                    this.effect.addChild(item_from_dock._img);
                                    let x_dock = this.dock.position.x + item_from_dock._img.position.x - this.effect.position.x;
                                    let y_dock = this.dock.position.y + item_from_dock._img.position.y + this.effect.position.y;

                                    let old_pos = new Vec3(x_dock, y_dock, 1);
                                    let ind = element.row * this.level.width + element.column;
                                    let new_pos = new Vec3(this._pos_list[ind]);
                                    new_pos.x += this.field.position.x;
                                    new_pos.y += this.field.position.y;
                                    item_from_dock._img.setPosition(old_pos);
                                    tween(item_from_dock._img)
                                        .to(FieldTS.TIME_BORN_MOVE, { position: new_pos },
                                            {
                                                easing: 'quintInOut',
                                                onComplete: (target?: object) => {
                                                    item_from_dock._img.setScale(0.8, 0.8, 1);
                                                    this.removeItems();
                                                    this.bornItemFromDock(element, item_from_dock);
                                                }
                                            }
                                        )
                                        .start();
                                    break;
                                }

                            }
                            if (!is_born) {
                                this.removeItems();
                            }
                        }
                    })
                .start();
        }
    }
    gemsFall() {
        let cell: Vec2 = this._event_cell;
        let col_arr = this.getColumn(cell.x);
        if (col_arr.length <= cell.y) {
            return;
        }
        let row = cell.y - 1;
        for (; row >= 0; row--) {
            if (col_arr[row].isEmpty()) {
                break;
            }
            let up_cell: Item = this.getItemByGrid(cell.x, row);
            if (up_cell && up_cell._img) {
                let target_item: Item = this.getItemByGrid(cell.x, row + 1);
                if (target_item.id === 'free')
                    continue;
                let new_pos = target_item._pos_now;
                target_item._img = up_cell._img;
                target_item.id = up_cell.id;
                up_cell._img = null;
                up_cell.id = "";
                tween(target_item._img)
                    .to(FieldTS.TIME_GEMS_FALL, { position: new_pos },
                        {
                            easing: 'bounceOut',
                            onComplete: (target?: object) => {
                                //sound
                            }
                        })
                    .start();
            }
        }
    }
    pressColumn(col: number) {
        let col_arr = this.getColumn(col);
        let row = col_arr.length - 1;
        for (; row >= 0; row--) {
            if (col_arr[row].isEmpty()) {
                let full_elem: Item = this.getFirstFullElement(col_arr, col_arr[row]);

                if (full_elem) {
                    let is_block = false;
                    for (let bl = full_elem.row; bl <= col_arr[row].row; bl++) {
                        const em = col_arr[bl];
                        if (em.id === "free") {
                            is_block = true;
                            break;
                        }
                    }
                    if (!is_block) {
                        this.moveGem(full_elem, col_arr[row]);
                        row = col_arr.length - 1;
                    }
                }
            }

        }
    }
    isGemGenerator(item: Item): boolean {
        if (!item)
            return false;
        let arr = this.level.item_generators;
        let index = item.row * this.level.width + item.column;
        if (arr.indexOf(index) !== -1)
            return true;
        return false;
    }
    isTargetReceiver(item: Item): boolean {
        if (!item)
            return false;
        let arr = this.level.target_recievers;
        let index = item.row * this.level.width + item.column;
        if (arr.indexOf(index) !== -1)
            return true;
        return false;

    }
    bornItemFromDock(target: Item, source: Item) {
        let index = target.row * this.level.width + target.column;
        let pos = this._pos_list[index];
        source._img.removeFromParent();
        source._img.setPosition(pos);
        this.field.addChild(source._img);
        this.cells[index]._img = source._img;
        this.cells[index].id = source.id;
        source = null;
    }
    removeItems(): void {
        if (!this._event_cell)
            return;
        this._visited_cells = Array();
        let cell: Item = this.getItemByGrid(this._event_cell.x, this._event_cell.y);
        let arr_to_remove = this.getArrayToRemove(cell, cell.id);
        this._visited_cells = Array();
        arr_to_remove = arr_to_remove.filter((v, i, a) => a.indexOf(v) === i);
        let count_simple = arr_to_remove.length;
        for (let b = 0; b < arr_to_remove.length; b++) {
            const elem = arr_to_remove[b];
            if (elem && elem.id === 'bomb') {
                let bomb_arr: Array<Item> = this.getBombArr(elem);
                let eff: EffectTS = this.effect_ts.getComponent(EffectTS);
                eff.effectBang(elem);
                arr_to_remove = arr_to_remove.concat(bomb_arr);
            }
        }
        arr_to_remove = arr_to_remove.filter((v, i, a) => a.indexOf(v) === i);

        for (let i = 0; i < arr_to_remove.length; i++) {
            const element = arr_to_remove[i];
            this.deleteGem(element);
        }
        if (count_simple > FieldTS.BOMB_COUNT_CREATE) {
            let index: number = this._event_cell.y * this.level.width + this._event_cell.x;
            this.cells[index].id = "bomb";
            this.cells[index]._img = FactoryTS.getInstance().getGem('bomb');
            this.field.addChild(this.cells[index]._img);
            this.cells[index]._img.setPosition(this.cells[index]._pos_now);
        }
    }

    getBombArr(elem: Item): Array<Item> {
        let result: Array<Item> = Array();
        if (!elem)
            return result;
        result = this.getNeigbors(elem.column, elem.row);
        let tmp = this.getItemByGrid(elem.column - 1, elem.row - 1);
        if (tmp)
            result.push(tmp);
        let tmp1 = this.getItemByGrid(elem.column + 1, elem.row - 1);
        if (tmp1)
            result.push(tmp1);
        let tmp2 = this.getItemByGrid(elem.column - 1, elem.row + 1);
        if (tmp2)
            result.push(tmp2);
        let tmp3 = this.getItemByGrid(elem.column + 1, elem.row + 1);
        if (tmp3)
            result.push(tmp3);
        result = result.filter((v, i, a) => a.indexOf(v) === i);
        return result;
    }
    deleteGem(item: Item) {
        let tsk: TaskTS = this.task_ts.getComponent(TaskTS);
        this._scan_columns[item.column] = true;
        if (tsk.isHasGem(item.id) && item._img) {
            //fly
            item._img.removeFromParent();
            let task_item = Item.copy(item);
            item._img = null;
            item.id = "";
            task_item._img.removeFromParent();
            this.effect.addChild(task_item._img);
            let now_pos = this.getGlobalPosition(task_item._img.position);
            task_item._img.setPosition(now_pos);
            item._img = null;
            item.id = "";
            let new_pos: Vec3 = tsk.getGlobalPosition(task_item.id);
            tween(task_item._img)
                .to(FieldTS.TIME_FLY_TO_TASK, { position: new_pos },
                    {
                        onComplete: (target?: object) => {
                            task_item._img.removeFromParent();
                            tsk.endFly(task_item.id);
                            task_item._img = null;
                            task_item.id = "";
                            task_item = null;

                        }
                    }
                )
                .start();
        }
        else if (item._img) {
            item._img.removeFromParent();
            let task_item = Item.copy(item);
            item._img = null;
            item.id = "";
            task_item._img.removeFromParent();
            this.effect.addChild(task_item._img);
            let now_pos = this.getGlobalPosition(task_item._img.position);
            task_item._img.setPosition(now_pos);
            item._img = null;
            item.id = "";
            tween(task_item._img)
                .to(FieldTS.TIME_DELETE_GEM, { scale: new Vec3(0, 0, 1) },
                    {
                        easing: 'bounceInOut',
                        onComplete: (target?: object) => {
                            task_item._img.removeFromParent();
                            task_item._img = null;
                            task_item.id = "";
                            task_item = null;
                        }
                    }
                )
                .start();
        }
    }
    getGlobalPosition(vec: Vec3): Vec3 {
        let result: Vec3 = new Vec3(vec);
        result.x += this.field.position.x;
        result.y += this.field.position.y;
        return result;
    }
    update(dt: number) {
        let scan = this.isHaseScanColumns();
        for (let i = 0; i < this._scan_columns.length; i++) {
            const element = this._scan_columns[i];
            if (element) {
                this.scanOneColumn(i);
            }

        }
        if (!this.isHaseScanColumns() && scan) {
            for (let i = 0; i < this.cells.length; i++) {
                const cell = this.cells[i];
                if (cell.id === 'target') {
                    if (this.checkToDeleteTarget(cell)) {
                        this.deleteTarget(cell);
                        this.addToScanColumn(cell.column);
                    }
                }
            }
            if(!this.isHaseScanColumns())
            {
                this._event_cell = null;
                console.log("endd");
            }
        }
    }
    deleteTarget(item: Item) {
        let tsk: TaskTS = this.task_ts.getComponent(TaskTS);
        if (tsk.isHasGem(item.id)) {
            //fly
            item._img.removeFromParent();
            let task_item = Item.copy(item);
            item._img = null;
            item.id = "";
            task_item._img.removeFromParent();
            this.effect.addChild(task_item._img);
            let now_pos = this.getGlobalPosition(task_item._img.position);
            task_item._img.setPosition(now_pos);
            item._img = null;
            item.id = "";
            let new_pos: Vec3 = tsk.getGlobalPosition(task_item.id);
            tween(task_item._img)
                .to(FieldTS.TIME_FLY_TO_TASK_TARGET, { position: new_pos },
                    {
                        onComplete: (target?: object) => {
                            task_item._img.removeFromParent();
                            tsk.endFly(task_item.id);
                            task_item._img = null;
                            task_item.id = "";
                            task_item = null;

                        }
                    }
                )
                .start();
        }
        else {
            item._img.removeFromParent();
            let task_item = Item.copy(item);
            item._img = null;
            item.id = "";
            task_item._img.removeFromParent();
            this.effect.addChild(task_item._img);
            let now_pos = this.getGlobalPosition(task_item._img.position);
            task_item._img.setPosition(now_pos);
            item._img = null;
            item.id = "";
            tween(task_item._img)
                .to(FieldTS.TIME_DELETE_GEM, { scale: new Vec3(0, 0, 1) },
                    {
                        easing: 'bounceInOut',
                        onComplete: (target?: object) => {
                            task_item._img.removeFromParent();
                            task_item._img = null;
                            task_item.id = "";
                            task_item = null;
                        }
                    }
                )
                .start();
        }
    }
    correctAllPositions() {
        console.log('correct_position');
        for (let c = 0; c < this.cells.length; c++) {
            const element = this.cells[c];
            if (element && element._img) {
                element._img.setScale(0.8, 0.8, 1);
                element._img.setPosition(this._pos_list[c]);
            }

        }
    }
    checkToDeleteTarget(item: Item): boolean {
        let result: boolean = true;
        if (item && item.id === 'target') {
            let arr = this.getColumn(item.column);
            let reciever: Item = null;
            for (let r = item.row; r < arr.length; r++) {
                const el = arr[r];
                if (this.isTargetReceiver(el)) {
                    reciever = el;
                }

            }
            for (let i = item.row; i < reciever.row + 1; i++) {
                const element = arr[i];
                if (!element || (element && element.id !== 'target' && element.id !== ''))
                    return false;

            }
            result = true;
        }
        else {
            return false;
        }
        return result;
    }
    isHaseScanColumns(): boolean {
        let result: boolean = false;
        for (let i = 0; i < this._scan_columns.length; i++) {
            const element = this._scan_columns[i];
            if (element)
                return true;
        }
        return result;
    }
    getArrayToRemove(item: Item, str: string): Array<Item> {
        let result: Array<Item> = new Array();
        if (item && (item.id === str || item.id === 'bomb')) {
            if (this._visited_cells.indexOf(item) >= 0)
                return result;

            result.push(item);
            this._visited_cells.push(item);
            let neig: Array<Item> = this.getNeigbors(item.column, item.row);
            for (let i = 0; i < neig.length; i++) {
                const element = neig[i];

                if (!element)
                    continue;
                if (element.id != str && element.id != 'bomb')
                    continue;

                let arr_tmp: Array<Item> = this.getArrayToRemove(element, str);
                result = result.concat(arr_tmp);
            }
        }
        else {
            return result;
        }
        result = result.filter((v, i, a) => a.indexOf(v) === i);
        return result;
    }
    public scanOneColumn(col: number): void {
        let arr: Array<Item> = this.getColumn(col);
        let is_need_born = false;
        for (let row = arr.length - 1; row >= 0; row--) {
            let element = arr[row];
            if (element.id === 'free')
                continue;
            if (element.id === '' && !element._img) {
                let full_element: Item = null;
                for (let row_full = element.row - 1; row_full >= 0; row_full--) {
                    let full_cand: Item = arr[row_full];
                    if (full_cand && full_cand.id.length && full_cand._img && full_cand.id !== 'free') {
                        full_element = full_cand;
                        break;
                    }
                }
                if (full_element) {
                    let is_block = false;
                    for (let bl = full_element.row; bl <= element.row; bl++) {
                        const em = arr[bl];
                        if (em.id === "free") {
                            is_block = true;
                            break;
                        }

                    }
                    if (!is_block) {
                        this.moveGem(full_element, element);
                        row = arr.length - 1;
                    }
                }
                else {
                    is_need_born = true;
                }
            }

        }
        if (is_need_born) {
            let speed: number = FieldTS.SPEED_BORN_SPEED;
            arr = this.getColumn(col);

            for (let rowb = arr.length - 1; rowb >= 0; rowb--) {
                const element = arr[rowb];
                if (element.isEmpty()) {
                    let generator: Item = this.getUpGenerator(element.column, element.row);
                    if (generator) {
                        let dck: DockTS = this.dock_ts.getComponent(DockTS);
                        let born_gem: Item = dck.getFirstItem();

                        element.id = born_gem.id;
                        born_gem._img.removeFromParent();
                        let pos_born_dock: Vec3 = new Vec3(born_gem._img.position);
                        let pos_first_dock: Vec3 = new Vec3(dck._pos_list[dck._pos_list.length - 1]);
                        pos_first_dock.y += MechanicCmp.SIDE;
                        pos_first_dock.x += this.dock.position.x - this.field.position.x;
                        pos_born_dock.x += this.dock.position.x - this.field.position.x;
                        pos_born_dock.y += this.dock.position.y + this.field.position.y;
                        born_gem._img = null;
                        element._img = FactoryTS.getInstance().getGem(element.id);
                        this.field.addChild(element._img);
                        element._img.setPosition(pos_born_dock);
                        let index: number = element.row * this.level.width + element.column;
                        let vec_pos: Vec3 = new Vec3(this._pos_list[index]);
                        let vec_gener: Vec3 = new Vec3(generator._pos_now);
                        vec_gener.y += MechanicCmp.SIDE;
                        //element._img.setPosition(vec_pos);
                        born_gem._img = null;
                        born_gem.id = '';
                        born_gem = null;
                        rowb = arr.length - 1;
                        tween(element._img)
                            .to(Math.abs((speed * (pos_first_dock.y - pos_born_dock.y) / MechanicCmp.SIDE)), { position: pos_first_dock })
                            .to(speed * (Math.abs(vec_gener.x - pos_first_dock.x) / MechanicCmp.SIDE), { position: vec_gener })
                            .to(speed * (Math.abs(vec_pos.y - vec_gener.y) / MechanicCmp.SIDE), { position: vec_pos },
                                {
                                    onComplete: (target?: object) => {
                                        if(element._img)
                                            element._img.setScale(0.8, 0.8, 1);
                                        this.correctAllPositions();
                                    }
                                }
                            )
                            .start();
                    }
                }

            }
        }
        this._scan_columns[col] = false;
    }

    public moveGem(full: Item, empty: Item): boolean {
        if (full && full.id === '')
            return false;
        if (empty && !empty.isEmpty())
            return false;

        empty.id = full.id;
        empty._img = full._img;
        full.id = '';
        full._img = null;
        let speed = 0.1;
        const ind = empty.row * this.level.width + empty.column;
        let pos: Vec3 = this._pos_list[ind];
        tween(empty._img)
            .to(speed, { position: pos }, { easing: 'bounceOut' })
            .start();
        return true;
    }
    public getFirstEmptyElement(col_arr: Array<Item>): Item {
        for (let i = col_arr.length - 1; i >= 0; i--) {
            if (col_arr[i].isEmpty()) {
                return col_arr[i];
            }
        }
        return null;
    }
    public getFirstFullElement(col_arr: Array<Item>, cell_empty: Item): Item {
        let first_row: number = cell_empty.row - 1;
        if (first_row < 0)
            return null;
        for (let i = first_row; i < col_arr.length; i++) {
            const element = col_arr[i];
            if (element && !element.isEmpty() && element.id != "free")
                return element;

        }
        return null;
    }
    public getUpGenerator(x: number, y: number): Item {
        let col_arr: Array<Item> = this.getColumn(y);
        for (let i = y; i >= 0; i--) {
            let item: Item = this.getItemByGrid(x, i);
            if (item.id === 'free')
                return null;

            let index = this.level.width * i + x;
            if (this.level.item_generators.indexOf(index) >= 0) {
                return this.getItemByGrid(x, i);
            }

        }
        return null;
    }
    public generateGem(generator: Item, in_place: Item) {
        if (!generator)
            return;
        console.log("generate gem");
    }
    public getColumn(col: number): Array<Item> {
        let result: Array<Item> = new Array();
        for (let i = 0; i < this.level.height; i++) {
            let index: number = this.level.width * i + col;
            result.push(this.cells[index]);
        }
        return result;
    }
    onDestroy() {
        //this.removeMouseListeners();
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

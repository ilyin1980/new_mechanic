
import { _decorator, Component, Node } from 'cc';
import { Item } from './FieldTS';
const { ccclass, property } = _decorator;

export class Level {
    height: number = 0;
    width: number = 0;
    cells: Array<string> = new Array();
    dock: number = 0;
    set: Array<string> = new Array();
    item_generators: Array<number> = new Array();
    target_recievers: Array<number> = new Array();
    time: number = 0;
    target: Map<string, number> = new Map();
    init() {
        if (this.height && this.width) {
            for (let i = 0; i < this.height * this.width; i++) {
                this.cells.push("cell");
            }
        }
    }
}
export class LevelTS {

    private constructor() {

    }
    public static getLevel(id: number): Level {
        switch (id) {
            case 1:
                {
                    let lvl = new Level();
                    lvl.width = 10;
                    lvl.height = 10;
                    lvl.dock = 10;
                    lvl.init();
                    lvl.set = Array("red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "target");
                    lvl.time = 150;
                    lvl.cells[0] = lvl.cells[9] = "free";
                    lvl.item_generators = [1, 2, 3, 4, 5, 6, 7, 8, 10, 19];
                    lvl.target_recievers = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90];
                    lvl.target.set("red", 50);
                    lvl.target.set("green", 50);
                    lvl.target.set("target", 10);
                    return lvl;
                }
                break;
            case 2:
                {
                    let lvl = new Level();
                    lvl.width = 10;
                    lvl.height = 10;
                    lvl.dock = 10;
                    lvl.init();
                    lvl.set = Array("red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green");
                    lvl.time = 120;
                    lvl.cells[0] = lvl.cells[9]
                        = lvl.cells[4] = lvl.cells[5]
                        = lvl.cells[14] = lvl.cells[15]
                        = lvl.cells[24] = lvl.cells[25]
                        = lvl.cells[34] = lvl.cells[35]
                        = lvl.cells[44] = lvl.cells[45]
                        = lvl.cells[54] = lvl.cells[55]
                        = lvl.cells[64] = lvl.cells[65]
                        = lvl.cells[74] = lvl.cells[75]
                        = lvl.cells[84] = lvl.cells[85]
                        = lvl.cells[94] = lvl.cells[95]
                        = "free";
                    lvl.item_generators = [1, 2, 3, 4, 5, 6, 7, 8, 10, 19];
                    lvl.target_recievers = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90];
                    lvl.target.set("ruby", 30);
                    lvl.target.set("green", 30);
                    lvl.target.set("blue", 30);
                    return lvl;
                }
                break;
            case 3:
                {
                    let lvl = new Level();
                    lvl.width = 10;
                    lvl.height = 10;
                    lvl.dock = 6;
                    lvl.init();
                    lvl.set = Array("red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "ruby", "red", "blue", "green", "target");
                    lvl.time = 180;
                    lvl.cells[0] = lvl.cells[1] = lvl.cells[2] = lvl.cells[3]
                        = lvl.cells[6] = lvl.cells[7] = lvl.cells[8] = lvl.cells[9]
                        = lvl.cells[10] = lvl.cells[11] = lvl.cells[12]
                        = lvl.cells[17] = lvl.cells[18] = lvl.cells[19]
                        = lvl.cells[20] = lvl.cells[21]
                        = lvl.cells[28] = lvl.cells[29]
                        = lvl.cells[30]
                        = lvl.cells[39]
                        = lvl.cells[70]
                        = lvl.cells[79]
                        = lvl.cells[80] = lvl.cells[81]
                        = lvl.cells[88] = lvl.cells[89]
                        = lvl.cells[90] = lvl.cells[91] = lvl.cells[92]
                        = lvl.cells[97] = lvl.cells[98] = lvl.cells[99]

                        = "free";
                    lvl.item_generators = [4, 5, 13, 16, 22, 27, 31, 38, 40, 49];
                    lvl.target_recievers = [60, 71, 82, 93, 94, 95, 96, 87, 78, 69];
                    lvl.target.set("ruby", 30);
                    lvl.target.set("green", 30);
                    lvl.target.set("blue", 30);
                    lvl.target.set("target", 10);
                    return lvl;
                }
                break;
            default:
                return null;
        }
    }
}


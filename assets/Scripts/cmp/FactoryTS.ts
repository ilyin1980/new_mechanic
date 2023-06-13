import { _decorator, Component, Node, resources, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;


export class FactoryTS {

    static _dict: Map<string, Prefab> = new Map();
    static _is_loading: boolean = false;
    static _is_load_map = false;
    private static _is_ready = false;
    public static get is_ready() {
        return FactoryTS._is_ready;
    }
    static instance: FactoryTS = null;

    private constructor() {
        this.init();
    }
    public static getInstance(): FactoryTS {
        if (!FactoryTS.instance) {
            FactoryTS.instance = new FactoryTS();
        }
        return FactoryTS.instance;
    }
    private init() {
        resources.load("prefab/gems", function (e, p) {
            let f: Object = new Object(p.json);
            for (const key in f) {
                if (Object.prototype.hasOwnProperty.call(f, key)) {
                    FactoryTS._dict.set(key, null);
                }
            }
            FactoryTS._is_load_map = true;
        });
    }
    update(dt: number) {
        if (FactoryTS._is_ready) { return; }
        if (FactoryTS._is_load_map) {
            let tmp: boolean = true;

            for (const iterator of FactoryTS._dict) {
                if (!iterator[1])
                    tmp = false;
            }
            if (tmp) {
                FactoryTS._is_ready = true;
            }
        }

        if (!FactoryTS._is_load_map) { return; }

        if (!FactoryTS._is_loading) {

            for (const iterator of FactoryTS._dict) {
                resources.load("prefab/" + iterator[0], Prefab, (err, prefab) => {
                    FactoryTS._dict.set(iterator[0], prefab);
                });
            }
            FactoryTS._is_loading = true;
        }
    }
    public getFieldCell(): Node {
        return this.getGem("field_cell");
    }
    public getGem(in_name: string) {
        if (!FactoryTS._dict.has(in_name))
            return null;
        let prefab: Prefab = FactoryTS._dict.get(in_name);
        return instantiate(prefab);
    }
    public getPortal():Node{
        return this.getGem("portal");
    }

}

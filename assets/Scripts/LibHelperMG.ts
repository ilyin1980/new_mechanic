import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class HelperMG extends Component 
{
    public static getHash(in_str: string)
    {
        var hash = 0, i, chr;
        for (i = 0; i < in_str.length; i++) {
          chr   = in_str.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash>>>0;
    }

    public static randSizetGenerator( first_include,  second_include)
    {
        return Math.floor(Math.random() * (second_include - 1 - first_include + 1) + first_include);
    }
    public static generateUniqHash( in_exists : Array<number>)
    {
        let r = 0;
        let repeat = false;
        do 
        {
            r = HelperMG.randSizetGenerator(1, 0x7FFFFFFE);
            repeat = false;
            for (let i = 0; i < in_exists.length; ++i)
            {
                if (r == in_exists[i])
                {
                    repeat = true;
                    break;
                }
            }
        } while (repeat);
    
        return r;
    }
}


import { Engine } from "./engine";

export class Block {
    value: number = 1;
    colour: string = '#fff';
}

export class Game {
    num_level: number = 1;
    num_balls: number = 1;

    grid: Array<Array<Block>>; // list of rows of blocks

    private should_draw: boolean = false;
    private cx: CanvasRenderingContext2D;
    private suspended: boolean = true;

    constructor(cx?: CanvasRenderingContext2D){
        if (cx !== undefined){
            this.cx = cx;
            this.should_draw = true;
            // step managed by Engine
        } else {
            // step internally, at fastest speed possible
            setInterval(this.step, 1);
        }
    }

    step(){
        console.log("a");
    }
}
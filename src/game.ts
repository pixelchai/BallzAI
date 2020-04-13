import { Engine } from "./engine.js";
import * as Constants from "./constants.js"

export class Block {
    value: number = 1;
    colour: string = '#fff';

    constructor(value: number, colour?: string){
        this.value = value;
        if (colour !== undefined){
            this.colour = colour;
        } else {
            // randomly select colour
            this.colour = Constants.BLOCK_COLOURS[Math.floor(Math.random() * Constants.BLOCK_COLOURS.length)];
        }
    }
}

export enum GameState {
    NEW_ROW  = 1,
    AIMING   = 2,
    BOUNCING = 3
}

export class Game {
    num_level: number = 1;
    num_balls: number = 1;

    grid: Array<Array<Block>> = []; // list of rows of blocks

    state: GameState;

    // private should_draw: boolean = false;
    // private cx: CanvasRenderingContext2D;
    // private suspended: boolean = true;

    // constructor(cx?: CanvasRenderingContext2D){
    //     if (cx !== undefined){
    //         this.cx = cx;
    //         this.should_draw = true;
    //         // step managed by Engine
    //     } else {
    //         // step internally, at fastest speed possible
    //         setInterval(this.step, 1);
    //     }
    // }

    step(){
        console.log("a");
    }

    step_row(){
        this.grid.push(this.new_row());
    }

    advance_state(){
        
    }

    private new_row() {
        let row: Array<Block> = [];

        for(let i = 0; i < Engine.grid_width; i++){
            let value = Math.floor(Math.random() * (this.num_level)) + 1;

            row.push(new Block(value));
        }

        return row;
    }
}
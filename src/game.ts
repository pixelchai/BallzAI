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

export class Game {
    num_level: number = 1;
    num_balls: number = 1;

    grid: Array<Array<Block>> = []; // list of rows of blocks

    state: number = Constants.STATE_BOUNCING;

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

    advance_state(){
        this.state = (this.state + 1) % Constants.NUM_STATES;        
    }
    
    step(){
        if (this.state == Constants.STATE_BOUNCING){
            this.step_row();
            this.advance_state();
        }
    }

    private step_row(){
        this.grid.push(this.new_row());
    }

    private new_row() {
        let row: Array<Block> = [];
        let any_blocks: boolean = false;

        for(let i = 0; i < Engine.grid_width; i++){
            if (Math.random() < Math.min(Math.max(0.3, 0.05*this.num_level), 0.7)){
                let value = Math.floor(Math.random() * (this.num_level*2 + this.num_level - 1)) + this.num_level + 1;

                row.push(new Block(value));
                any_blocks = true;
            } else {
                row.push(null);
            }
        }

        // special case: level 1 and no blocks
        if (this.num_level == 1 && !any_blocks){
            row[0] = new Block(1);
        }

        return row;
    }
}
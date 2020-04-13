import { Engine } from "./engine.js";
import * as Constants from "./constants.js"
import { PosUtil } from "./util.js";

export class Block {
    render(cx: CanvasRenderingContext2D, x: number, y: number, opacity: number){
    }
}

export class Tile extends Block {
    value: number = 1;
    colour: string = '#fff';

    constructor(value: number, colour?: string){
        super();

        this.value = value;
        if (colour !== undefined){
            this.colour = colour;
        } else {
            // randomly select colour
            this.colour = Constants.BLOCK_COLOURS[Math.floor(Math.random() * Constants.BLOCK_COLOURS.length)];
        }
    }

    render(cx: CanvasRenderingContext2D, x: number, y: number, opacity: number){
        // rect colour
        cx.fillStyle = Engine.change_opacity(this.colour, opacity);

        // draw rect
        cx.fillRect(
            x + Engine.block_padding/2,
            y + Engine.block_padding/2, 
            Engine.block_size - Engine.block_padding, 
            Engine.block_size - Engine.block_padding
        );

        // draw value
        cx.fillStyle = Constants.C_BACKGROUND;
        cx.textAlign = "left";

        let value_str = this.value.toString();
        let text_size = cx.measureText(value_str);

        cx.fillText(
            value_str,
            x + Engine.block_size/2 - text_size.width/2,
            y + Engine.block_size/2 + 10
        );
    }
}

export class NewBall extends Block {
    time: number = 0; // time elapsed in seconds (calculated)

    render(cx: CanvasRenderingContext2D, x: number, y: number, opacity: number){
        let size_off = Math.sin(this.time*25)*2; // size offset - for growing/shrinking animation

        // outer circle
        cx.fillStyle = Constants.C_FOREROUND;
        cx.beginPath();
        cx.ellipse(
            x + Engine.block_size/2,
            y + Engine.block_size/2, 
            Engine.block_size*0.30 + size_off, 
            Engine.block_size*0.30 + size_off, 
            0, 
            0, 
            2*Math.PI
        );
        cx.fill();

        // middle circle
        cx.fillStyle = Constants.C_BACKGROUND;
        cx.beginPath();
        cx.ellipse(
            x + Engine.block_size/2,
            y + Engine.block_size/2, 
            Engine.block_size*0.25 + size_off, 
            Engine.block_size*0.25 + size_off, 
            0, 
            0, 
            2*Math.PI
        );
        cx.fill();

        // innermost circle
        cx.fillStyle = Constants.C_FOREROUND;
        cx.beginPath();
        cx.ellipse(
            x + Engine.block_size/2,
            y + Engine.block_size/2, 
            Engine.block_size*0.15, 
            Engine.block_size*0.15, 
            0, 
            0, 
            2*Math.PI
        );
        cx.fill();

        this.time += Engine.time_step;
    }
}

export class Ball {
    static speed: number = 1500;

    x: number;
    y: number;

    vx: number;
    vy: number;

    constructor(x: number, y: number, t?: number){
        this.x = x;
        this.y = y;

        if (t !== undefined){
            [this.vx, this.vy] = PosUtil.rec(t, Ball.speed);
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    }

    step(){
        this.x += this.vx * Engine.time_step;
        this.y -= this.vy * Engine.time_step;
    }
}

export class Game {
    num_level: number = 0;
    num_balls: number = 1;

    grid: Array<Array<Block>> = []; // list of rows of blocks
    aim_x: number = Engine.width/2 - Engine.ball_radius;
    aim_y: number = Engine.height - Engine.ball_radius;

    balls: Array<Ball> = []; // list of balls that are currently bouncing


    state: number = Constants.STATE_BOUNCING; // because next will be NEW_ROW

    advance_state(){
        this.state = (this.state + 1) % Constants.NUM_STATES;        
    }

    fire(theta: number){
        // FIXME: this is wrong -- need to add balls with some time gap - fix later
        for(let i = 0; i < this.num_balls; i++){
            this.balls.push(new Ball(this.aim_x, this.aim_y, theta));
        }
        this.advance_state();
    }
    
    step(){
        if (this.state == Constants.STATE_BOUNCING){
            this.step_balls();
        }
    }

    private step_balls(){
        if (this.balls.length == 0){
            this.step_row();
            this.advance_state();
        }

        this.balls.forEach(function(ball: Ball){
            ball.step();
        });
    }

    private step_row(){
        ++this.num_level;
        this.grid.unshift(this.new_row());
    }

    private new_row() {
        let row: Array<Block> = [];
        let any_blocks: boolean = false;

        for(let i = 0; i < Engine.grid_width; i++){
            if (Math.random() < Math.min(Math.max(0.3, 0.05*this.num_level), 0.7)){
                let value = Math.floor(Math.random() * (this.num_level*2 + this.num_level - 1)) + this.num_level + 1;

                row.push(new Tile(value));
                any_blocks = true;
            } else {
                if (Math.random() < 0.2){
                    row.push(new NewBall());
                } else { 
                    row.push(null);
                }
            }
        }

        // special case: level 1 and no blocks
        if (this.num_level == 1 && !any_blocks){
            row[0] = new Tile(1);
        }

        return row;
    }
}
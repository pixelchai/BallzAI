import * as Constants from './constants.js';

import { Game } from './game.js';

export class Engine {
    // canvas API
    private c: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    private frame_timer: number;
    private game: Game;
    private last_state: number;
    // private lerping_row: boolean = false;

    private row_offset: number;

    static readonly frame_rate: number = 120;                      // number of frames to be shown per second
    static readonly frame_time: number = 1000 / Engine.frame_rate; // amount of ms each frame is to be shown for
    static readonly time_step: number = 1 / Engine.frame_rate;     // number of seconds each frame is shown for
    
    static readonly width: number = 721; // 721 because it is divisible by 7
    static readonly height: number = 1280;
    static readonly grid_width: number = 7;
    static readonly block_size: number = Math.floor(Engine.width / Engine.grid_width);


    constructor(){
        this.c = <HTMLCanvasElement> document.getElementById('c');
        this.cx = this.c.getContext('2d');

        this.init_size();

        this.game = new Game();
    }

    private init_size(){
        this.c.width = Engine.width;
        this.c.height = Engine.height;
    }

    start(){
        let self = this;
        this.frame_timer = setInterval(function(){
            self.update();
            self.draw();

            self.last_state = self.game.state;
        }, Engine.frame_time);
    }

    update(){
        // if(this.lerping_row){
        //     if (this.row_offset < 0){
        //         // lerp row offset
        //         this.row_offset += Engine.time_step*10;
        //     } else if (this.row_offset >= 0) {
        //         // finished lerping
        //         this.lerping_row = false;
        //         this.game.advance_state();
        //     }

        //     return;
        // }
        if (this.game.state == Constants.STATE_NEW_ROW){
            // console.log(this.row_offset);
            if (this.row_offset < 0){
                // lerp row offset
                this.row_offset += Engine.time_step*400;
                // console.log(this.row_offset);
            } else if (this.row_offset >= 0) {
                // finished lerping
                console.log("fin");
                // this.lerping_row = false;
                this.game.advance_state();
            }
            return;
        }

        this.game.step();
        

        if (this.state_changed()){
            console.log(this.game.state);
            if(this.game.state == Constants.STATE_NEW_ROW){
                // begin lerp
                this.row_offset = -1 * Engine.block_size;
                // this.lerping_row = true;
            }
        }
    }

    state_changed(){
        return this.last_state !== this.game.state;
    }

    draw(){
        this.clear();
        this.draw_grid();
    }

    private draw_grid(){
        let self = this;


        let row_offset = this.row_offset;
        for(let row = 0; row < self.game.grid.length; row++){
            let col_offset = 0;
            for(let col = 0; col < self.game.grid[row].length; col++){
                self.cx.fillStyle = self.game.grid[row][col].colour;
                self.cx.fillRect(col_offset, row_offset, Engine.block_size, Engine.block_size);

                col_offset += Engine.block_size;
            }

            row_offset += Engine.block_size;
        }
    }

    clear(){
        //background
        this.cx.fillStyle = Constants.C_BACKGROUND;
        this.cx.fillRect(0, 0, this.c.width, this.c.height);
    }
}
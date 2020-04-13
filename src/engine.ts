import * as Constants from './constants.js';

import { Game } from './game.js';

export class Engine {
    // canvas API
    private c: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    private frame_timer: number;
    private game: Game;
    private last_state: number;

    private row_lerp_offset: number;

    static readonly frame_rate: number = 120;                      // number of frames to be shown per second
    static readonly frame_time: number = 1000 / Engine.frame_rate; // amount of ms each frame is to be shown for
    static readonly time_step: number = 1 / Engine.frame_rate;     // number of seconds each frame is shown for
    
    static readonly width: number = 720; // 721 because it is divisible by 7
    static readonly height: number = 1280;

    static readonly grid_width: number = 6; // how many blocks wide the grid should be
    static readonly block_size: number = Math.floor(Engine.width / Engine.grid_width); // px
    static readonly block_padding: number = 20; // in px

    static readonly header_height: number = 70; // in px

    constructor(){
        this.c = <HTMLCanvasElement> document.getElementById('c');
        this.cx = this.c.getContext('2d');

        this.init_size();
        this.init_res(); // init resources

        this.game = new Game();
    }

    private init_size(){
        this.c.width = Engine.width;
        this.c.height = Engine.height;
    }

    private init_res(){
        // set font
        this.cx.font = '40px DM Sans';
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
        if (this.game.state == Constants.STATE_NEW_ROW){
            // console.log(this.row_offset);
            if (this.row_lerp_offset < 0){
                // lerp row offset
                this.row_lerp_offset += Engine.time_step*400;
                // console.log(this.row_offset);
            } else if (this.row_lerp_offset >= 0) {
                // finished lerping
                console.log("fin");
                this.game.advance_state();
            }
            return;
        }

        this.game.step();
        

        if (this.state_changed()){
            console.log(this.game.state);
            if(this.game.state == Constants.STATE_NEW_ROW){
                // initialise lerp
                this.row_lerp_offset = -1 * Engine.block_size;
            }
        }
    }

    state_changed(){
        return this.last_state !== this.game.state;
    }

    draw(){
        this.clear();
        this.draw_grid();
        this.draw_header();
    }

    private draw_grid(){
        let self = this;


        let row_offset = Engine.header_height + this.row_lerp_offset;
        for(let row = 0; row < self.game.grid.length; row++){
            let col_offset = 0;
            
            let opacity_lerp: number = 1;
            // only lerp opacity for top row
            if (row == 0){
                opacity_lerp = (Engine.block_size + self.row_lerp_offset)/Engine.block_size; // lerp opacity for fade effect
            }

            for(let col = 0; col < self.game.grid[row].length; col++){
                // rect colour
                self.cx.fillStyle = Engine.change_opacity(self.game.grid[row][col].colour, opacity_lerp);

                // draw rect
                self.cx.fillRect(
                    col_offset + Engine.block_padding/2,
                    row_offset + Engine.block_padding/2, 
                    Engine.block_size - Engine.block_padding, 
                    Engine.block_size - Engine.block_padding
                );

                col_offset += Engine.block_size;
            }

            row_offset += Engine.block_size;
        }
    }

    private static change_opacity(hex_colour: string, opacity: number){
        if (opacity == 1) return hex_colour;

        // source: https://stackoverflow.com/a/21648508/5013267
        let c = hex_colour.substring(1).split('');
        if(c.length== 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        let c_h: any = '0x'+c.join('');
        return 'rgba('+[(c_h>>16)&255, (c_h>>8)&255, c_h&255].join(',')+','+opacity.toString()+')';
    }

    private draw_header(){
        // header background
        this.cx.fillStyle = Constants.C_HEADER_BACKGROUND;
        this.cx.fillRect(0, 0, this.c.width, Engine.header_height);

        // level number
        this.cx.textAlign = "left";
        this.cx.fillStyle = Constants.C_FOREROUND;
        this.cx.fillText("Level: " + this.game.num_level.toString(), 20, Engine.header_height/2 + 15);
    }

    clear(){
        //background
        this.cx.fillStyle = Constants.C_BACKGROUND;
        this.cx.fillRect(0, 0, this.c.width, this.c.height);
    }
}
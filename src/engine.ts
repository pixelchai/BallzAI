import * as Constants from './constants.js';
import { PosUtil } from './util.js';

import { Game, Block, Ball } from './game.js';

export class Engine {
    private c: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    private frame_timer: number;
    private game: Game;
    private last_state: number;

    private row_lerp_offset: number;

    static readonly speed: number = 1;                             // speed (multiplier)
    static readonly frame_rate: number = 20;                      // number of frames to be shown per second
    static readonly frame_time: number = 1000 / Engine.frame_rate; // amount of ms each frame is to be shown for
    static readonly time_step: number = 1 / Engine.frame_rate * Engine.speed; // number of seconds each frame is shown for
    
    static readonly width: number = 720; // 721 because it is divisible by 7
    static readonly height: number = 1280;

    static readonly grid_width: number = 6; // how many blocks wide the grid should be
    static readonly block_size: number = Math.floor(Engine.width / Engine.grid_width); // in px
    static readonly block_padding: number = 20; // in px

    static readonly ball_radius: number = 15; // in px
    static readonly aim_line_length: number = 100; // in px

    static readonly header_height: number = 70; // in px

    private mouse_x: number;
    private mouse_y: number;

    constructor(){
        this.c = <HTMLCanvasElement> document.getElementById('c');
        this.cx = this.c.getContext('2d');

        this.init_size();
        this.init_res(); // init resources
        this.init_listeners();

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

    private init_listeners(){
        let self = this;
        window.addEventListener("mousemove", function(e){
            self.on_mouse_move(e);
        });
    }

    get_mouse_pos(e: MouseEvent){
        // adapted from: https://stackoverflow.com/a/17130415/5013267

        let rect = this.c.getBoundingClientRect(); // abs. size of element
        
        // adjust width/height to factor in 'object-fit: contain'
        let width: number = rect.width;
        let height: number = rect.height;

        if (rect.height > rect.width){
            height = rect.width * (Engine.height / Engine.width);
        } else if (rect.height < rect.width){
            width = rect.height * Engine.width / Engine.height;
        }

        let scaleX = Engine.width / width;    // relationship bitmap vs. element for X
        let scaleY = Engine.height / height;  // relationship bitmap vs. element for Y
        

        return [
            (e.clientX - (rect.width - width)/2) * scaleX,      // scale mouse coordinates after they have
            (e.clientY - (rect.height - height)/2) * scaleY     // been adjusted to be relative to element
        ];
    }

    private on_mouse_move(e: MouseEvent){
        if (this.game.state == Constants.STATE_AIMING){
            [this.mouse_x, this.mouse_y] = this.get_mouse_pos(e);
        }
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
            if (this.row_lerp_offset < 0){
                // lerp row offset
                this.row_lerp_offset += Engine.time_step*400;
            } else if (this.row_lerp_offset >= 0) {
                // finished lerping
                console.log("fin");
                this.game.advance_state();
            }
            return;
        } else if (this.game.state == Constants.STATE_AIMING){
            // console.log("aiming");
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

        if (this.game.state == Constants.STATE_AIMING){
            this.draw_aim_ball();
            this.draw_aim_line();
        }

        this.draw_header();
    }

    private draw_grid(){

        let row_offset = Engine.header_height + this.row_lerp_offset;
        for(let row = 0; row < this.game.grid.length; row++){
            let col_offset = 0;
            
            let opacity_lerp: number = 1;
            // only lerp opacity for top row
            if (row == 0){
                opacity_lerp = (Engine.block_size + this.row_lerp_offset)/Engine.block_size; // lerp opacity for fade effect
            }

            for(let col = 0; col < this.game.grid[row].length; col++){
                let block: Block = this.game.grid[row][col];

                if(block !== null){
                    block.render(this.cx, col_offset, row_offset, opacity_lerp);
                }

                col_offset += Engine.block_size;
            }

            row_offset += Engine.block_size;
        }
    }

    static change_opacity(hex_colour: string, opacity: number){
        if (opacity == 1) return hex_colour;

        // source: https://stackoverflow.com/a/21648508/5013267
        let c = hex_colour.substring(1).split('');
        if(c.length== 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        let c_h: any = '0x'+c.join('');
        return 'rgba('+[(c_h>>16)&255, (c_h>>8)&255, c_h&255].join(',')+','+opacity.toString()+')';
    }

    private draw_aim_ball(){
        this.draw_ball(new Ball(this.game.aim_x, this.game.aim_y));
    }

    private draw_aim_line(){
        this.cx.strokeStyle = "#fff";
        this.cx.lineWidth = 3;
        this.cx.beginPath();

        // let theta = PosUtil.get_angle(this.game.aim_x, this.game.aim_y, this.mouse_x, this.mouse_y);
        let theta = PosUtil.get_angle(this.game.aim_x, this.game.aim_y, this.mouse_x, this.mouse_y);
        console.log(theta);
        
        let [dx, dy] = PosUtil.rec(theta, Engine.aim_line_length);

        this.cx.moveTo(this.game.aim_x, this.game.aim_y);
        this.cx.lineTo(this.game.aim_x + dx, this.game.aim_y - dy);
        // this.cx.lineTo(this.mouse_x, this.mouse_y);
        // console.log(this.game.aim_y - this.mouse_y);
        
        this.cx.stroke();
    }

    private draw_ball(ball: Ball){
        this.cx.fillStyle = Constants.C_FOREROUND;
        this.cx.beginPath();
        this.cx.ellipse(
            ball.x,
            ball.y, 
            Engine.ball_radius, 
            Engine.ball_radius, 
            0, 
            0, 
            2*Math.PI
        );
        this.cx.fill();
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
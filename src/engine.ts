import * as Constants from './constants.js';

export class Engine{
    // canvas API
    private c: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    private frame_timer: number;

    static readonly frame_rate: number = 120;                      // number of frames to be shown per second
    static readonly frame_time: number = 1000 / Engine.frame_rate; // amount of ms each frame is to be shown for
    static readonly time_step: number = 1 / Engine.frame_rate;     // number of seconds each frame is shown for
    
    static readonly width: number = 720;
    static readonly height: number = 1280;

    constructor(){
        this.c = <HTMLCanvasElement> document.getElementById('c');
        this.cx = this.c.getContext('2d');

        this.init_size();
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
        }, Engine.frame_time);
    }

    update(){

    }

    draw(){
        this.clear();
    }

    clear(){
        //background
        this.cx.fillStyle = Constants.C_BACKGROUND;
        this.cx.fillRect(0, 0, this.c.width, this.c.height);
    }
}
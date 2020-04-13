export class Engine{
    // canvas API
    private c: HTMLCanvasElement;
    private cx: CanvasRenderingContext2D;

    static readonly frame_rate: number = 120;                      // number of frames to be shown per second
    static readonly frame_time: number = 1000 / Engine.frame_rate; // amount of ms each frame is to be shown for
    static readonly time_step: number = 1 / Engine.frame_rate;     // number of seconds each frame is shown for
    
    static readonly width: number = 640;
    static readonly height: number = 480;

    constructor(){
        this.c = <HTMLCanvasElement> document.getElementById('c');
        this.cx = this.c.getContext('2d');
        console.log(Engine.frame_rate);

        this.init_size();
    }

    private init_size(){
        this.c.width = Engine.width;
        this.c.height = Engine.height;
    }

    run(){
        
    }
}
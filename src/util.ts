export class PosUtil {
    static get_angle(x1: number, y1: number, x2: number, y2: number){
        let dy = y1 - y2;
        let dx = x2 - x1;
        
        return Math.atan2(dy, dx);
    }

    static rec(t: number, r: number){
        return [r*Math.cos(t), r*Math.sin(t)];
    }

    static pol(x: number, y: number){
        return [Math.atan2(y, x), PosUtil.dist(0, 0, x, y)];
    }

    static dist(x1: number, y1: number, x2: number, y2: number){
        let dy = y1 - y2;
        let dx = x2 - x1;

        return Math.sqrt(dy*dy + dx*dx);
    }
}

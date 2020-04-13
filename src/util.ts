export class PosUtil {
    static get_angle(x1: number, y1: number, x2: number, y2: number){
        let dy = y1 - y2;
        let dx = x2 - x1;
        
        // console.log(y1 + "-" + y2 + " = "+dy);
        console.log(dy + "x" + dx);

        
        return PosUtil.pol(dx, dy);
    }

    static rec(t: number, r: number){
        return [r*Math.cos(t), r*Math.sin(t)];
    }

    static pol(x: number, y: number){
        return Math.atan2(y, x);
    }
}

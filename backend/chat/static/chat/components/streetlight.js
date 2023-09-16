class StreetLight {
    constructor(x, y)  {
        this.x = x
        this.y = y
        this.rayCount=400;
        this.rayLength=500;
        this.raySpread=Math.PI;
        this.rays=[];
        this.readings=[];
    }
    update(traffic){
        this.#castRays();
        this.readings=[];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(this.#getReading(this.rays[i], traffic));
        }
        return traffic
    }
    #getReading(ray, traffic){
        let touches=[];

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets = touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset);
        }
    }
    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            let rayAngle=lerp(
                this.raySpread/2, 
                -this.raySpread/2, 
                this.rayCount==1?0.5:i/(this.rayCount-1)
            ) 
            rayAngle = rayAngle + (this.x===0 ? -Math.PI/2 : Math.PI/2);
            const start={x:this.x, y:this.y};
            const end={
                x:this.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.y-
                    Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let start = this.rays[i][0];
            let end = this.rays[i][1];
            let final = this.rays[i][1];
            let a = 0.9;
            if(this.readings[i]){
                end=this.readings[i];
            }
            ctx.save()
            let grad = ctx.createLinearGradient(start.x, start.y, final.x, final.y);
            grad.addColorStop(0, "yellow");
            grad.addColorStop(1, "rgba(255, 255, 0, 0.05)");
            ctx.strokeStyle = grad;
            ctx.globalAlpha = 0.15;
            ctx.beginPath();
            ctx.lineWidth=2;
            // ctx.strokeStyle="yellow";
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.lineWidth=2;
            // ctx.strokeStyle="yellow";
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(final.x, final.y);
            ctx.stroke();

            ctx.restore()
        }
    }
}
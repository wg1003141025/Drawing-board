class Palette{
    constructor(mask,canvas,eraser1){
        this.canvas = canvas;
        this.mask = mask;
        this.eraser = eraser1;
        this.ctx = this.canvas.getContext("2d");
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.linewidth = 3;
        this.history = [];
        //this.kong = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
        this.PI = Math.PI;
        this.fillstyle = "#000";
        this.strokestyle = "#000";
    }
    _init(){
        this.ctx.fillStyle = this.fillstyle;
        this.ctx.strokeStyle = this.strokestyle;
    }
    draw(type,num){
        let that = this;
        document.onkeydown = function (e) {
            if (e.ctrlKey && e.key == 'z'){
                that.history.pop();
                if(that.history.length > 0){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }else{
                    that.ctx.clearRect(0,0,that.cw,that.ch);
                }
            }
        }
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX , oy = e.offsetY;
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX , my = e.offsetY;
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if (that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                that._init();
                that[type](ox,oy,mx,my,num);
            };
            that.mask.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
            }
        }
    }
    //实线
    line(ox,oy,mx,my){
        let that = this;
        that.ctx.beginPath();
        that.ctx.moveTo(ox,oy);
        that.ctx.lineTo(mx,my);
        that.ctx.lineWidth = that.linewidth;
        that.ctx.stroke();
    }
    //虚线
    dashed(ox,oy,mx,my){
        let that = this;
        that.ctx.setLineDash([5,5]);        //样式为虚线
        that.ctx.beginPath();
        that.ctx.moveTo(ox,oy);
        that.ctx.lineTo(mx,my);
        that.ctx.lineWidth = this.linewidth;
        that.ctx.stroke();
        that.ctx.setLineDash([0,0]);
    }
    //铅笔
    pencil(){
        let that = this;
        //let imagedate = [];
        that.mask.onmousedown = function (e) {
            let ox = e.offsetX , oy = e.offsetY;
            that.ctx.beginPath();
            that.ctx.moveTo(ox,oy);
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX , my = e.offsetY;
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if (that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }
                that.ctx.lineTo(mx,my);
                that.ctx.lineWidth = that.linewidth;
                that._init();
                that.ctx.stroke();
            };
            that.mask.onmouseup = function () {
                that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
            }
        }
    }
    //圆
    circular(ox,oy,mx,my){
        let that = this;
        that.ctx.beginPath();
        let r = Math.sqrt(Math.pow(mx-ox,2)+Math.pow(my-oy,2));
        that.ctx.moveTo(ox + r,oy);
        that.ctx.arc(ox,oy,r,0,2*Math.PI);
        that.ctx.lineWidth = that.linewidth;
        that.ctx[that.style]();
    }
    //矩形
    rectangle(ox,oy,mx,my){
        let that = this;
        that.ctx.beginPath();
        that.ctx.moveTo(ox , oy);
        that.ctx.rect(ox, oy, mx-ox, my-oy)
        that.ctx.lineWidth = that.linewidth;
        that.ctx.closePath();
        that.ctx[that.style]();
    }
    //多边形
    polygon(ox,oy,mx,my,num){
        let that = this;
        that.ctx.beginPath();
        let r = Math.sqrt(Math.pow(mx-ox,2)+Math.pow(my-oy,2));
        that.ctx.moveTo(ox + r,oy);
        for(let i = 0;i < num;i++){
            let x = ox + r * Math.cos(Math.PI*2/num*i);
            let y = oy + r * Math.sin(Math.PI*2/num*i);
            that.ctx.lineTo(x,y);
        }
        that.ctx.lineWidth = that.linewidth;
        that.ctx.closePath();
        that.ctx[that.style]();
    }
    //多角形
    Polygonj(ox,oy,mx,my,num){
        let that = this;
        that.ctx.beginPath();
        let r = Math.sqrt(Math.pow(mx-ox,2)+Math.pow(my-oy,2));
        that.ctx.moveTo(ox + r,oy);
        for(let i = 0;i < num*2;i++){
            let x , y;
            if (i % 2 == 0){
                x = ox + r * Math.cos(Math.PI*2/(num*2)*i);
                y = oy + r * Math.sin(Math.PI*2/(num*2)*i);
            }else{
                x = ox + r/2 * Math.cos(Math.PI*2/(num*2)*i);
                y = oy + r/2 * Math.sin(Math.PI*2/(num*2)*i);
            }
            that.ctx.lineTo(x,y);
        }
        that.ctx.lineWidth = that.linewidth;
        that.ctx.closePath();
        that.ctx[that.style]();
    }
    //撤回
    withdraw(){
        if(this.history.length > 0){
            this.history.pop();
            this.ctx.putImageData(this.history[this.history.length-1],0,0);
        }else{
            this.ctx.clearRect(0,0,this.cw,this.ch);
        }
    }
    //橡皮
    era(w){
        let that = this;
        that.mask.onmousedown = function (e) {
            that.eraser.style.display = 'block';

            let ox = e.offsetX , oy = e.offsetY;
            that.eraser.style.left = ox - w/2 + 'px';
            that.eraser.style.top = oy - w/2 + 'px';
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX , my = e.offsetY;
                let p1 = my - w/2;
                let p2 = mx - w/2;
                that.ctx.clearRect(mx - w/2,my - w/2,w,w);
                let lefts = that.mask.offsetWidth - w;
                let tops = that.mask.offsetHeight - w;
                if(p1 > tops){
                    p1 = tops;
                }
                if(p2 > lefts){
                    p2 = lefts;
                }
                if(p1 < 0){
                    p1 = 0;
                }
                if(p2 < 0){
                    p2 = 0;
                }
                that.eraser.style.top = p1 + 'px';
                that.eraser.style.left = p2 + 'px';
            }
            that.mask.onmouseup = function(){
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
                that.eraser.style.display = 'none';
            }
        }
    }
    //文字
    font(){
        this.mask.onmousedown = function (e) {
            this.mask.onmousedown = null;      //一次性事件则需要清空
            let ox = e.offsetX , oy = e.offsetY;
            let inputs = document.createElement('input');
            inputs.style.cssText = `
            width: 100px;
            height: 30px;
            border: 5px solid #ccc;
            position: absolute;
            left: ${ox}px;
            top: ${oy}px;
            z-index: 20;
            `;
            inputs.autofocus = true;
            this.mask.appendChild(inputs);
            inputs.onblur = function () {
                let ox = inputs.offsetLeft , oy = inputs.offsetTop;
                let v = inputs.value;
                //let that = this;
                this.mask.removeChild(inputs);
                this.ctx.font = "18px 微软雅黑";
                this.ctx.fillText(v,ox,oy);
                this.history.push(this.ctx.getImageData(0, 0, this.cw, this.ch));
                //this.ctx.strokeText(v,ox,oy);
                //that.ctx[that.style]();
            }.bind(this);
            inputs.onmousedown = function (e) {
                let ox = inputs.offsetLeft , oy = inputs.offsetTop , cx = e.clientX , cy = e.clientY;
                this.mask.onmousemove = function (e) {
                    let mx = e.clientX , my = e.clientY;
                    inputs.style.left = (mx - cx + ox + 'px');
                    inputs.style.top = (my - cy + oy + 'px');

                }.bind(this);
                inputs.onmouseup = function () {
                    //console.log(history);
                    inputs.onmouseup = null;
                    this.mask.onmousemove = null;
                }.bind(this);
            }.bind(this);
        }.bind(this);
    }
    //裁剪
    clip(clip1){
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX , oy = e.offsetY , w , h , minx , miny;
            clip1.style.display = 'block';
            //clip1.style.left = ox + 'px';
            //clip1.style.top = oy + 'px';
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX , my = e.offsetY;
                w = Math.abs(mx - ox);
                h = Math.abs(my - oy);
                minx = mx < ox ? mx : ox;
                miny = my < oy ? my : oy;
                clip1.style.width = w+'px';
                clip1.style.height = h+'px';
                clip1.style.left = minx + 'px';
                clip1.style.top = miny + 'px';
            }
            that.mask.onmouseup = function () {
                that.mask.onmousemove = null;
                that.mask.onmouseup = null;
                that.temp = that.ctx.getImageData(minx,miny,w,h);
                that.ctx.clearRect(minx,miny,w,h);
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
                that.ctx.putImageData(that.temp,minx,miny);
                that.drag(clip1,minx,miny);
            }
        }
    }
    drag(obj,minx,miny){
        let that = this;
        this.mask.onmousedown = function (e) {
            let ox = e.offsetX , oy = e.offsetY;
            that.mask.onmousemove = function (e) {
                let mx = e.offsetX , my = e.offsetY;
                let lefts = minx + mx - ox , tops = miny + my - oy;
                obj.style.left = lefts + 'px';
                obj.style.top = tops + 'px';
                that.ctx.clearRect(0,0,that.cw,that.ch);
                if(that.history.length){
                    that.ctx.putImageData(that.history[that.history.length-1],0,0);
                }that.ctx.putImageData(that.temp,lefts,tops);
            }
            that.mask.onmouseup = function () {
                that.mask.onmousedown = null;
                that.mask.onmouseup = null;
                that.mask.onmousemove = null;
                obj.style.display = 'none';
                that.history.push(that.ctx.getImageData(0, 0, that.cw, that.ch));
            }
        }
    }
}
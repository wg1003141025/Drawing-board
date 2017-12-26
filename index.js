window.onload = function () {
    let canvas = document.querySelector("canvas");
    let mask = document.querySelector(".mask");
    let twoli = document.querySelectorAll(".two>li");
    let oneli = document.querySelectorAll(".one>li");
    let threeli = document.querySelectorAll(".styleBtn");
    let colorBtn = document.querySelectorAll("input[type=color]");
    let numberBtn = document.querySelector("input[type=number]");
    let withdraw = document.querySelector("#withdraw");
    let eraser = document.querySelector("#eraser");
    let eraser1 = document.querySelector(".eraser1");
    let fontBtn = document.querySelector("#font");
    let clipBtn = document.querySelector("#clip");
    let clip1 = document.querySelector(".clip");
    let save = document.querySelector("a");
    let palette = new Palette(mask,canvas,eraser1);
    twoli.forEach(ele => {
        ele.onclick = function () {
            let type = this.id;
            twoli.forEach(ele => {ele.classList.remove("active")});
            this.classList.add("active");
            if (type == 'polygon' || type == 'Polygonj'){
                let value = prompt('请输入边数');
                //let value = numberBtn.value;
                palette.draw(type,value);
            }else{
                //palette[type]();
                palette.draw(type);
            }
        }
    });
    twoli[0].onclick();
    oneli.forEach(ele => {
        ele.onclick = function () {
            let type = this.id;
            oneli.forEach(ele => {ele.classList.remove("active")});
            this.classList.add("active");
        }
    });
    threeli.forEach(ele => {
        ele.onclick = function () {
            let type = ele.id;
            threeli.forEach(ele => {ele.classList.remove("active")});
            this.classList.add("active");
            palette.style = this.id;
        }
    });
    threeli[0].onclick();
    colorBtn.forEach(ele =>{
        ele.onchange = function () {
            console.log(this.value);
            palette[this.id] = this.value;
        }
    })
    numberBtn.onchange = function () {
        palette.linewidth = this.value;
    }
    withdraw.onclick = function () {
        palette.withdraw();
    }
    eraser.onclick = function () {
        let w = parseInt(prompt('请输入橡皮尺寸'));
        twoli.forEach(ele => {ele.classList.remove("active")});
        eraser.classList.add("active");
        eraser1.style.width = w+'px';
        eraser1.style.height = w+'px';
        palette.era(w);
    }
    fontBtn.onclick = function () {
        twoli.forEach(ele => {ele.classList.remove("active")});
        fontBtn.classList.add("active");
        palette.font();
    }
    clipBtn.onclick = function () {
        oneli.forEach(ele => {ele.classList.remove("active")});
        clipBtn.classList.add("active");
        palette.clip(clip1);
    }
    save.onclick = function () {
        let data = canvas.toDataURL('image/png');
        save.href = data;
        save.download = '1.png';
    }
};
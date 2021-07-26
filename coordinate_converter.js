function putPixel(canvas, context, color, Cx, Cy) {
    let Sx = Cx + canvas.width/2;
    let Sy = canvas.height/2 - Cy;
    context.fillStyle = color;
    context.fillRect(Sx, Sy, 1, 1);
}

function canvasToViewport(canvas, Cx, Cy, d) {
    let Vw = 1;
    let Vh = 1;
    let Cw = canvas.width;
    let Ch = canvas.height;
    let Vx = Cx * Vw/Cw;
    let Vy = Cy * Vh/Ch;
    return [Vx, Vy, d];
}
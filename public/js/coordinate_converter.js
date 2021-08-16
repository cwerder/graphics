function putPixel(canvas, canvas_buffer, canvas_pitch, color, Cx, Cy) {
    let Sx = Cx + canvas.width/2;
    let Sy = canvas.height/2 - Cy;
    let offset = 4*Sx + canvas_pitch*Sy;
    canvas_buffer.data[offset++] = color[0];
    canvas_buffer.data[offset++] = color[1];
    canvas_buffer.data[offset++] = color[2];
    canvas_buffer.data[offset++] = 255;
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
const app = getApp();
let canvas,gl,width,height,nativeCanvas2d,nativeCanvas2dCtx,nativeCanvasGl,nativeCanvasGlCtx;
let stopAnimate = false;
let animateId = -1;
Page({
  data: {
    width: 100,
    id: '123'
  },
  onReady() {
    let res = tt.getSystemInfoSync();
    this.draw_web(this.data.id);
    this.draw_native('#canvas_type_2d', '2d');
    this.draw_native('#canvas_type_webgl', 'webgl');
  },
  onUnload() {
    this.cancelAnimationFrame();
  },
  draw_web(id) {
    console.log(id);
    const ctx = tt.createCanvasContext(id);
    ctx.beginPath();
    ctx.arc(20, 20, 10, 0, Math.PI * 2);
    ctx.rect(10, 30, 20, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(17, 18, 2, 0, Math.PI * 2);
    ctx.arc(23, 18, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = 3;
    ctx.moveTo(18, 25);
    ctx.quadraticCurveTo(23, 22, 26, 23);
    ctx.stroke();
    ctx.restore();
    ctx.draw();
  },
  draw_native(id, type) {
    tt.createSelectorQuery()
      .select(id)
      .node()
      .exec((res) => {
        const canvas = res[0].node;
        let ctx = canvas.getContext(type);
        this.draw_byType(ctx, type, canvas);
      });
  },
  draw_byType(ctx, type, canvas) {
    if (type === '2d') {
      nativeCanvas2d = canvas;
      nativeCanvas2dCtx = ctx;
      this.draw_native_2d(0, 0, 50, 50);
      this.draw_native_2d1(50, 50, 50, 50);
    } else {
      nativeCanvasGl = canvas;
      nativeCanvasGlCtx = ctx;
      this.draw_native_gl(1, 0, 1, 1);
    }
  },
  draw_native_2d(x, y, width, height) {
    let that = this;
    let num = nativeCanvas2d.requestAnimationFrame(function () {
      nativeCanvas2dCtx.fillStyle = 'red';
      nativeCanvas2dCtx.fillRect(x, y, width, height);
    });
  },
  draw_native_2d1(x, y, width, height) {
    let that = this;
    let num = nativeCanvas2d.requestAnimationFrame(function () {
      nativeCanvas2dCtx.fillStyle = 'red';
      nativeCanvas2dCtx.fillRect(x, y, width, height);
    });
  },
  draw_native_gl(r, g, b, a) {
    let that = this;
    nativeCanvasGl.requestAnimationFrame(function () {
      nativeCanvasGlCtx.clearColor(r, g, b, a);
      nativeCanvasGlCtx.clear(nativeCanvasGlCtx.COLOR_BUFFER_BIT);
    });
  },
  drawGl(e) {
    gl = canvas.getContext('webgl', { alpha: true });
    gl.clearColor(0.0, 0.3, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.cancelAnimationFrame();
  },
  cancelAnimationFrame() {
    if (!stopAnimate) {
      stopAnimate = true;
      canvas.cancelAnimationFrame(animateId);
    }
  },
  testBindtouchstart(e) {
    console.log('--- mytouchstart', e);
  },
  testBindtouchmove(e) {
    console.log('--- mytouchmove', e);
  },
  testBindtouchend(e) {
    console.log('--- mytouchend', e);
  },
  testBindtouchcancel(e) {
    console.log(e);
  },
  testBinderror(e) {
    console.log('==== canvas err', e);
  },
});

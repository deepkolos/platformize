import * as PIXI from '../pixi';

export function GraphicsSimple(canvas: any) {
  PIXI.__init__();
  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    antialias: true,
    resolution: window.devicePixelRatio,
  });
  document.body.appendChild(app.view);

  const graphics = new PIXI.Graphics();

  // Rectangle
  graphics.beginFill(0xde3249);
  graphics.drawRect(25, 25, 50, 50);
  graphics.endFill();

  // Rectangle + line style 1
  graphics.lineStyle(2, 0xfeeb77, 1);
  graphics.beginFill(0x650a5a);
  graphics.drawRect(100, 25, 50, 50);
  graphics.endFill();

  // Rectangle + line style 2
  graphics.lineStyle(5, 0xffbd01, 1);
  graphics.beginFill(0xc34288);
  graphics.drawRect(175, 25, 50, 50);
  graphics.endFill();

  // Rectangle 2
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.beginFill(0xaa4f08);
  graphics.drawRect(265, 25, 70, 50);
  graphics.endFill();

  // Circle
  graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
  graphics.beginFill(0xde3249, 1);
  graphics.drawCircle(50, 125, 25);
  graphics.endFill();

  // Circle + line style 1
  graphics.lineStyle(2, 0xfeeb77, 1);
  graphics.beginFill(0x650a5a, 1);
  graphics.drawCircle(125, 125, 25);
  graphics.endFill();

  // Circle + line style 2
  graphics.lineStyle(5, 0xffbd01, 1);
  graphics.beginFill(0xc34288, 1);
  graphics.drawCircle(200, 125, 25);
  graphics.endFill();

  // Ellipse + line style 2
  graphics.lineStyle(2, 0xffffff, 1);
  graphics.beginFill(0xaa4f08, 1);
  graphics.drawEllipse(300, 125, 40, 25);
  graphics.endFill();

  // draw a shape
  graphics.beginFill(0xff3300);
  graphics.lineStyle(4, 0xffd900, 1);
  graphics.moveTo(25, 175);
  graphics.lineTo(125, 175);
  graphics.lineTo(50, 200);
  graphics.lineTo(25, 175);
  graphics.closePath();
  graphics.endFill();

  // draw a rounded rectangle
  graphics.lineStyle(2, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(25, 220, 50, 50, 8);
  graphics.endFill();

  // draw star
  graphics.lineStyle(2, 0xffffff);
  graphics.beginFill(0x35cc5a, 1);
  graphics.drawStar(180, 190, 5, 25);
  graphics.endFill();

  // draw star 2
  graphics.lineStyle(2, 0xffffff);
  graphics.beginFill(0xffcc5a, 1);
  graphics.drawStar(140, 255, 7, 25);
  graphics.endFill();

  // draw star 3
  graphics.lineStyle(4, 0xffffff);
  graphics.beginFill(0x55335a, 1);
  graphics.drawStar(235, 225, 4, 25);
  graphics.endFill();

  // draw polygon
  const path = [300, 175, 350, 230, 390, 210, 380, 285, 295, 260];

  graphics.lineStyle(0);
  graphics.beginFill(0x3500fa, 1);
  graphics.drawPolygon(path);
  graphics.endFill();

  app.stage.addChild(graphics);
  return app;
}

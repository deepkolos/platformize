import { Demo } from './Demo';
import {
  Group,
  MeshBasicMaterial,
  Color,
  DoubleSide,
  ShapeBufferGeometry,
  Mesh,
  GridHelper,
  LinearEncoding,
} from 'three';
import {
  SVGLoader,
  SVGResult,
} from 'three/examples/jsm/loaders/SVGLoader';

const baseUrl = 'https://techbrood.com/threejs';

export class DemoSVGLoader extends Demo {
  async init(): Promise<void> {
    const { camera, renderer } = this.deps;
    const svgLoader = new SVGLoader();
    const svg = (await svgLoader.loadAsync(
      baseUrl + '/examples/models/svg/tiger.svg',
      // 'http://192.168.0.103:8080/test.svg'
    )) as SVGResult;

    const helper = new GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;

    this.add(helper);
    this.add(this.initSVG(svg));
    this.addControl();

    camera.position.set(0, 0, 200);
    renderer.outputEncoding = LinearEncoding;
  }

  initSVG(svg: SVGResult) {
    const guiData = {
      drawFillShapes: true,
      drawStrokes: true,
      fillShapesWireframe: false,
      strokesWireframe: false,
    };

    const { paths } = svg;
    var group = new Group();
    group.scale.multiplyScalar(0.25);
    group.position.x = -70;
    group.position.y = 70;
    group.scale.y *= -1;

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];

      var fillColor = path.userData.style.fill;
      if (
        guiData.drawFillShapes &&
        fillColor !== undefined &&
        fillColor !== 'none'
      ) {
        var material = new MeshBasicMaterial({
          color: new Color().setStyle(fillColor),
          opacity: path.userData.style.fillOpacity,
          transparent: path.userData.style.fillOpacity < 1,
          side: DoubleSide,
          depthWrite: false,
          wireframe: guiData.fillShapesWireframe,
        });

        var shapes = path.toShapes(true);

        for (var j = 0; j < shapes.length; j++) {
          var shape = shapes[j];

          var geometry = new ShapeBufferGeometry(shape);
          var mesh = new Mesh(geometry, material);

          group.add(mesh);
        }
      }

      var strokeColor = path.userData.style.stroke;
      if (
        guiData.drawStrokes &&
        strokeColor !== undefined &&
        strokeColor !== 'none'
      ) {
        var material = new MeshBasicMaterial({
          color: new Color().setStyle(strokeColor),
          opacity: path.userData.style.strokeOpacity,
          transparent: path.userData.style.strokeOpacity < 1,
          side: DoubleSide,
          depthWrite: false,
          wireframe: guiData.strokesWireframe,
        });

        for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
          var subPath = path.subPaths[j];

          var geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style,
          );

          if (geometry) {
            var mesh = new Mesh(geometry, material);

            group.add(mesh);
          }
        }
      }
    }

    return group;
  }

  update(): void {
    this.orbitControl?.update();
  }

  dispose(): void {
    this.reset();
  }
}

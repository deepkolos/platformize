import { baseUrl, Demo } from './Demo';
import { PDB, PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import {
  BoxBufferGeometry,
  Color,
  Group,
  IcosahedronBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Vector3,
  DirectionalLight,
  LinearEncoding,
} from 'three';

export class DemoPDBLoader extends Demo {
  obj!: Group;
  controls!: TrackballControls;

  async init(): Promise<void> {
    const { camera, scene, renderer } = this.deps;

    camera.position.z = 100;
    scene.position.z = 0;
    scene.background = new Color(0x050505);
    renderer.outputEncoding = LinearEncoding;

    this.addControl();

    this.obj = new Group();
    this.obj.scale.set(0.1, 0.1, 0.1);
    this.add(this.obj);
    const light1 = new DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    const light2 = new DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, 1);
    this.add(light1);
    this.add(light2);

    const loader = new PDBLoader();
    const pdb = await loader.loadAsync(
      baseUrl + '/models/molecules/caffeine.pdb',
    );
    this.loadMolecule(pdb);
  }
  update(): void {
    this.orbitControl?.update();
  }
  dispose(): void {
    this.reset();
  }

  loadMolecule(pdb: PDB) {
    var geometryAtoms = pdb.geometryAtoms;
    var geometryBonds = pdb.geometryBonds;
    var json = pdb.json;
    var offset = new Vector3();

    var boxGeometry = new BoxBufferGeometry(1, 1, 1);
    var sphereGeometry = new IcosahedronBufferGeometry(1, 2);

    geometryAtoms.computeBoundingBox();
    geometryAtoms.boundingBox?.getCenter(offset).negate();

    geometryAtoms.translate(offset.x, offset.y, offset.z);
    geometryBonds.translate(offset.x, offset.y, offset.z);

    var positions = geometryAtoms.getAttribute('position');
    var colors = geometryAtoms.getAttribute('color');

    var position = new Vector3();
    var color = new Color();

    for (var i = 0; i < positions.count; i++) {
      position.x = positions.getX(i);
      position.y = positions.getY(i);
      position.z = positions.getZ(i);

      color.r = colors.getX(i);
      color.g = colors.getY(i);
      color.b = colors.getZ(i);

      var material = new MeshPhongMaterial({ color: color });

      const object = new Mesh(sphereGeometry, material);
      object.position.copy(position);
      object.position.multiplyScalar(75);
      object.scale.multiplyScalar(25);
      this.obj.add(object);

      var atom = json.atoms[i];
    }

    positions = geometryBonds.getAttribute('position');

    var start = new Vector3();
    var end = new Vector3();

    for (var i = 0; i < positions.count; i += 2) {
      start.x = positions.getX(i);
      start.y = positions.getY(i);
      start.z = positions.getZ(i);

      end.x = positions.getX(i + 1);
      end.y = positions.getY(i + 1);
      end.z = positions.getZ(i + 1);

      start.multiplyScalar(75);
      end.multiplyScalar(75);

      const object = new Mesh(
        boxGeometry,
        new MeshPhongMaterial({ color: 0xffffff }),
      );
      object.position.copy(start);
      object.position.lerp(end, 0.5);
      object.scale.set(5, 5, start.distanceTo(end));
      object.lookAt(end);
      this.obj.add(object);
    }
  }
}

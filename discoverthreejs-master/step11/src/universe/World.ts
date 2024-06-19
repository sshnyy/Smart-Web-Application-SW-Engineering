import { createCamera } from './components/camera';
import { createMeshGroup } from './components/meshGroup';
import { createLights } from './components/lights';
import { createScene } from './components/scene';

import { createControls } from './systems/controls';
import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';
import { Loop } from './systems/Loop';

class World {
    private camera;
    private scene;
    private renderer;
    private loop;

    // 1. Create an instance of the World app
    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();

        this.loop = new Loop(this.camera, this.scene, this.renderer);

        container.append(this.renderer.domElement);

        const controls = createControls(this.camera, this.renderer.domElement);
        const meshGroup = createMeshGroup();
        const { ambientLight, mainLight } = createLights();

        this.loop.updatables.push(controls, meshGroup);

        // stop the cube's animation
        //this.loop.updatables.push(cube);

        this.scene.add(ambientLight, mainLight, meshGroup);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }
}

export { World };
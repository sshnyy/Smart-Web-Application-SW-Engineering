import { loadBirds } from './components/birds/birds';
import { createCamera } from './components/camera';
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
    private controls;

    // 1. Create an instance of the World app
    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.controls = createControls(this.camera, this.renderer.domElement);

        this.loop = new Loop(this.camera, this.scene, this.renderer);

        container.append(this.renderer.domElement);

        const { ambientLight, mainLight } = createLights();

        this.loop.updatables.push(this.controls);

        // stop the cube's animation
        //this.loop.updatables.push(cube);

        this.scene.add(ambientLight, mainLight);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    async init() {
        // asynchronous setup here
        // load bird models
        const { parrot, flamingo, stork } = await loadBirds();

        // move the target to the center of the front bird
        this.controls.target.copy(parrot.position);

        this.loop.updatables.push(parrot, flamingo, stork);

        this.scene.add(parrot, flamingo, stork);
    }

    public start() {
        this.loop.start();
    }

    public stop() {
        this.loop.stop();
    }
}

export { World };
import { createCamera } from './components/camera';
import { createCube } from './components/cube';
import { createScene } from './components/scene';

import { createRenderer } from './systems/renderer';
import { Resizer } from './systems/Resizer';

class World {
    private camera;
    private scene;
    private renderer;

    // 1. Create an instance of the World app
    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();

        container.append(this.renderer.domElement);

        const cube = createCube();

        this.scene.add(cube);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    // 2. Render the scene
    public render() {
        // draw a single frame
        this.renderer.render(this.scene, this.camera);
    }
}

export { World };
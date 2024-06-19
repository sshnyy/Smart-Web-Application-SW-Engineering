import { createCamera } from './components/camera';
import { createCube } from './components/cube';
import { createLights } from './components/lights';
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
        const light = createLights();

        this.scene.add(cube, light);

        const resizer = new Resizer(container, this.camera, this.renderer);

        // hook onResize function(line 19) of Resizer
        resizer.onResize = () => {
            this.render();
        };
    }

    // 2. Render the scene
    public render() {
        // draw a single frame
        this.renderer.render(this.scene, this.camera);
    }
}

export { World };
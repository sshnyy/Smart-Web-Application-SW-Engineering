import {
    Clock,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class Loop {
    private camera;
    private scene;
    private renderer;
    private clock;

    //public updatables: Mesh[];
    public updatables: OrbitControls[];

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
        this.clock = new Clock();
    }

    public start() {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            this.tick();

            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }

    public stop() {
        this.renderer.setAnimationLoop(null);
    }

    private tick() {
        // only call the getDelta function once per frame!
        const delta = this.clock.getDelta();

        // Code to update animations will go here
        for (const object of this.updatables as any) {
            object.tick(delta);
        }
    }
}

export { Loop };
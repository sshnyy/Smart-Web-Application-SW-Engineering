import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createControls(camera: PerspectiveCamera, canvas: HTMLElement) {
    const controls = new OrbitControls(camera, canvas);

    // damping require the controls to be updated each frame
    controls.enableDamping = true;

    (controls as any).tick = () => controls.update();

    return controls;
}

export { createControls };
import { AmbientLight, DirectionalLight } from 'three';

function createLights() {
    const ambientLight = new AmbientLight('white', 0.5);

    // Create a directional light
    const mainLight = new DirectionalLight('white', 10);

    // move the light right, up, and towards us
    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}

export { createLights };
import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';

function createLights() {
    //const ambientLight = new AmbientLight('white', 0.5);
    const ambientLight = new HemisphereLight(
        'white',
        'darkslategray',
        10,
    );

    // Create a directional light
    const mainLight = new DirectionalLight('white', 27);

    // move the light right, up, and towards us
    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}

export { createLights };
import {
    BoxGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial
} from 'three';

function createCube() {
    // create a geometry
    const geometry = new BoxGeometry(2, 2, 2);

    // Switch the old "basic" material to
    // a physically correct "standard" material
    const material = new MeshStandardMaterial({ color: 'purple' });

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);
    
    cube.rotation.set(-0.5, -0.1, 0.8);

    const radiansPerSecond = MathUtils.degToRad(30);

    // this method will be called once per frame
    (cube as any).tick = (delta: number) => {
        // increase the cube's rotation each frame
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;
    };

    return cube;
}

export { createCube };
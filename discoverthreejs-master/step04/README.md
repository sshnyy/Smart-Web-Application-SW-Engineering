# Physically Based Rendering and Lighting

## Create Physically Sized Scenes

### Units of size in three.js are meters

- The 2×2×2 cube we created earlier is two meters long on each side.
- `camera.far = 100` means we can see for a distance of one hundred meters.
- `camera.near = 0.1` means objects closer to the camera than ten centimeters will not be visible.

```text
1 unit = 1 meter
```

## Lighting in three.js

1. **Direct lighting**: light rays that come directly from the bulb and hit an object.
2. **Indirect lighting**: light rays that have bounced off the walls and other objects in the room before hitting an object, changing color, and losing intensity with each bounce.

Matching these, the light classes in three.js are split into two types:

1. **Direct lights**, which simulate direct lighting.
2. **Ambient lights**, which are a cheap and somewhat believable way of faking indirect lighting.

### Direct Lighting

- `DirectionalLight` => Sunlight
- `PointLight` => Light Bulbs
- `RectAreaLight` => Strip lighting or bright windows
- `SpotLight` => Spotlights

### Shadows are Disabled By Default

## Introducing the `DirectionalLight`

![image](<https://discoverthreejs.com/images/first-steps/directional_light.svg>)

```text
Light rays from a directional light
```

### Add a DirectionalLight to Our Scene

Open or create the components/lights.ts module, which will follow the same pattern as the other components in this folder.

<div align="right">lights.ts: create a DirectionalLight</div>

```ts
import { DirectionalLight } from 'three';

function createLights() {
    // Create a directional light
    const light = new DirectionalLight('white', 17);

    // move the light right, up, and towards us
    light.position.set(10, 10, 10);

    return light;
}

export { createLights };
```

<div align="right">World.ts: create a light and add it to the scene</div>

```ts
class World {
    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();

        container.append(this.renderer.domElement);

        const cube = createCube();
        const light = createLights();

        this.scene.add(cube, light);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }
```

## Switch to the Physically Based `MeshStandardMaterial`

Adding the light won’t have any immediate effect since we’re currently using a `MeshBasicMaterial`. This material ignores any lights in the scene. Here, we’ll switch to a `MeshStandardMaterial`.

### Switch the Cube’s Material and Rotate the Cube

![image](<https://discoverthreejs.com/images/first-steps/cube-medium.png>)

<div align="right">cube.ts: switch to a MeshStandardMaterial</div>

```ts
function createCube() {
    // create a geometry
    const geometry = new BoxGeometry(2, 2, 2);

    // Switch the old "basic" material to
    // a physically correct "standard" material
    const material = new MeshStandardMaterial({ color: 'purple' });

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);
    
    cube.rotation.set(-0.5, -0.1, 0.8);

    return cube;
}
```

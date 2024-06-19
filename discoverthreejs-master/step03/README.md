# Introducing the World App

## The World App

### The World Interface

<div align="right">index.ts: creating a world</div>

```ts
// 1. Create an instance of the World app
const world = new World(container);

// 2. Render the scene
world.render();
```

## The `World` Class

<div align="right">World.ts: initial setup</div>

```ts
class World {
    // 1. Create an instance of the World app
    constructor(container: HTMLElement) {}

    // 2. Render the scene
    public render() {}
}

export { World };
```

## Set Up index.ts

<div align="right">index.ts: initial setup</div>

```ts
import { World } from './universe/World';

// create the main function
function main() {
    // code to set up the World App will go here
}

// call main to start the app
main();
```

### Set up the World App

<div align="right">index.ts: create a whole new World</div>

```ts
function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container');

    // 1. Create an instance of the World app
    const world = new World(container);

    // 2. Render the scene
    world.render();
}
```

## World App Implementation

- components/camera.ts
- components/cube.ts
- components/scene.ts
- systems/renderer.ts
- systems/Resizer.ts

### Systems: the Renderer Module

First up is the renderer system:

<div align="right">systems/renderer.ts</div>

```ts
import { WebGLRenderer } from 'three';

function createRenderer() {
    const renderer = new WebGLRenderer();

    return renderer;
}

export { createRenderer };
```

### Components: The Scene Module

Next up, the scene component:

<div align="right">components/scene.ts</div>

```ts
import { Color, Scene } from 'three';

function createScene() {
    const scene = new Scene();

    scene.background = new Color('skyblue');

    return scene;
}

export { createScene };
```

### Components: The Camera Module

Third is the camera component:

<div align="right">components/camera.ts</div>

```ts
import { PerspectiveCamera } from 'three';

function createCamera() {
    const camera = new PerspectiveCamera(
        35,     // fov = Field Of View
        1,      // aspect ratio (dummy value)
        0.1,    // near clipping plane
        100,    // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(0, 0, 10);

    return camera;
}

export { createCamera };
```

### Components: The Cube Module

Fourth is the cube component:

<div align="right">components/cube.ts</div>

```ts
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

function createCube() {
    // create a geometry
    const geometry = new BoxGeometry(2, 2, 2);

    // create a default (white) Basic material
    const material = new MeshBasicMaterial();

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material);

    return cube;
}

export { createCube };
```

### Systems: the Resizer Module

Finally, we’ll create a stub for the Resizer module.

<div align="right">systems/Resizer.ts: initial setup</div>

```ts
class Resizer {
    constructor() {}
}

export { Resizer };
```

## Set Up the World Class

<div align="right">World.ts: imports</div>

```ts
import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
```

### Set Up the Camera, Renderer, and Scene

```ts
class World {
    ...

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
    }
```

### Add the Canvas to the Container

<div align="right">ts: append the canvas to the container</div>

```ts
constructor(container: HTMLElement) {
    ...
    container.append(this.renderer.domElement);
}
```

### Render the Scene

<div align="right">World.ts: complete the render method</div>

```ts
public render() {
    // draw a single frame
    this.renderer.render(this.scene, this.camera);
}
```

However, the canvas doesn’t take up the full size of the container since we haven’t completed the `Resizer` yet. Instead, it has been created at the default size for a `<canvas>` element, which is 300×150 pixels (in Chrome, at least).

![image](<https://discoverthreejs.com/images/first-steps/world_app_unsized_background.png>)

```text
The canvas is the red rectangle
```

<div align="right">scene.ts: temporarily make the canvas red to show that it doesn’t take up the full container yet</div>

```ts
scene.background = new Color("red");
```

### Create the Cube

<div align="right">World.ts: Create the cube and add it to the scene</div>

```ts
constructor(container: HTMLElement) {
    ...
    const cube = createCube();

    this.scene.add(cube);
}
```

## Systems: the Resizer Module

Everything we need to do in the Resizer class

```ts
class Resizer {
    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // Set the camera's aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight;

        // update the camera's frustum
        camera.updateProjectionMatrix();

        // update the size of the renderer AND the canvas
        renderer.setSize(container.clientWidth, container.clientHeight);

        // set the pixel ratio (for mobile devices)
        renderer.setPixelRatio(window.devicePixelRatio);
    }
}
```

The frustum is not automatically recalculated, so when we change any of these settings, stored in `camera.aspect`, `camera.fov`, `camera.near`, and `camera.far`, we also need to update the frustum.

The camera stores its frustum in a mathematical object called a projection matrix, and, to update this, we need to call the camera’s `.updateProjectionMatrix` method.

… and then create a resizer instance in the constructor:

<div align="right">World.ts: create the resizer</div>

```ts
constructor(container: HTMLElement) {
    ...
    const resizer = new Resizer(container, this.camera, this.renderer);
}
```

# Your First three.js Scene: Hello, Cube!

## The Components of a Real-Time 3D App

![image](<https://discoverthreejs.com/images/first-steps/rendered_scene_canvas.svg>)

### The Scene: a Tiny Universe

<div align="right">Creating a scene</div>

```ts
import { Scene } from 'three';

const scene = new Scene();
```

![image](<https://discoverthreejs.com/images/first-steps/coordinate_system_simple.svg>)

```text
The world space coordinate system, defined by the Scene
```

![image](<https://discoverthreejs.com/images/first-steps/scene_graph.svg>)

```text
Objects added to the Scene live in the scene-graph,
a tree of visible objects
```

### The Camera: a Telescope pointed at the Tiny Universe

<div align="right">Creating a PerspectiveCamera</div>

```ts
import { PerspectiveCamera } from 'three';

const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
```

### The Renderer: An Artist of Extraordinary Talent and Speed

<div align="right">Creating a renderer with default parameters</div>

```ts
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();
```

## Our First Visible Object: Mesh

![image](<https://discoverthreejs.com/images/first-steps/mesh_details.svg>)

```text
A mesh contains of a geometry and a material
```

<div align="right">Creating a mesh</div>

```ts
import { Mesh } from 'three';

const mesh = new Mesh(geometry, material);
```

### The Geometry

<div align="right">Creating a 2x2x2 box shaped geometry</div>

```ts
import { BoxBufferGeometry } from 'three';

const length = 2;
const width = 2;
const depth = 2;

const geometry = new BoxBufferGeometry(length, width, depth);
```

### The Material

<div align="right">Creating a basic material</div>

```ts
import { MeshBasicMaterial } from 'three';

const material = new MeshBasicMaterial();
```

## Our First three.js App

1. Initial Setup
2. Create the Scene
3. Create the Camera
4. Create a Visible Object
5. Create the Renderer
6. Render the Scene

### 1. Initial Setup

#### Import Classes from three.js

<div align="right">index.ts: importing the required three.js classes, NPM style</div>

```ts
import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
```

#### Access the HTML `scene-container` Element in JavaScript

<div align="right">index.html: the container element</div>

```html
<body>
  <h1>Discoverthreejs.com - Your First Scene</h1>

  <div id="scene-container">
    <!-- Our <canvas> will be inserted here -->
  </div>
</body>
```

<div align="right">index.ts: get a reference to the scene container</div>

```ts
// Get a reference to the container element that will hold our scene
const container = document.querySelector('#scene-container') as HTMLElement;
```

### 2. Create the Scene

![image](<https://discoverthreejs.com/images/first-steps/scene_only.svg>)

<div align="right">index.ts: create the scene</div>

```ts
// create a Scene
const scene = new Scene();
```

#### Set the Scene’s Background Color

<div align="right">index.ts: set the scene’s background color</div>

```ts
// Set the background color
scene.background = new Color('skyblue');
```

### 3. Create The Camera

![image](<https://discoverthreejs.com/images/first-steps/camera.svg>)

1. `fov`, or field of view: how wide the camera’s view is, in degrees.
2. `aspect`, or aspect ratio: the ratio of the scene’s width to its height.
3. `near`, or near clipping plane: anything closer to the camera than this will be invisible.
4. `far`, or far clipping plane: anything further away from the camera than this will be invisible.

=> If the `aspect` variable value is 1, check the shape of the cube when the browser size is adjusted

```ts
// Create a camera
const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new PerspectiveCamera(fov, aspect, near, far);
```

#### The Camera’s Viewing Frustum

![image](<https://discoverthreejs.com/images/first-steps/frustum.png>)

```text
A frustum
```

![image](<https://discoverthreejs.com/images/first-steps/perspective_frustum.svg>)

#### Position the Camera

<div align="right">index.ts: move the camera back on the Z-axis</div>

```ts
const camera = new PerspectiveCamera(fov, aspect, near, far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
camera.position.set(0, 0, 10);
```

### 4. Create a Visible Object

![image](<https://discoverthreejs.com/images/first-steps/box.png>)

#### Create a Geometry

<div align="right">index.ts: create a box geometry</div>

```ts
// create a geometry
const geometry = new BoxGeometry(2, 2, 2);
```

#### Create a Material

<div align="right">index.ts: create a default material</div>

```ts
// create a default (white) Basic material
const material = new MeshBasicMaterial();
```

#### Create the Mesh

![image](<https://discoverthreejs.com/images/first-steps/mesh_details.svg>)

<div align="right">index.ts: create the mesh</div>

```ts
// create a geometry
const geometry = new BoxGeometry(2, 2, 2);
 
// create a default (white) Basic material
const material = new MeshBasicMaterial();
 
// create a Mesh containing the geometry and material
const cube = new Mesh(geometry, material);
```

#### Add the Mesh to the Scene

<div align="right">index.ts: add the mesh to the scene</div>

```ts
// add the mesh to the scene
scene.add(cube);
```

### 5. Create the Renderer

![image](<https://discoverthreejs.com/images/first-steps/rendered_scene_canvas.svg>)

<div align="right">index.ts: create the renderer</div>

```ts
// create the renderer
const renderer = new WebGLRenderer();
```

#### Set the Renderer’s Size

<div align="right">index.ts: set the renderer’s size</div>

```ts
// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);
```

#### Set The Device Pixel Ratio

<div align="right">index.ts: set the pixel ratio</div>

```ts
// finally, set the pixel ratio so that our scene will look good on HiDPI displays
renderer.setPixelRatio(window.devicePixelRatio);
```

#### Add the `<canvas>` Element to Our Page

<div align="right">index.ts: add the canvas to the page</div>

```ts
// add the automatically created <canvas> element to the page
container.append(renderer.domElement);
```

### 6. Render the Scene

![image](<https://discoverthreejs.com/images/first-steps/rendered_scene.svg>)

<div align="right">index.ts: render the scene</div>

```ts
// render, or 'create a still image', of the scene
renderer.render(scene, camera);
```

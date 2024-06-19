# Extend three.js With a Camera Controls Plugin

## Our First Plugin: `OrbitControls`

One of the most popular extensions is `OrbitControls`, a camera controls plugin which allows you to orbit, pan, and zoom the camera using touch, mouse, or keyboard. With these controls, we can view a scene from all angles, zoom in to check tiny details, or zoom out to get a birds-eye overview.

### Importing Plugins

<div align="right">Importing the OrbitControls extension using NPM style imports</div>

```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
```

### Initialize the Controls

Internally, `OrbitControls` uses `addEventListener` to listen for user input. The controls will listen for events such as `click`, `wheel`, `touchmove`, and `keydown`, amongst others, and use these to move the camera. We previously used this method to **listen for the `resize` event** when we set up automatic resizing. There, we listened for the `resize` event on the entire `window`. Here, the controls will listen for user input on whatever element we pass in as the second parameter. The rest of the page will be unaffected. In other words, when we pass in the canvas, the controls will work when the mouse/touch is over the canvas, but the rest of the page will continue to work as normal.

<div align="right">systems/controls.ts: create the controls</div>

```ts
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createControls(camera: PerspectiveCamera, canvas: HTMLElement) {
    const controls = new OrbitControls(camera, canvas);

    return controls;
}

export { createControls };
```

### Enable Damping for Added Realism

<div align="right">systems/controls.ts: enable damping</div>

```ts
controls.enableDamping = true;
```

### Update the Controls in the Animation Loop

Whenever we need to update an object in the loop, we’ll use the technique we devised when creating the **cube’s animation**. In other words, we’ll give the controls a `.tick` method and then add them to the `loop.updatables` array. First, the `.tick` method:

<div align="right">systems/controls.ts: add controls.tick</div>

```ts
function createControls(camera: PerspectiveCamera, canvas: HTMLElement) {
    const controls = new OrbitControls(camera, canvas);

    // damping require the controls to be updated each frame
    controls.enableDamping = true;

    (controls as any).tick = () => controls.update();

    return controls;
}
```

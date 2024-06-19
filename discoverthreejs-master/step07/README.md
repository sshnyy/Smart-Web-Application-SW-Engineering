# The Animation Loop

![image](<img/single.png>)

<div align="right">World.ts: drawing a single frame with renderer.render</div>

```ts
public render() {
    // draw a single frame
    this.renderer.render(this.scene, this.camera);
}
```

In this chapter, we’ll add a simple rotation animation to the cube. Here’s how we’ll do it:

- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **rotate the cube a tiny amount**
- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **rotate the cube a tiny amount**
- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **rotate the cube a tiny amount**
- **…**

![image](<img/animate.gif>)

## Creating an Animation Loop with three.js

### The Loop.js Module

Open (or create) the ***systems/Loop.ts*** module and create a new `Loop` class inside. This class will handle all the looping logic and the animation system.

<div align="right">Loop.ts: initial setup</div>

```ts
class Loop {
    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
    }

    public start() {}

    public stop() {}

export { Loop };
```

Add `.start` and `.stop` methods to World, which simply call their counterparts in `Loop`.

<div align="right">World.ts: create the .start, .stop methods and remove .render</div>

```ts
public render() {
    // draw a single frame
    this.renderer.render(this.scene, this.camera);
}

public start() {
    this.loop.start();
}

public stop() {
    this.loop.stop();
}
```

Then, over in ***index.ts***, switch out `world.render` for `world.start`:

<div align="right">index.ts: start the animation loop</div>

```ts
function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container') as HTMLElement;
  
    // create a new world
    const world = new World(container);
  
    // start the animation loop
    world.start();
}
```

### Creating the Loop with `.setAnimationLoop`

As we mentioned above, we don’t need to worry about the technicalities of creating an animation loop since three.js provides a method that does everything for us: `WebGLRenderer.setAnimationLoop`.

<div align="right">Creating a loop using .setAnimationLoop</div>

```js
import { WebGLRenderer } from 'three';

const renderer = new WebGLRenderer();

// start the loop
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});
```

This will call `renderer.render` over and over to generate a stream of frames. We can cancel a running loop by passing `null` as the callback:

<div align="right">Stop a running loop</div>

```js
// stop the loop
renderer.setAnimationLoop(null);
```

### The Loop.start and Loop.stop Methods

Now, we can create the loop. We’ll do it in `Loop.start` using `.setAnimationLoop`:

<div align="right">Loop.ts: create the .start method</div>

```ts
public start() {
    this.renderer.setAnimationLoop(() => {
        // render a frame
        this.renderer.render(this.scene, this.camera);
    });
}
```

Next, create the counterpart `.stop` method, passing in `null` as the callback to stop the loop:

<div align="right">Loop.ts: create the .stop method</div>

```ts
public stop() {
    this.renderer.setAnimationLoop(null);
}
```

As soon as you make these changes, your app will start to pump out frames at a rate of around sixty per second. However, you won’t see any difference. Nothing is moving yet, so we are simply drawing the same frame over and over. Our loop now looks like this:

- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **call renderer.render(...)**
- **wait until it’s time to draw the next frame**
- **…**

### Remove the onResize Hook

First, let’s tidy up. Now that the loop is running, whenever we resize the window a new frame will be produced on the next iteration of the loop. This is fast enough that you won’t notice any delay so we don’t need to manually redraw the scene on resizing anymore. Remove the `resizer.onResize` hook from World.

## The Animation System

### The `Loop.tick` Method

Before we draw each frame, we’ll make each animation tick forward one frame. Add the `Loop.tick` method at the end of the `Loop` class, and then call it within the animation loop:

<div align="right">Loop.ts: create the .tick method</div>

```ts
public start() {
    this.renderer.setAnimationLoop(() => {
        // tell every animated object to tick forward one frame
        this.tick();

        // render a frame
        this.renderer.render(this.scene, this.camera);
    });
}

private tick() {
   // Code to update animations will go here
}
```

### `Loop.updatables`

We need a list of animated objects within the loop class. We’ll use a simple array for this purpose, and we’ll call this list `updatables`. Go ahead and create it now.

<div align="right">Loop.ts: create a list to hold animated objects</div>

```ts
class Loop {
    private camera;
    private scene;
    private renderer;

    public updatables: Mesh[];
```

Next, within `Loop.tick`, loop over this list and call `.tick` on any object within it.

<div align="right">Loop.ts: loop over animated objects and call their .tick method</div>

```ts
private tick() {
    // Code to update animations will go here
    for (const object of this.updatables as any) {
        object.tick();
    }
}
```

Take careful note of the fact that `Loop.tick` will run every frame, which means it will run sixty times per second. It’s important to keep the amount of work done here to a minimum, which means that each animated object’s `.tick` method must be as simple as possible.

### The cube.tick Method

Before we can add `cube` to the `updatables` list, it needs a `.tick` method, so go ahead and create one. This `.tick` method is where we’ll define the logic for rotating the cube.

<div align="right">cube.ts: create the .tick method</div>

```ts
// this method will be called once per frame
(cube as any).tick = () => {
    // increase the cube's rotation each frame
    cube.rotation.z += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
};
```

### Add the cube to Loop.updatables

Next, over in World, add the cube to the the `Loop.updatables` list.

<div align="right">World.ts: add the cube to Loop.updatables</div>

```ts
constructor(container: HTMLElement) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    container.append(this.renderer.domElement);

    const cube = createCube();
    const light = createLights();

    this.loop.updatables.push(cube);

    this.scene.add(cube, light);

    const resizer = new Resizer(container, this.camera, this.renderer);
}
```

Right away, the cube should start rotating.

## Timing in the Animation System

Look at this sentence again: at sixty frames per second, this means our cube will rotate 60×0.5=30<sup>∘</sup> each second, or one full rotation around each of the X, Y and Z axes approximately every twelve seconds. But, what if our app is not running at sixty frames per second? If it runs slower than 60FPS, the animation will run slower, and if it runs faster, the animation will run faster. In other words, the speed of our animation depends on the device it’s being viewed on. Not good.

### Measuring Time Across Frames

This is where the `Clock` class comes in. We’ll use `Clock.getDelta` to measure how long the previous frame took.

### Call .getDelta at the Start of Each Frame

<div align="right">Loop.ts: pass time deltas to animated objects</div>

```ts
class Loop {
    private clock;

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.clock = new Clock();
    }

    private tick() {
        // only call the getDelta function once per frame!
        const delta = this.clock.getDelta();

        // Code to update animations will go here
        for (const object of this.updatables as any) {
            object.tick(delta);
        }
}
```

### Scale the Cube’s Rotation by `delta`

Now, we’ll fix that so the cube rotates thirty degrees per second at any FPS. First, we need to convert thirty degrees to radians, and for that, we’ll use `MathUtils.degToRad` method:

<div align="right">Converting degrees to radians</div>

```js
import { MathUtils } from 'three';

const radiansPerSecond = MathUtils.degToRad(30);
```

Next, we’ll scale `radiansPerSecond` by `delta` each frame.

<div align="right">cube.ts: the updated tick method, now scaling by delta</div>

```ts
(cube as any).tick = (delta: number) => {
    // increase the cube's rotation each frame
    cube.rotation.z += radiansPerSecond * delta;
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
};
```

Now, once again the cube will be rotating thirty degrees per second around each axis, but with an important difference: the animation will now play at the same speed no matter where we run it, whether on a VR rig running at 90FPS, or a ten-year-old smartphone that can barely crank out 10FPS, or some future system from the year 3000 that runs at a billion FPS. **The frame rate may change, but the animation speed will not**.

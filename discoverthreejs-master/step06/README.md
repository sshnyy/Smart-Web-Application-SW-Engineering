# Making Our Scenes Responsive (and also Dealing with Jaggies)

Take a closer look at the cube:

![image](<https://discoverthreejs.com/images/first-steps/cube-closeup-text.png>)

Look closely at the cube’s edges. Can you see that they are not straight, but rather look jagged and unclean? Technically, this is called aliasing, but informally we refer to these as jaggies.

## Anti-Aliasing

![image](<https://discoverthreejs.com/images/first-steps/antialias.svg>)

### Enable Anti-Aliasing

<div align="right">renderer.ts: Enable antialiasing</div>

```ts
function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });

    return renderer;
}
```

## Seamlessly Handling Browser Window Size Changes

We already have a `Resizer` class, so here, we’ll extend this to reset the size whenever the window changes size. After all, that’s why we called this class a Re-sizer in the first place.

### Listen for `resize` Events on the Browser Window

Later, we’ll use event listeners to add interactivity to our scenes. Here, we want to listen for the resize event, which fires whenever the browser’s window size changes.

### Test `ResizeObserver` in the Browser Console

Before we set up automatic resizing in our app, we’ll use the browser console to test `ResizeObserver` and the `resize` event. Open your browser console by pressing the F12 key, paste in the following code, then press Enter:

<div align="right">Paste this code into your browser console then resize the page</div>

```ts
class Resizer {
    ...
    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        ...
        const resizeObserver = new ResizeObserver(entries => {
            console.log('You resized the browser window!');
        });
    }
}
```

![image](<https://discoverthreejs.com/images/first-steps/console-resize.png>)

#### Extend the Resizer Class

Now that we’ve confirmed everything works as expected, we’ll go ahead and extend the Resizer class to automatically handle resizing.

<div align="right">Resizer.ts: move the sizing code into a setSize function and call it on load</div>

```ts
class Resizer {
    private setSize(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    }

    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // set initial size on load
        this.setSize(container, camera, renderer);
    }
}
 
export { Resizer };
```

Great. Now, let’s add an event listener and call setSize again whenever the event fires.

<div align="right">Resizer.ts: set up the event listener</div>

```ts
class Resizer {
    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // set initial size on load
        this.setSize(container, camera, renderer);

        const resizeObserver = new ResizeObserver(entries => {
            this.setSize(container, camera, renderer);
        });

        resizeObserver.observe(container);
    }
}
```

Now, setSize is called whenever the resize event fires. However, we’re not quite done yet. If you try resizing the window now, you’ll see that the scene does expand or contract to fit the new window size.

![image](<https://discoverthreejs.com/images/first-steps/cube-stretched.png>)
![image](<https://discoverthreejs.com/images/first-steps/cube-flattened.png>)

#### Create an onResize Hook

<div align="right">Resizer.ts: an empty onResize method for custom resizing behavior</div>

```ts
public onResize = () => {};

constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    // set initial size on load
    this.setSize(container, camera, renderer);

    const resizeObserver = new ResizeObserver(entries => {
        // set the size again if a resize occurs
        this.setSize(container, camera, renderer);
        // perform any custom actions
        this.onResize();
    });

    resizeObserver.observe(container);
}
```

#### Customize Resizer.onResize in World

Over in World, replace the empty `.onResize` with a new one that calls `World.render`.

<div align="right">World.ts: customise Resizer.onResize</div>

```ts
constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();

        container.append(this.renderer.domElement);

        const cube = createCube();
        const light = createLights();

        this.scene.add(cube, light);

        const resizer = new Resizer(container, this.camera, this.renderer);

        resizer.onResize = () => {
            this.render();
        };
    }
}
```

With that, automatic resizing is complete.

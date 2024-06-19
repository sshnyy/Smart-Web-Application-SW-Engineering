import { PerspectiveCamera, WebGLRenderer } from 'three';

class Resizer {
    private setSize(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // Set the camera's aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight;

        // update the camera's frustum
        camera.updateProjectionMatrix();

        // update the size of the renderer AND the canvas
        renderer.setSize(container.clientWidth, container.clientHeight);

        // set the pixel ratio (for mobile devices)
        renderer.setPixelRatio(window.devicePixelRatio);
    }

    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        // set initial size on load
        this.setSize(container, camera, renderer);

        const resizeObserver = new ResizeObserver(entries => {
            // set the size again if a resize occurs
            this.setSize(container, camera, renderer);
        });

        resizeObserver.observe(container);

        /*
        window.addEventListener('resize', () => {
            // set the size again if a resize occurs
            this.setSize(container, camera, renderer);
            // perform any custom actions
            this.onResize();
        });
        */
    }
}
 
export { Resizer };
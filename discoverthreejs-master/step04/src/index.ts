import '../styles/main.css';
import { World } from './universe/World';

function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container') as HTMLElement;
  
    // create a new world
    const world = new World(container);
  
    // draw the scene
    world.render();
}

main();
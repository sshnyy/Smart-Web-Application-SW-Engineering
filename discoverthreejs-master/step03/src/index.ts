import '../styles/main.css';
import { World } from './universe/World';

function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container') as HTMLElement;
  
    // 1. Create an instance of the World app
    const world = new World(container);
  
    // 2. Render the scene
    world.render();
}

main();
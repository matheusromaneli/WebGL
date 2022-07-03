import Camera from './camera.js';
import Light from './light.js';
import Mesh from './mesh.js';

class Scene {
  constructor(gl) {
    // Camera virtual
    this.cam = new Camera(gl);

    // Luz
    const pos1 = [3.0, 3.0, 3.0, 1.0];
    const pos2 = [-3.0, -3.0, -3.0, 1.0];
    const color1 = [1.0, 0.0, 0.0, 1.0];
    const color2 = [0.0, 0.0, 1.0, 1.0];
    this.light = new Light(pos1, color1, pos2, color2);

    // Mesh
    this.meshs = [];
  }

  async init(gl) {
    const armadillo = new Mesh([-2,0,0], -90);
    await armadillo.loadFrom("armadillo.obj");
    console.log("carregou armadillo");
    this.meshs.push(armadillo);
    
    const bunny = new Mesh([2,0,0], -45);
    await bunny.loadFrom("bunny.obj");
    console.log("carregou bunny");
    this.meshs.push(bunny);

    for(let i = 0; i< this.meshs.length; i++){
        this.meshs[i].init(gl);
    }
  }

  draw(gl) {  
    // this.cam.updateCam();
    this.light.updateLight();
    this.meshs.forEach((mesh) => mesh.draw(gl, this.cam, this.light), [this.cam, this.light]);
  }
}

class Main {
  constructor() {
    this.gl = null;
    this.scene = null; 
  }
  
  async build(){
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");
    this.setViewport();
    
    this.scene = new Scene(this.gl);
    await this.scene.init(this.gl);
    this.draw();
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

const app = new Main();

window.onload = ()=>{
  app.build();
};

window.addEventListener("keydown", (event)=>{
  const key = event.key;
  if(event.keyCode == 80){
    app.scene.cam.updatePerspective();
  }
  else if(key == "a"){
    app.scene.cam.updateCam();
  } 
})




export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.eye = vec3.fromValues(4.0, 1.0, 4.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);
    this.angle = 0;
    this.updateConstraint = Math.PI/180;
    // Parâmetros da projeção
    this.fovy = Math.PI/3;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.left = -2.5;
    this.right = 2.5;
    this.top = 2.5;
    this.bottom = -2.5;

    this.near = 0;
    this.far = 10;

    this.perspective = false;
    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  updateViewMatrix() {
    mat4.identity( this.view );
    mat4.lookAt(this.view, this.eye, this.at, this.up);
    // TODO: Tentar implementar as contas diretamente
  }

  updateProjectionMatrix() {
    mat4.identity( this.proj );

    if (this.perspective) {
      mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
    } else {
      mat4.ortho(this.proj, this.left, this.right, this.bottom , this.top, this.near, this.far);
    }
  }
  
  updateEye(){
    this.angle += this.updateConstraint;
    mat4.rotateY(this.view, this.view, this.angle);
  }

  updateCam() {
    this.updateViewMatrix();
    this.updateEye();
    this.updateProjectionMatrix();
  }

  setUpdateConstraint(c){
    this.updateConstraint = c;
  }

  updatePerspective(){
    console.log("Perspective changed");
    this.perspective = !this.perspective;  
  }

  zoomIn(){
    let value = vec3.create();
    vec3.subtract(this.eye, this.eye , vec3.normalize(value, this.eye));
  }

  zoomOut(){
    let value = vec3.create();
    vec3.add(this.eye, this.eye , vec3.normalize(value, this.eye));
  }

}
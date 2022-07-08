import vertShaderSrc from './phong.vert.js';
import fragShaderSrc from './phong.frag.js';

import Shader from './shader.js';
import { HalfEdgeDS } from './half-edge.js';
export default class Mesh {
  constructor(position, angle = 0) {
    // model data structure
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.angle = angle;
    this.scale = 1;
    this.position = position;
    this.model = mat4.create();

    // Shader program
    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    // Data location
    this.vaoLoc = -1;
    this.indicesLoc = -1;

    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;
  }

  async loadFrom(path) {
    const resp = await fetch(path);
    const text = await resp.text();

    const txtList = text.split("\n");
    let coords = [];
    let indices = [];
    txtList.forEach((line) => {
      let elements = line.split(" ");
      let type = elements [0];
      if( type === "v"){
        let v1 = parseFloat(elements[1]);
        let v2 = parseFloat(elements[2]);
        let v3 = parseFloat(elements[3]);
        coords.push(v1,v2,v3);
      }
      else if( type === "f"){
        for(let i =3; i < elements.length; i++){
          let f1 = parseInt(elements[1].split("/")[0]) -1;
          let f2 = parseInt(elements[i-1].split("/")[0]) -1;
          let f3 = parseInt(elements[i].split("/")[0]) -1;
          indices.push(f1,f2,f3);
        }
      }
    }, [coords, indices]);

    this.heds.build(coords, indices);
  }

  createShader(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");

  }

  createVAO(gl) {
    const vbos = this.heds.getVBOs();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    var normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  init(gl) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);
  }

  updateModelMatrix() {

    mat4.identity( this.model );
    mat4.translate(this.model, this.model, this.position);
    mat4.rotateY(this.model, this.model, this.angle);
    mat4.scale(this.model, this.model, [this.scale, this.scale, this.scale]);
    // [5 0 0 0, 0 5 0 0, 0 0 5 0, 0 0 0 1] * this.mat 
  }

  setScale(scale){
    this.scale = scale;
  }

  getProgram(){
    return this.program;
  }

  estrela(vid, gl){
    this.heds.estrela(vid);
    this.createVAO(gl);
  }

  draw(gl, cam, light) {
    // faces orientadas no sentido anti-horário
    gl.frontFace(gl.CCW);

    // face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // gl.NEVER (never pass)
    // gl.LESS (pass if the incoming value is less than the depth buffer value)
    // gl.EQUAL (pass if the incoming value equals the depth buffer value)
    // gl.LEQUAL (pass if the incoming value is less than or equal to the depth buffer value)
    // gl.GREATER (pass if the incoming value is greater than the depth buffer value)
    // gl.NOTEQUAL (pass if the incoming value is not equal to the depth buffer value)
    // gl.GEQUAL (pass if the incoming value is greater than or equal to the depth buffer value)
    // gl.ALWAYS (always pass)

    // updates the model transformations
    this.updateModelMatrix();

    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();

    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);
    
    light.setLightInfo(gl, this.program);
    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
  }
}
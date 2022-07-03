export default class Light {
  
  constructor(position, color, position2, color2) {
    this.pos = vec4.fromValues(...position, 1.0);
    
    this.amb_c = vec4.fromValues(...color);
    this.amb_k = 0.2;
    
    this.dif_c = vec4.fromValues(...color);
    this.dif_k = 2.0;
    
    this.esp_c = vec4.fromValues(...color);
    this.esp_k = 2.0;
    this.esp_p = 5.0;

    this.pos2 = vec4.fromValues(...position2, 1.0);
    
    this.amb_c2 = vec4.fromValues(...color2);
    this.amb_k2 = 0.2;
    
    this.dif_c2 = vec4.fromValues(...color2);
    this.dif_k2 = 2.0;
    
    this.esp_c2 = vec4.fromValues(...color2);
    this.esp_k2 = 2.0;
    this.esp_p2 = 2.0;
    
    this.posLoc = null;
    this.ambCLoc= null;
    this.ambKLoc= null;
    this.difCLoc= null;
    this.difKLoc= null;
    this.espCLoc= null;
    this.espKLoc= null;
    this.espPLoc= null;

    this.posLoc2 = null;
    this.ambCLoc2= null;
    this.ambKLoc2= null;
    this.difCLoc2= null;
    this.difKLoc2= null;
    this.espCLoc2= null;
    this.espKLoc2= null;
    this.espPLoc2= null;
  }

  setLightInfo(gl, program){
    this.getLightUniforms(gl,program);
    this.setLightUniforms(gl);
  }

  getLightUniforms(gl, program){

    this.posLoc = gl.getUniformLocation(program, "light_pos");
    
    this.ambCLoc = gl.getUniformLocation(program, "light_amb_c");
    this.ambKLoc = gl.getUniformLocation(program, "light_amb_k");
    
    this.difCLoc = gl.getUniformLocation(program, "light_dif_c");
    this.difKLoc = gl.getUniformLocation(program, "light_dif_k");
    
    this.espCLoc = gl.getUniformLocation(program, "light_esp_c");
    this.espKLoc = gl.getUniformLocation(program, "light_esp_k");
    this.espPLoc = gl.getUniformLocation(program, "light_esp_p");
// #############################################################
    this.posLoc2 = gl.getUniformLocation(program, "light_pos2");
    
    this.ambCLoc2 = gl.getUniformLocation(program, "light_amb_c2");
    this.ambKLoc2 = gl.getUniformLocation(program, "light_amb_k2");

    this.difCLoc2 = gl.getUniformLocation(program, "light_dif_c2");
    this.difKLoc2 = gl.getUniformLocation(program, "light_dif_k2");

    this.espCLoc2 = gl.getUniformLocation(program, "light_esp_c2");
    this.espKLoc2 = gl.getUniformLocation(program, "light_esp_k2");
    this.espPLoc2 = gl.getUniformLocation(program, "light_esp_p2");
  }
  
  setLightUniforms(gl){
    gl.uniform4fv(this.posLoc, this.pos);
    gl.uniform4fv(this.ambCLoc, this.amb_c);
    gl.uniform1f(this.ambKLoc, this.amb_k);
    gl.uniform4fv(this.difCLoc, this.dif_c);
    gl.uniform1f(this.difKLoc, this.dif_k);
    gl.uniform4fv(this.espCLoc, this.esp_c);
    gl.uniform1f(this.espKLoc, this.esp_k);
    gl.uniform1f(this.espPLoc, this.esp_p);
    
    gl.uniform4fv(this.posLoc2, this.pos2);
    gl.uniform4fv(this.ambCLoc2, this.amb_c2);
    gl.uniform1f(this.ambKLoc2, this.amb_k2);
    gl.uniform4fv(this.difCLoc2, this.dif_c2);
    gl.uniform1f(this.difKLoc2, this.dif_k2);
    gl.uniform4fv(this.espCLoc2, this.esp_c2);
    gl.uniform1f(this.espKLoc2, this.esp_k2);
    gl.uniform1f(this.espPLoc2, this.esp_p2);
    
  }
  
  updateLight() {
    // TODO: Change light position
  }
}
class ViewMatrix extends Matrix{
  lookAt(e,a,u){
    let z = normalize(substract(a,e))
    let x = normalize(cross(z, u))
    let y = cross(x,z)

    for (let i=0;i<3;i++){
      z[i] *= -1
    }

    var oldPos = this.getCameraPosition()

    this.m = [
      x[0],y[0],z[0],0,  
      x[1],y[1],z[1],0,
      x[2],y[2],z[2],0,
      -dot(x,e),-dot(y,e),-dot(z,e),1,
    ]
    this.setCameraPosition(oldPos);
  }

  setCameraPosition(p){
    for(var i=0;i<4;i++){
      this.m[i*4+3] = p[i]
    }
  }

  getCameraPosition(){
    return [this.m[3],this.m[7],this.m[11],this.m[15]]
  }

  moveCamera(angle, zoom){
    var x = -Math.sin(angle * Math.PI/180) * zoom;
    var z = -Math.cos(angle * Math.PI/180) * zoom;
    this.lookAt(
      [x,0,z],
      [0,0,0],
      [0,1,0]
    )
  }
}
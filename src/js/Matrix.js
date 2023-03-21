class Matrix{

  constructor(matrix){
    this.m = matrix
  }

  multiply(m1,m2){
    var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
          result[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j];
        }
      }
    }
    return result;
  }

  rotateX(angle){ //in radian
    let c = Math.cos(angle)
    let s = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      1,0,0,0,
      0,c,-s,0,
      0,s,c,0,
      0,0,0,1
    ])
  }

  rotateY(angle){ //in radian
    let c = Math.cos(angle)
    let s = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      c,0,s,0,
      0,1,0,0,
      -s,0,c,0,
      0,0,0,1
    ])
  }

  rotateZ(angle){ //in radian
    let c = Math.cos(angle)
    let s = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      c,-s,0,0,
      s,c,0,0,
      0,0,1,0,
      0,0,0,1
    ])
  }

  translate(tx,ty,tz){
    this.m =  this.multiply(this.m,[
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      tx,ty,tz,1
    ])
  }

  scale(sx,sy,sz){
    this.m =  this.multiply(this.m,[
      sx,0,0,0,
      0,sy,0,0,
      0,0,sz,0,
      0,0,0,1
    ])
  }

  getProjectionMatrix(type){
    if(type=="ORTHOGRAPHIC"){
      return [
        1,0,0,0,
        0,1,0,0,
        0,0,0,0,
        0,0,0,1
      ]
    }else if(type=="PERSPECTIVE"){
      return [
        1,0,0,0,
        0,1,0,0,
        0,0,0,0,
        0,0,0,1
      ]
    }else{//oblique
      return [
        1,0,0,0,
        0,1,0,0,
        0,0,0,0,
        0,0,0,1
      ]
    }
  }
}
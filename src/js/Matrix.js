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

  transpose(m1){
    return [
      m1[0], m1[4], m1[8], m1[12],
      m1[1], m1[5], m1[9], m1[13],
      m1[2], m1[6], m1[10], m1[15],
      m1[3], m1[7], m1[11], m1[15],
    ]
  }

  getProjectionMatrix(type){
    if(type=="Orthographic"){
      return this.getOrtho(-5.0, 5.0, -5.0, 5.0, 0.1, 100);
    }else if(type=="Perspective"){
      return this.getPersp(45 ,canvas.width/canvas.height, 0.1, 100);
    }else if(type=="Oblique"){
      return this.getOblique(-45,-45);
    }
  }

  getOrtho(left,right,bottom,top,near,far){
    return [
      -2/(left-right),0,0,(left+right)/(left-right),
      0,-2/(bottom-top),0,(bottom+top)/(bottom-top),
      0,0,2/(near-far),(near+far)/(near-far),
      0,0,0,1
    ]
  }

  getOblique(t,p){
    var cotT = -1/Math.tan(this.toRadians(t));
    var cotP = -1/Math.tan(this.toRadians(p));
    var res = [
      1,0,cotT,0,
      0,1,cotP,0,
      0,0,1,0,
      0,0,0,1
    ]
    var orth = this.getOrtho(-3.0, 3.0, -3.0, 3.0, 0.1, 100);
    return this.multiply(orth,this.transpose(res));
  }

  getPersp(fovy, aspect, near, far){
    var top = near * Math.tan(this.toRadians(fovy));
    var bottom = -top;
    var right = top*aspect;
    var left = -right;
    return [
      (2*near)/(right-left), 0, 0, -near * (left+right)/(right-left),
      0,(2*near)/(top-bottom),0,-near * (bottom+top)/(top-bottom),
      0,0,-(far+near)/(far-near),2*near*far/(near-far),
      0,0,-1,0
    ]
  }

  toRadians(degree){
    return degree * (Math.PI/180);
  }
}
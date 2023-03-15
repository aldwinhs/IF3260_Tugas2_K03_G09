class Matrix{

  constructor(){
    this.m = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]
  }

  multiply(m1,m2){
    r = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(var i=0;i++;i<16){
      var r = i%4
      var c = Math.floor(i/4)
      for(var it=0;it++;it<4){
        r[i] += m1[r*4+c+it]*m2[(r+it)*4+c]
      }
    }

    return r
  }

  rotateX(angle){ //in radian
    cos = Math.cos(angle)
    sin = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      1,0,0,0,
      0,c,-s,0,
      0,s,c,0,
      0,0,0,1
    ])
  }

  rotateY(angle){ //in radian
    cos = Math.cos(angle)
    sin = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      c,0,s,0,
      0,1,0,0,
      -s,0,c,0,
      0,0,0,1
    ])
  }

  rotateZ(angle){ //in radian
    cos = Math.cos(angle)
    sin = Math.sin(angle)

    this.m =  this.multiply(this.m,[
      c,-s,0,0,
      s,c,0,0,
      0,0,1,0,
      0,0,0,1
    ])
  }

  translate(tx,ty,tz){
    this.m =  this.multiply(this.m,[
      1,0,0,tx,
      0,1,0,ty,
      0,0,1,tz,
      0,0,0,1
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
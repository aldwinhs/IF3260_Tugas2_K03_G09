var vertexShaderText = 
[`
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec3 vertNormal;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 uNormalMatrix;
uniform float shader;

varying highp vec3 vLighting;

void main()
{
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);

  highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0, 0, 3));

  highp vec4 transformedNormal = mWorld * vec4(vertNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);

  if (shader == 0.0){
    vLighting /= vLighting;
  }
}
`];
var fragmentShaderText =
[`
precision mediump float;

varying vec3 fragColor;
varying highp vec3 vLighting;

void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
  gl_FragColor.rgb *= vLighting;
}
`];
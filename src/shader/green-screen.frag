#version 100

precision mediump float;

uniform sampler2D u_sampler;
uniform float u_cutoff;
uniform int u_colorIndex;

varying vec2 v_texCoord;

void main() {
    vec4 color = texture2D(u_sampler, v_texCoord);
    float alpha;

    if (u_colorIndex == 0) {
          alpha = 1.0 - (color.r - max(color.g, color.b)) / u_cutoff;
    } else if (u_colorIndex == 1) {
          alpha = 1.0 - (color.g - max(color.r, color.b)) / u_cutoff;
    } else if (u_colorIndex == 2) {
          alpha = 1.0 - (color.b - max(color.r, color.g)) / u_cutoff;
    }
    alpha = clamp(alpha, 0., 1.);
    if (u_colorIndex == 0) {
          color.r *= alpha;
    } else if (u_colorIndex == 1) {
          color.g *= alpha;
    } else if (u_colorIndex == 2) {
          color.b *= alpha;
    }
    gl_FragColor = color * alpha;
}

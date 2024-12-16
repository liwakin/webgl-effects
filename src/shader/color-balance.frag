#version 100

precision mediump float;

uniform sampler2D u_sampler;
uniform float u_exposure;
uniform float u_saturation;
uniform float u_temperature;
uniform float u_contrast;

varying vec2 v_texCoord;

vec4 unmultAlpha(vec4 color) {
    if (color.a == 0.) return vec4(0.);
    return vec4(color.rgb / color.a, color.a);
}

vec4 multAlpha(vec4 color) {
    return vec4(color.rgb * color.a, color.a);
}

float luminance(vec3 color) {
    return color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
}

vec3 applyExposure(vec3 color, float exposure) {
    return color * exposure;
}

vec3 applySaturation(vec3 color, float saturation) {
    return mix(color, vec3(luminance(color)), -saturation);
}

vec3 applyTemperature(vec3 color, float temperature) {
    const vec3 warmFilter = vec3(0.93, 0.54, 0.);

    vec3 lo = 2. * color * warmFilter;
    vec3 hi = 1. - 2. * (1. - color) * (1. - warmFilter);

    vec3 fullyWarm = vec3(
        color.r < 0.5 ? lo.r : hi.r,
        color.g < 0.5 ? lo.g : hi.g,
        color.b < 0.5 ? lo.b : hi.b
    );
    return mix(color, fullyWarm, temperature);
}

vec3 applyContrast(vec3 color, float contrast) {
    return (color - 0.5) * contrast + 0.5;
}

void main() {
    vec4 originColor = unmultAlpha(texture2D(u_sampler, v_texCoord));

    vec3 processColor = originColor.rgb;
    processColor = applyExposure(processColor, 1. + u_exposure);
    processColor = applySaturation(processColor, u_saturation);
    processColor = applyTemperature(processColor, u_temperature);
    processColor = applyContrast(processColor, 1. + u_contrast);

    gl_FragColor = multAlpha(vec4(processColor, originColor.a));
}

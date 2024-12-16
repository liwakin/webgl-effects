#version 100

precision mediump float;

uniform sampler2D u_texture;
uniform float u_pixelation;
uniform int u_colorPalette;

varying vec2 v_texCoord;

vec3 getPixelFromColorPalette(float avg, vec3 u_colorPalette[4]) {
    if (avg < 0.25) {
        return u_colorPalette[0];
    } else if (avg < 0.5) {
        return u_colorPalette[1];
    } else if (avg < 0.75) {
        return u_colorPalette[2];
    }
    return u_colorPalette[3];
}

float convertToGrayScale(vec3 pixel) {
    return (pixel.r + pixel.g + pixel.b) / 3.0;
}

void main() {
    float squareSize = u_pixelation / 1000.0;
    vec2 sampleLoc = (floor(v_texCoord / squareSize) + 0.5) * squareSize;

    vec3 retroHandheldGreenColorPalette[4];
    retroHandheldGreenColorPalette[0] = vec3(0.058, 0.219, 0.058);
    retroHandheldGreenColorPalette[1] = vec3(0.188, 0.384, 0.188);
    retroHandheldGreenColorPalette[2] = vec3(0.545, 0.675, 0.058);
    retroHandheldGreenColorPalette[3] = vec3(0.608, 0.737, 0.058);

    vec4 pixel = texture2D(u_texture, sampleLoc);
    if (pixel.a != 0.0) {
        pixel.rgb /= pixel.a;
    }

    if (u_colorPalette == 1) {
        pixel.rgb = floor(pixel.rgb * 4.0) / 4.0;
    } else if (u_colorPalette == 2) {
        float avg = convertToGrayScale(pixel.rgb);
        pixel.rgb = getPixelFromColorPalette(avg, retroHandheldGreenColorPalette);
    }

    pixel.rgb *= pixel.a;

    gl_FragColor = pixel;
}

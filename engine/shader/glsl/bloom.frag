#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(location = 0) out highp vec4 out_color;

highp vec3 Uncharted2Tonemap(highp vec3 x);

void main()
{
    highp vec3 color = subpassLoad(in_color).rgb;


    out_color = vec4(1.0,1.0,1.0, 1.0f);
}

highp vec3 Uncharted2Tonemap(highp vec3 x)
{
    highp float A = 0.15;
    highp float B = 0.50;
    highp float C = 0.10;
    highp float D = 0.20;
    highp float E = 0.02;
    highp float F = 0.30;
    return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

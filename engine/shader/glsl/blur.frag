#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(location = 0) in highp vec2 uv;

layout(location = 0) out highp vec4 out_color;

highp vec3 Uncharted2Tonemap(highp vec3 x);

void main()
{
    highp vec4 color = subpassLoad(in_color).rgba;
    highp vec4 blur_color = vec4(0.2f,0.3f,0.7f,0.8f);
    
    highp float weight = sqrt(abs(uv.x - 0.5f) * abs(uv.x - 0.5f) + abs(uv.y - 0.5f) * abs(uv.y - 0.5f)) / 0.65f; 

    out_color = mix (color, blur_color, weight);
}



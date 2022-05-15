#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

highp vec2 GetLutUV(highp vec4 color, highp float size, highp float blue_int_part)
{
    highp vec2 uv  = vec2((color.r + blue_int_part) / size, color.g);
    return uv;
}

highp vec4 GetLutColor(highp vec4 color, highp float size)
{
    highp float int_part;
    highp float weight = modf(color.b * (size - 1.0F), int_part);

    highp vec4 color1 = texture(color_grading_lut_texture_sampler, GetLutUV(color, size, int_part));
    highp vec4 color2 = texture(color_grading_lut_texture_sampler, GetLutUV(color, size, int_part + 1.0f));

    return mix(color1, color2, weight);
}

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float size      = float(lut_tex_size.y);
    highp vec4 color       = subpassLoad(in_color).rgba;
    out_color =  GetLutColor(color, size);
    //out_color = vec4(1.0,1.0,1.0,1.0);
}
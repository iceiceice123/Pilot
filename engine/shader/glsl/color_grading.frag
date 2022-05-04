#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

//linear sampler
highp vec4 LinearSample(highp vec2 pos)
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);

    highp float min_x = floor(pos.x); 
    highp float max_x = min_x + 1.0;
    highp float min_y = floor(pos.y);
    highp float max_y = min_y + 1.0;

    highp float weight_x = pos.x - min_x;
    highp float weight_y = pos.y - min_y;

    highp float min_u = min_x / float(lut_tex_size.x);
    highp float max_u = max_x / float(lut_tex_size.x);
    highp float min_v = min_y / float(lut_tex_size.y);
    highp float max_v = max_y / float(lut_tex_size.y);
    
    highp vec4 color_left_top = texture(color_grading_lut_texture_sampler, vec2(min_u,max_v));
    highp vec4 color_right_top = texture(color_grading_lut_texture_sampler, vec2(max_u,max_v));
    highp vec4 color_left_bot = texture(color_grading_lut_texture_sampler, vec2(min_u,min_v));
    highp vec4 color_right_bot = texture(color_grading_lut_texture_sampler, vec2(max_u,min_v));

    //Horizontal interpolation
    highp vec4 color1 = (1.0 - weight_x) * color_left_top +  weight_x * color_right_top;
    highp vec4 color2 = (1.0 - weight_x) * color_left_bot +  weight_x * color_right_bot;

    //Vertical interpolation
    return (1.0 - weight_y) * color2 + weight_y * color1;
    //return (color1 + color2)/2.0; 
}

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);
    highp vec4 color       = subpassLoad(in_color).rgba;
    highp vec2 lut_pos = vec2(0,0);

    lut_pos.x  = (floor(color.b  * (_COLORS - 1.0)) + color.r ) * _COLORS + 0.5;
    lut_pos.y = color.g * _COLORS + 0.5;

    out_color = LinearSample(lut_pos);

    //out_color =  texture(color_grading_lut_texture_sampler, vec2(lut_pos.x / 256.0, lut_pos.y / 16.0));
}

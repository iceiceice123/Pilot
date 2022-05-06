#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(location = 0) out highp vec4 out_color;


void main()
{
    out_color = vec4(1,0,0,1);
}

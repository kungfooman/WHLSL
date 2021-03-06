/*
 * Copyright 2018 Apple Inc.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *
 *    3. Neither the name of the copyright holder nor the names of its
 *       contributors may be used to endorse or promote products derived from this
 *       software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ArrayType } from "./ArrayType.js";
import { ReferenceType } from "./ReferenceType.js";
import { Semantic } from "./Semantic.js";

export default class ResourceSemantic extends Semantic {
    constructor(origin, resourceMode, index, space)
    {
         super(origin);
         this._resourceMode = resourceMode;
         this._index = index;
         this._space = space;
    }

    get resourceMode() { return this._resourceMode; }
    get index() { return this._index; }
    get space() { return this._space; }

    isAcceptableType(type, program)
    {
        switch (this.resourceMode) {
        case "b":
            if (type instanceof ReferenceType) {
                return type.addressSpace == "constant";
            } else
                return type instanceof ArrayType;
        case "u":
            if (type instanceof ReferenceType) {
                return type.addressSpace == "constant" || type.addressSpace == "device";
            } else
                return type.isTexture || type instanceof ArrayType;
        case "t":
            if (type instanceof ReferenceType) {
                return type.addressSpace == "constant";
            } else
                return type.isTexture || type instanceof ArrayType;
        case "s":
            return type.equals(program.intrinsics.sampler);
        default:
            throw new Error(`Unknown resource mode: ${this.resourceMode}`);
        }
    }

    isAcceptableForShaderType(direction, shaderType)
    {
        return direction == "input";
    }

    equalToOtherSemantic(otherSemantic)
    {
        if (!(otherSemantic instanceof ResourceSemantic))
            return false;
        return this.resourceMode == otherSemantic.resourceMode && this.index == otherSemantic.index && this.space == otherSemantic.space;
    }

    toString()
    {
        return `register(${this.resourceMode}${this.index}, space${this.space})`;
    }
}

export { ResourceSemantic };

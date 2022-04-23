// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import {AvatarType, isAvatarType} from "./AvatarType";
import { isString } from "../fi/hg/core/modules/lodash";

export interface ChatMessage {

    readonly id      : string;
    readonly avatar  : AvatarType;
    readonly time    : string;
    readonly nickId  : string;
    readonly nick    : string;
    readonly message : string;

}

export function isChatMessage (value: any) : value is ChatMessage {

    return (
        !!value
        && isString(value?.id)
        && isAvatarType(value?.avatar)
        && isString(value?.time)
        && isString(value?.nickId)
        && isString(value?.nick)
        && isString(value?.message)
    );

}

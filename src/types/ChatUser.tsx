// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import { AvatarType, isAvatarType } from "./AvatarType";
import { isString } from "../fi/hg/core/modules/lodash";

export interface ChatUser {

    readonly id     : string;
    readonly nick   : string;
    readonly avatar : AvatarType;

}

export function isChatUser (value: any) : value is ChatUser {

    return (
        !!value
        && isString(value?.id)
        && isString(value?.nick)
        && isAvatarType(value?.avatar)
    );

}

// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

export enum AvatarType {
    AVATAR_1 = "AVATAR_1",
    AVATAR_2 = "AVATAR_2"
}

export function isAvatarType (value : any) : value is AvatarType {
    switch(value) {
        case AvatarType.AVATAR_1:
        case AvatarType.AVATAR_2:
            return true;

        default:
            return false;
    }
}

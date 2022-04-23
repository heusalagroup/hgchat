// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import {AvatarType} from "../types/AvatarType";
import {Avatar1, Avatar2} from "../assets/icons";

export class AvatarUtils {

    public static getAvatar (type: AvatarType): any {
        switch (type) {
            case AvatarType.AVATAR_1: return Avatar1;
            case AvatarType.AVATAR_2: return Avatar2;
            default: throw new TypeError(`Undefined avatar: ${type}`);
        }
    }

}

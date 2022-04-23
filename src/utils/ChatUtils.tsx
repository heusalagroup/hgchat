// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import { padStart } from "../fi/hg/core/modules/lodash";

export class ChatUtils {

    public static getMessageId(id?: number): string {
        return `message-${Date.now()}${id ? '-' + id : ''}`;
    }

    public static getTime(): string {
        const now = new Date();
        return `${now.getHours()}:${padStart(`${now.getMinutes()}`, 2, '0')}`;
    }

}

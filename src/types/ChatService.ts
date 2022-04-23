// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    ObserverCallback,
    ObserverDestructor
} from "../fi/hg/core/Observer";
import { ChatServiceEvent } from "./ChatServiceEvent";
import { ChatMessage } from "./ChatMessage";
import { ChatUser } from "./ChatUser";

export type ChatServiceDestructor = ObserverDestructor;

export interface ChatService {

    connect () : void;

    destroy () : void;

    on (name: ChatServiceEvent, callback: ObserverCallback<ChatServiceEvent>): ChatServiceDestructor;

    sendMessage (msg : ChatMessage) : void;

    join (user: ChatUser) : void;

}

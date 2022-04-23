// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ChatService, ChatServiceDestructor } from "../types/ChatService";
import { ChatUser } from "../types/ChatUser";
import { ChatServiceEvent } from "../types/ChatServiceEvent";
import { Observer, ObserverCallback } from "../fi/hg/core/Observer";
import { ChatMessage } from "../types/ChatMessage";

export class MatrixChatService implements ChatService {

    private readonly _url      : string;
    private readonly _observer : Observer<ChatServiceEvent>;

    public static Event = ChatServiceEvent;

    public constructor (url: string) {
        this._url = url;
        this._observer = new Observer<ChatServiceEvent>("MatrixChatService");
    }

    public destroy (): void {
        this._observer.destroy();
    }

    public on (
        name: ChatServiceEvent,
        callback: ObserverCallback<ChatServiceEvent>
    ): ChatServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public connect (): void {
    }

    public join (user: ChatUser): void {
    }

    public sendMessage (msg: ChatMessage): void {
    }


}

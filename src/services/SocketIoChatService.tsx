// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import { Socket } from "socket.io-client";
import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { ChatMessage, isChatMessage } from "../types/ChatMessage";
import { ChatServerEvent } from "../types/ChatServerEvent";
import { ChatClientEvent } from "../types/ChatClientEvent";
import { ChatUser, isChatUser } from "../types/ChatUser";
import { LogService } from "../fi/hg/core/LogService";
import { ChatService } from "../types/ChatService";
import { ChatServiceEvent } from "../types/ChatServiceEvent";

const LOG = LogService.createLogger('SocketIoChatService');

const CHAT_SOCKET_RECONNECT_INTERVAL = 5000;

export interface IncomingMessageCallback {
    (msg: ChatMessage) : void;
}

export interface JoinAcceptedCallback {
    (user: ChatUser) : void;
}

export interface DisconnectCallback {
    () : void;
}

export interface ConnectCallback {
    () : void;
}

export interface ReConnectCallback {
    () : void;
}

export enum ChatServiceState {

    DISCONNECTED ,
    CONNECTING,
    CONNECTED,
    DESTROYED

}

export class SocketIoChatService implements ChatService {

    public static Event = ChatServiceEvent;

    private readonly _socket: Socket;
    private readonly _observer: Observer<ChatServiceEvent>;
    private readonly _incomingMessageCallback : IncomingMessageCallback;
    private readonly _joinAcceptedCallback    : JoinAcceptedCallback;
    private readonly _disconnectCallback      : DisconnectCallback;
    private readonly _connectCallback         : ConnectCallback;
    private readonly _reConnectCallback       : ReConnectCallback;

    private _messageSequence  : number;
    private _state            : ChatServiceState;
    private _reconnectTimeout : any | undefined;

    public constructor (socket: Socket) {

        this._state = ChatServiceState.DISCONNECTED;
        LOG.info('ChatService state ', this._state);

        this._messageSequence = 0;
        this._reconnectTimeout = undefined;

        this._observer = new Observer<ChatServiceEvent>("ChatService");

        this._socket = socket;

        this._incomingMessageCallback = this._onSocketMessage.bind(this);
        this._joinAcceptedCallback    = this._onJoinAccepted.bind(this);
        this._disconnectCallback      = this._onDisconnect.bind(this);
        this._connectCallback         = this._onConnect.bind(this);
        this._reConnectCallback       = this._onReconnect.bind(this);

        this._socket.on(ChatClientEvent.INCOMING_MESSAGE , this._incomingMessageCallback);
        this._socket.on(ChatClientEvent.JOIN_ACCEPTED    , this._joinAcceptedCallback);
        this._socket.on(ChatClientEvent.DISCONNECT       , this._disconnectCallback);
        this._socket.on(ChatClientEvent.CONNECT          , this._connectCallback);

    }

    public connect () {

        const state = this._state;

        if (state === ChatServiceState.CONNECTED) {

            LOG.warn(`State was already connected`);

        } else if (state === ChatServiceState.CONNECTING) {

            LOG.warn(`State was already connecting`);

        } else if (state === ChatServiceState.DESTROYED) {

            LOG.warn(`State was already destroyed`);

        } else {

            this._state = ChatServiceState.CONNECTING;

            LOG.info('ChatService state ', this._state);

            this._socket.connect();

        }

        LOG.info('ChatService state ', this._state);

    }

    public destroy () {

        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
            this._reconnectTimeout = undefined;
        }

        this._socket.off(ChatClientEvent.INCOMING_MESSAGE, this._incomingMessageCallback);
        this._socket.off(ChatClientEvent.JOIN_ACCEPTED, this._joinAcceptedCallback);
        this._socket.off(ChatClientEvent.DISCONNECT, this._disconnectCallback);
        this._socket.off(ChatClientEvent.CONNECT, this._connectCallback);

        this._observer.destroy();

        this._state = ChatServiceState.DESTROYED;

        LOG.info('ChatService state ', this._state);

    }

    public on (name: ChatServiceEvent, callback: ObserverCallback<ChatServiceEvent>): ObserverDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public sendMessage (msg : ChatMessage) {

        LOG.debug('Sending message ', msg);

        this._socket.emit(ChatServerEvent.OUTGOING_MESSAGE, msg);

    }

    public join (user: ChatUser) {

        LOG.debug('Sending join request ', user);

        this._socket.emit(ChatServerEvent.JOIN_REQUEST, user);

    }

    private _onJoinAccepted (user : ChatUser) {

        if (!isChatUser(user)) {
            LOG.warn('Warning! User was not ChatUser: ', user);
            return;
        }

        LOG.debug('Join accepted ', user);

        this._observer.triggerEvent(ChatServiceEvent.JOIN_ACCEPTED, user);

    }

    private _onSocketMessage (msg : ChatMessage) {

        if (!isChatMessage(msg)) {
            LOG.warn('Warning! Message was not ChatMessage: ', msg);
            return;
        }

        LOG.debug('New message ', msg);

        this._observer.triggerEvent(ChatServiceEvent.NEW_MESSAGE, msg);

    }

    private _onDisconnect () {

        LOG.debug('Disconnected');

        this._observer.triggerEvent(ChatServiceEvent.DISCONNECT);

        this._state = ChatServiceState.DISCONNECTED;

        LOG.info('ChatService state ', this._state);

        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
            this._reconnectTimeout = undefined;
        }

        this._reconnectTimeout = setTimeout(this._reConnectCallback, CHAT_SOCKET_RECONNECT_INTERVAL);

    }

    private _onConnect () {

        LOG.debug('Connected');

        this._state = ChatServiceState.CONNECTED;

        LOG.info('ChatService state ', this._state);

        if (this._reconnectTimeout) {
            clearTimeout(this._reconnectTimeout);
            this._reconnectTimeout = undefined;
        }

    }

    private _onReconnect () {

        const state = this._state;

        if (state === ChatServiceState.DESTROYED) {
            LOG.warn(`Warning! The service was already destroyed.`);
            return;
        }

        if (state === ChatServiceState.CONNECTED) {
            LOG.warn(`Warning! The service was already connected.`);
            return;
        }

        if (state === ChatServiceState.CONNECTING) {
            LOG.warn(`Warning! The service was already connecting.`);
            return;
        }

        this.connect();

    }

}

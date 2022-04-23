// Copyright (c) 2022. Heusala Group Oy. All rights reserved.
// Copyright (c) 2021 Sendanor. All rights reserved.

import { Component } from "react";
import { ObserverDestructor } from "../../fi/hg/core/Observer";
import { ChatView } from "../views/ChatView";
import { ChatUser } from "../../types/ChatUser";
import { ChatMessage } from "../../types/ChatMessage";
import { AvatarType } from "../../types/AvatarType";
import { ChatLoginView } from "../views/ChatLoginView";
import { ChatJoiningView } from "../views/ChatJoiningView";
import { LogService } from "../../fi/hg/core/LogService";
import { concat } from "../../fi/hg/core/modules/lodash";
import { ThemeService,
    ThemeServiceColorSchemeChangedEventCallback,
    ThemeServiceEvent
} from "../../fi/hg/ui/services/ThemeService";
import { ColorScheme } from "../../fi/hg/core/style/types/ColorScheme";
import { ChatServiceEvent } from "../../types/ChatServiceEvent";
import { ChatService } from "../../types/ChatService";

const LOG = LogService.createLogger('ChatApp');

export interface NewLocalMessageCallback {
    (message: ChatMessage): void;
}

export interface JoinAcceptedEventCallback {
    (event: ChatServiceEvent, user: ChatUser): void;
}

export interface DisconnectEventCallback {
    (event: ChatServiceEvent): void;
}


export interface ChatAppState {

    readonly user         : ChatUser;
    readonly chatMessages : ChatMessage[];
    readonly joining      : boolean;
    readonly darkMode     : boolean;

}

export interface ChatAppProps {

    readonly chatService   : ChatService;
    readonly enableHeader ?: boolean;

}

export interface NewRemoteMessageEventCallback {
    (event: ChatServiceEvent, msgObject: ChatMessage) : void;
}

export class ChatApp extends Component<ChatAppProps, ChatAppState> {

    private readonly _newRemoteMessageCallback : NewRemoteMessageEventCallback;
    private readonly _newLocalMessageCallback  : NewLocalMessageCallback;
    private readonly _joinAcceptedCallback     : JoinAcceptedEventCallback;
    private readonly _disconnectCallback       : DisconnectEventCallback;
    private readonly _colorSchemeChangeCallback : ThemeServiceColorSchemeChangedEventCallback;

    private _messageListener           : ObserverDestructor | undefined;
    private _joinAcceptedListener      : ObserverDestructor | undefined;
    private _disconnectListener        : ObserverDestructor | undefined;
    private _colorSchemeChangeListener : ObserverDestructor | undefined;

    constructor(props: ChatAppProps) {

        super(props);

        this.state = {
            user: {
                id: '',
                nick: '',
                avatar: AvatarType.AVATAR_1
            },
            chatMessages: [],
            joining: false,
            darkMode: ThemeService.hasDarkMode()
        };

        this._newLocalMessageCallback  = this._onNewLocalMessage.bind(this);
        this._newRemoteMessageCallback = this._onNewRemoteMessage.bind(this);
        this._joinAcceptedCallback     = this._onJoinAccepted.bind(this);
        this._disconnectCallback       = this._onDisconnect.bind(this);
        this._colorSchemeChangeCallback = this._onColorSchemeChange.bind(this);

    }

    componentDidMount() {

        this._messageListener      = this.props.chatService.on(ChatServiceEvent.NEW_MESSAGE   , this._newRemoteMessageCallback);
        this._joinAcceptedListener = this.props.chatService.on(ChatServiceEvent.JOIN_ACCEPTED , this._joinAcceptedCallback);
        this._disconnectListener   = this.props.chatService.on(ChatServiceEvent.DISCONNECT    , this._disconnectCallback);
        this._colorSchemeChangeListener = ThemeService.on(ThemeService.Event.COLOR_SCHEME_CHANGED  , this._colorSchemeChangeCallback);

    }

    componentWillUnmount() {

        if (this._messageListener) {
            this._messageListener();
            this._messageListener = undefined;
        }

        if (this._joinAcceptedListener) {
            this._joinAcceptedListener();
            this._joinAcceptedListener = undefined;
        }

        if (this._disconnectListener) {
            this._disconnectListener();
            this._disconnectListener = undefined;
        }

        if (this._colorSchemeChangeListener) {
            this._colorSchemeChangeListener();
            this._colorSchemeChangeListener = undefined;
        }

    }

    render() {

        const {user, joining} = this.state;

        if (joining) {
            return (
                <ChatJoiningView
                    enableHeader={this.props.enableHeader ?? false}
                    darkMode={this.state.darkMode}
                />
            );
        }

        if (user.id) {

            return (
                <ChatView
                    darkMode={this.state.darkMode}
                    user={user}
                    chatMessages={this.state.chatMessages}
                    onNewMessage={this._newLocalMessageCallback}
                    enableHeader={this.props.enableHeader ?? false}
                />
            );

        }

        return (
            <ChatLoginView
                darkMode={this.state.darkMode}
                enableHeader={this.props.enableHeader ?? false}
                user={user}
                changeUser={(user: ChatUser) => this.setState({user})}
                submitUser={(user: ChatUser) => {
                    this.setState({joining: true});
                    this.props.chatService.join(user);
                }}
            />
        );

    }

    /**
     * New message from the local user
     *
     * @param message
     * @private
     */
    private _onNewLocalMessage (message: ChatMessage) {

        LOG.info('New message from UI');

        this.props.chatService.sendMessage(message);

    }

    /**
     * New message from the remote user
     *
     * @param event
     * @param message
     * @private
     */
    private _onNewRemoteMessage (event: ChatServiceEvent, message: ChatMessage) {

        LOG.info('New message from IO');

        this.setState((prevState) => {
            const chatMessages = concat([], prevState.chatMessages, [message]);
            return {chatMessages};
        });

    }

    /**
     * When our join request is accepted
     *
     * @param event
     * @param user
     * @private
     */
    private _onJoinAccepted (event: ChatServiceEvent, user: ChatUser) {

        LOG.info('Join accepted from IO');

        this.setState({user, joining: false});

    }

    private _onDisconnect (event: ChatServiceEvent) {

        LOG.info('Disconnected from IO');

        const newUser : ChatUser = {
            ...this.state.user,
            id:''
        };

        this.setState({user: newUser, joining: true}, () => {
            this.props.chatService.join(this.state.user);
        });

    }

    private _onColorSchemeChange (event: ThemeServiceEvent, scheme: ColorScheme) {
        this.setState({darkMode: ThemeService.hasDarkMode()});
    }

}

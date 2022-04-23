// Copyright (c) 2021 Sendanor. All rights reserved.

import {
    Component,
    RefObject,
    createRef,
    ChangeEvent,
    SyntheticEvent
} from "react";
import { ChatUtils } from "../../utils/ChatUtils";
import { ChatUser } from "../../types/ChatUser";
import { ChatMessage } from "../../types/ChatMessage";
import { AvatarUtils } from "../../utils/AvatarUtils";
import { LogService } from "../../fi/hg/core/LogService";
import { ChatHeader } from "./ChatHeader";
import { MessageIcon } from "../../assets/icons";
import { map } from "../../fi/hg/core/modules/lodash";

const LOG = LogService.createLogger('ChatView');

export interface OnNewMessageCallback {
    (message: ChatMessage): void;
}

export interface ChatViewProps {

    readonly user          : ChatUser;
    readonly chatMessages  : ChatMessage[];
    readonly onNewMessage ?: OnNewMessageCallback;
    readonly enableHeader  : boolean;
    readonly darkMode      : boolean;

}

export interface ChatViewState {

    readonly message: string;

}

export class ChatView extends Component<ChatViewProps, ChatViewState> {

    readonly _changeMessageCallback: any;
    readonly _onKeyDownCallback: any;
    readonly _onSubmitCallback: any;
    readonly _contentRef : RefObject<HTMLDivElement>;

    public constructor (props: ChatViewProps) {

        super(props);

        this.state = {
            message: ''
        };

        this._contentRef = createRef<HTMLDivElement>();

        this._changeMessageCallback = this._onChangeMessage.bind(this);
        this._onKeyDownCallback = this._onKeyDown.bind(this);
        this._onSubmitCallback = this._onSubmit.bind(this);

    }

    public componentDidMount() {
        this._scrollToBottom();
    }

    componentDidUpdate(prevProps: Readonly<ChatViewProps>, prevState: Readonly<ChatViewState>, snapshot?: any) {

        const prevMessageCount : number = prevProps?.chatMessages?.length ?? 0;
        const currentMessageCount : number = this.props?.chatMessages?.length ?? 0;

        if (prevMessageCount < currentMessageCount) {
            this._scrollToBottom();
        }

    }

    public render() {

        const {user, chatMessages, enableHeader} = this.props;

        const {message} = this.state;

        return (
            <div className={"App" + (this.props.darkMode ? ' Dark-App' : ' Light-App')}>

                {enableHeader ? (
                    <ChatHeader darkMode={this.props.darkMode} />
                ) : null}

                <section className="App-content" ref={this._contentRef}>

                    {map(chatMessages, (item: ChatMessage, index: number) => {

                        const {id, time, nick, nickId, avatar, message} = item;

                        const AvatarComponent = AvatarUtils.getAvatar(avatar);

                        const isMyMessage = user.id === nickId;

                        return (
                            <div
                                key={`content-message-${index}-${id}`}
                                className={
                                    "App-content-message"
                                    + " App-content-message-is-" + (isMyMessage ? "mine" : "theirs")
                                }
                            >
                                <div className="App-content-message-inner">
                                    <div className="App-content-message-inner-avatar"><AvatarComponent/></div>
                                    <div className="App-content-message-inner-nick">{nick}</div>
                                    <div className="App-content-message-inner-content">{message}</div>
                                    <div className="App-content-message-inner-time">{time}</div>
                                </div>
                            </div>
                        );

                    })}

                </section>

                <footer className="App-footer">

                    <div className="App-footer-icon"><MessageIcon /></div>

                    <div className="App-footer-field">
                        <form onSubmit={this._onSubmitCallback}>
                            <input
                                className="App-footer-field-input"
                                type="text"
                                placeholder="Kirjoita viesti"
                                value={message}
                                onChange={this._changeMessageCallback}
                                onKeyDown={this._onKeyDownCallback}
                            />
                        </form>
                    </div>

                </footer>

            </div>
        );

    }

    private _onChangeMessage(event: ChangeEvent<HTMLInputElement>) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const value = event?.target?.value ?? '';

        this.setState({message: value});

    }

    private _onKeyDown(event: KeyboardEvent) {

        LOG.debug('_onKeyDown: Keycode set: ', event?.code);

        switch (event?.code) {

            case 'Enter':
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                return this._onEnter();

        }

    }

    private _onSubmit(e: SyntheticEvent) {

        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        this._sendMessageFromState();

    }

    private _onEnter() {
        this._sendMessageFromState();
    }

    private _sendMessageFromState () {

        const {message} = this.state;

        this._sendMessage(message);

        this.setState({
            message: ''
        });

    }

    private _sendMessage (message: string) {

        try {
            const onNewMessage = this.props?.onNewMessage;
            if (onNewMessage) {
                onNewMessage({
                    time: ChatUtils.getTime(),
                    id: ChatUtils.getMessageId(),
                    avatar: this.props.user.avatar,
                    message: message,
                    nick: this.props.user.nick,
                    nickId: this.props.user.id
                });
            }
        } catch (err) {
            LOG.error('Error while calling onNewMessage prop: ', err);
        }

    }

    private _scrollToBottom () {

        const contentEl = this._contentRef?.current;

        if (contentEl) {
            contentEl.scrollTop = contentEl.scrollHeight;
        }

    }

}

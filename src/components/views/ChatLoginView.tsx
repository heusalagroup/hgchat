// Copyright (c) 2021 Sendanor. All rights reserved.

import { REACT_APP_DISCORD_LABEL, REACT_APP_DISCORD_URL} from "../../constants/chat-ui-environment";
import { Component, ChangeEvent, FormEvent } from "react";
import { ChatUser } from "../../types/ChatUser";
import { AvatarUtils } from "../../utils/AvatarUtils";
import { AvatarType } from "../../types/AvatarType";
import { LogService } from "../../fi/hg/core/LogService";
import { ChatHeader } from "./ChatHeader";
import { trim } from "../../fi/hg/core/modules/lodash";

const LOG = LogService.createLogger('ChatLoginView');

export interface ChatLoginViewState {

}

export interface ChangeUserCallback {
    (user: ChatUser): void;
}

export interface ChatLoginViewProps {

    readonly user          : ChatUser;
    readonly changeUser    : ChangeUserCallback;
    readonly submitUser    : ChangeUserCallback;
    readonly enableHeader  : boolean;
    readonly darkMode      : boolean;

}

export class ChatLoginView extends Component<ChatLoginViewProps, ChatLoginViewState> {

    readonly _onSubmitCallback   : any;
    readonly _changeNickCallback : any;

    constructor(props: ChatLoginViewProps) {

        super(props);

        this.state = {
        };

        this._onSubmitCallback   = this._onSubmit.bind(this);
        this._changeNickCallback = this._onChangeNick.bind(this);

    }

    render() {

        const {user, enableHeader} = this.props;

        const Avatar1 = AvatarUtils.getAvatar(AvatarType.AVATAR_1);
        const Avatar2 = AvatarUtils.getAvatar(AvatarType.AVATAR_2);

        const {nick, avatar} = user;

        const submitDisabled = trim(nick) === "";

        return (
            <div className={'App chat-login-view'  + (this.props.darkMode ? ' Dark-App' : ' Light-App')}>

                {enableHeader ? (
                    <ChatHeader darkMode={this.props.darkMode} />
                ) : null}

                <section className="App-content">

                    <form onSubmit={this._onSubmitCallback}
                          className="chat-login-form"
                    >

                        <label className="field field-nick">

                            <input
                                className="field-input"
                                type="text"
                                placeholder="Valitse nimimerkki"
                                value={nick}
                                onChange={this._changeNickCallback}
                            />

                        </label>

                        <label className="field field-avatar">

                            <span className="field-avatar-text">Valitse avatar:</span>

                            <button
                                type="button"
                                className={"field-avatar-button " + (avatar === AvatarType.AVATAR_1 ? "selected" : "") }
                                onClick={() => {this._setAvatar(AvatarType.AVATAR_1)}}
                            ><Avatar1 /></button>

                            <button
                                type="button"
                                className={"field-avatar-button " + (avatar === AvatarType.AVATAR_2 ? "selected" : "") }
                                onClick={() => {this._setAvatar(AvatarType.AVATAR_2)}}
                            ><Avatar2 /></button>

                        </label>

                        <button
                            type="submit"
                            className={"submit-button" + (submitDisabled ? " submit-button-disabled" : "")}
                            onClick={this._onSubmitCallback}
                            disabled={submitDisabled}
                        >Aloita</button>

                        <p className="App-content-center">Tämä webbichatti on yhdistetty myös <a href={REACT_APP_DISCORD_URL}>{REACT_APP_DISCORD_LABEL}</a><br /> sekä IRCNetissä #sendanor.</p>

                    </form>

                </section>

                <footer className="App-footer">

                </footer>

            </div>
        );

    }

    private _onChangeNick (event: ChangeEvent<HTMLInputElement>) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const value = event?.target?.value ?? '';

        const user = this.props.user;

        const newUser = {
            ...user,
            nick: value
        };

        this._setUser(newUser);

    }

    private _onSubmit (event: FormEvent) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            this.props.submitUser(this.props.user);
        } catch (err) {
            LOG.error('Error: ', err);
        }

    }

    private _setUser (user: ChatUser) {

        try {
            this.props.changeUser(user);
        } catch (err) {
            LOG.error('Error: ', err);
        }

    }

    private _setAvatar (avatar: AvatarType) {

        const user = this.props.user;

        const newUser : ChatUser = {
            ...user,
            avatar: avatar
        };

        this._setUser(newUser);

    }

}

// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.
// Copyright (c) 2021. Sendanor. All rights reserved.

import { Component, MouseEvent } from "react";
import { ChatMessage } from "../../types/ChatMessage";
import { REACT_APP_FROM_URL, REACT_APP_TITLE } from "../../constants/chat-ui-environment";
import { ChatLogo, ChooseThemeIcon } from "../../assets/icons";
import { SendanorLogo} from "../../assets/logos";
import { ThemeService } from "../../fi/hg/ui/services/ThemeService";
import { ColorScheme } from "../../fi/hg/core/style/types/ColorScheme";
import "./ChatHeader.scss";

export interface OnNewMessageCallback {
    (message: ChatMessage): void;
}

export interface ChatHeaderProps {

    readonly darkMode : boolean;

}

export interface ChatHeaderState {
}

export class ChatHeader extends Component<ChatHeaderProps, ChatHeaderState> {

    private readonly _themeSwitchCallback : (event: MouseEvent<HTMLButtonElement>) => void;

    public constructor (props: ChatHeaderProps) {

        super(props);

        this.state = {};

        this._themeSwitchCallback = this._onThemeSwitch.bind(this);

    }

    public render() {

        return (
            <header className="App-header">
                <div className="App-header-logo"><ChatLogo/></div>
                <div className="App-header-title">{REACT_APP_TITLE}</div>
                <div className="App-header-from">
                    <div className="App-header-from-text">from</div>
                    <div className="App-header-from-logo"><a
                        className="App-header-from-logo-link"
                        href={REACT_APP_FROM_URL}
                    ><SendanorLogo /></a></div>
                </div>
                <div className="App-header-options">
                    <button
                        className="App-header-options-button App-header-options-theme-button"
                        onClick={this._themeSwitchCallback}
                    ><ChooseThemeIcon /></button>
                </div>
            </header>
        );

    }

    private _onThemeSwitch (e: MouseEvent<HTMLButtonElement>) {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ThemeService.setColorScheme( ThemeService.hasDarkMode() ? ColorScheme.LIGHT : ColorScheme.DARK );

    }

}

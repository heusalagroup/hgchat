// Copyright (c) 2021 Sendanor. All rights reserved.

import { Component } from "react";
import { ChatHeader } from "./ChatHeader";

export interface ChatJoiningViewState {

}

export interface ChatJoiningViewProps {

    readonly enableHeader : boolean;
    readonly darkMode     : boolean;

}

export class ChatJoiningView extends Component<ChatJoiningViewProps, ChatJoiningViewState> {

    constructor(props: ChatJoiningViewProps) {

        super(props);

        this.state = {
        };

    }

    render() {

        const {enableHeader} = this.props;

        return (
            <div className={"App chat-joining-view" + (this.props.darkMode ? ' Dark-App' : ' Light-App')}>

                {enableHeader ? (
                    <ChatHeader darkMode={this.props.darkMode} />
                ) : null}

                <section className="App-content">

                    Joining...

                </section>

                <footer className="App-footer">

                    Joining...

                </footer>

            </div>
        );

    }

}

// Copyright (c) 2022. Heusala Group Oy. All rights reserved.
// Copyright (c) 2021. Sendanor. All rights reserved.

import { REACT_APP_IO_URL } from "../../constants/chat-ui-environment";
import { useEffect, useState} from 'react';
import { ChatApp } from "./ChatApp";
import { MatrixChatService } from "../../services/MatrixChatService";
import './App.scss';

// import {SocketIoChatService} from "../../services/SocketIoChatService";
// const SOCKET : Socket = io(REACT_APP_IO_URL, { autoConnect: false });
// const CHAT_SERVICE = new SocketIoChatService(SOCKET);

const CHAT_SERVICE = new MatrixChatService(REACT_APP_IO_URL);

CHAT_SERVICE.connect();

function useQuery () {

    const [query, setQuery] = useState<URLSearchParams>( new URLSearchParams(window.location.search) );

    useEffect(() => {

        const listener = () => {
            setQuery( new URLSearchParams(window.location.search) );
        };

        window.addEventListener('locationchange', listener);

        return () => {
            window.removeEventListener('locationchange', listener);
        };

    });

    return query;

}

export function App () {

    const query = useQuery();

    const h = query.get("h");

    const enableHeader : boolean = !h ? true : ( (h[0] === "t" || h[0] === "1") );

    return (
        <ChatApp
            enableHeader={enableHeader}
            chatService={CHAT_SERVICE}
        />
    );

}



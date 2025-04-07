import { createSignal, createEffect } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";

import { getChatHistories, deleteChatHistories, deleteChatHistory } from "../utils/ChatHistory";


function Layout(props) {
  // TODO polish deletion of entire chat history
  //    - currently reloads entire page
  //    - ui button is ugly, and needs to be clearer that the button is dangerous
  // TODO add styling to chat links (& highlight current chat)
  // TODO chat link order based on most recently accessed?

  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = createSignal(getChatHistories());

  // whenever the URL changes, re-fetch the chat history
  createEffect(() => {
    setChats(getChatHistories());
    location.pathname; // reactive dependency
  });

  const handleChatDeletion = (chatId) => {
    deleteChatHistory(chatId);
    setChats(getChatHistories());

    if (location.pathname.includes(chatId)) {
      navigate('/');
    }
  };

  return (
    <>
      <div class="container">
        <div class="sidebarContainer">
          <h1>Local Chat</h1>
          <a href="/">Create New Chat</a>
          <br/><br/>
          <h2>Chat History</h2>
          <For each={chats()}>{(chat) =>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-left:6em;padding-right:6em;">
              <a href={`/${chat.chatType}/${chat.chatId}`}>{chat.chatId}</a>
              <button onClick={() => {handleChatDeletion(chat.chatId)}}>Delete</button>
            </div>
          }</For>
          <br/>
          <button onClick={() => {deleteChatHistories(); navigate('/');}}>
            Delete Chat History
          </button>
        </div>
        <div class="pageContainer">
          {props.children} {/* nested components are passed in here */}
        </div>
      </div>
    </>
  );
}

export default Layout;

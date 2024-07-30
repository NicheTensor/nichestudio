import { useState } from "react";
import { BsPlus } from "react-icons/bs";

import ChatInput from "@/components/ChatCompletions/ChatInput";

const InteractBar = ({ createNewConversation, conversation, setMessages, updateModel }) => {
  const [sending, setSending] = useState(false);

  return (
    <div className="flex items-end gap-4">
      <ChatInput sending={sending} conversation={conversation} setSending={setSending} updateModel={updateModel} setMessages={setMessages} />
      <button
        className="w-12 h-12 p-2.5 flex-shrink-0 flex justify-center items-center text-white bg-blue-700 enable:hover:bg-blue-600 active:bg-blue-800 transition rounded-full"
        onClick={createNewConversation}
        disabled={sending}
        title="Create new conversation"
      >
        <BsPlus className="text-5xl" />
      </button>
    </div>
  );
};

export default InteractBar;

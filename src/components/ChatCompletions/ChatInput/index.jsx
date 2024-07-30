import React, { useEffect, useRef } from "react";

import { generateText } from "@/utils/ApiCaller";
import ModelSelect from "../ModelSelect";

const ChatInput = ({ sending, conversation, setSending, updateModel, setMessages }) => {
  const inputRef = useRef(null);

  const handleSendMessageClicked = async () => {
    const message = inputRef.current?.innerText.trim();

    if (!message || sending) {
      inputRef.current?.focus();
      return;
    }

    if (inputRef.current) inputRef.current.innerText = "";

    try {
      setSending(true);
      const newMessages = [...conversation.messages, { role: "user", content: message }];
      setMessages(newMessages);
      const result = await generateText(newMessages, conversation.model);
      if (!!result.choices) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: result.choices.at(0).text },
        ]);
      }
    } catch (error) {
      console.log(error);
      alert("Some thing went wrong, please try again!");
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    const shouldSendMessage =
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.metaKey &&
      !e.nativeEvent.isComposing;
    if (!shouldSendMessage) return;
    handleSendMessageClicked();
    e.preventDefault();
  };

  useEffect(() => {
    !sending && inputRef.current.focus();
  }, [sending]);

  return (
    <div className="w-full flex gap-4">
      <ModelSelect model={conversation.model} disabled={!!conversation.messages.length} onSelect={updateModel} />
      {sending ? (
        <p className="w-full h-12 px-3 py-2.5 flex justify-center rounded-3xl border-2 bg-gray-200 border-blue-700 outline-none transition">
          <span className="loading loading-dots loading-md" />
        </p>
      ) : (
        <p
          ref={inputRef}
          autoFocus
          onKeyDown={handleKeyDown}
          style={{
            WebkitUserModify: "read-write-plaintext-only",
            wordBreak: "break-word",
          }}
          className="w-full max-h-60 px-3 py-2.5 overflow-y-auto text-gray-900 bg-white focus:!bg-gray-100 rounded-3xl border-2 border-blue-700 outline-none transition resize-none chat-input"
          contentEditable
          role="textbox"
        />
      )}
    </div>
  );
};

export default ChatInput;

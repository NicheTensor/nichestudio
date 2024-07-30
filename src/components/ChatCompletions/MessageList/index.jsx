import { useEffect, useRef } from "react";

import Message from "../Message";

const MessageList = ({ messages }) => {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current.scrollTo(0, listRef.current.scrollHeight);
  }, [messages?.length])


  return (
    <div className="flex-grow flex flex-col gap-6 overflow-y-auto z-10" ref={listRef}>
      {messages?.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

export default MessageList;

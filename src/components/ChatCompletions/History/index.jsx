import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import clsx from "clsx";
import { BsThreeDotsVertical, BsX } from "react-icons/bs";

// historyType { role: string, content: string }[][]

const History = ({ history, currentConversationIndex, onSelect, onDelete }) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-12 h-12 flex-shrink-0 flex justify-center items-center bg-white hover:bg-gray-50 active:bg-gray-200 outline-none transition rounded-full">
          <BsThreeDotsVertical fontSize={20} />
        </button>
      </DropdownTrigger>
      <DropdownMenu variant="solid" aria-label="Chat history" disabledKeys={[currentConversationIndex.toString(), 'empty']}>
        <DropdownSection title="History">
          {!!history.at(0)?.messages.length ? history.map(({ messages }, index) => (
            <DropdownItem
              key={index.toString()}
              className={clsx(
                "text-black",
                index === currentConversationIndex && "bg-gray-200 opacity-100",
              )}
              textValue={messages.at(0)?.content}
            >
              <div className="max-w-56 flex justify-between gap-2 group" onClick={() => onSelect(index)}>
                <span className="ellipsis">{messages.at(0)?.content}</span>
                <button className="invisible group-hover:visible text-blue-700 transition" onClick={() => onDelete(index)} disabled={index === currentConversationIndex}>
                  <BsX fontSize={20} />
                </button>
              </div>
            </DropdownItem>
          )) : <DropdownItem className="text-black" key="empty" textValue="No history">No history</DropdownItem>}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
};

export default History;

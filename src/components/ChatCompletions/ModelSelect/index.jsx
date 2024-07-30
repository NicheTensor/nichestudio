import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
} from "@nextui-org/react";
import clsx from "clsx";

import { chatModels } from "@/app/data";

// historyType { role: string, content: string }[][]

const ModelSelect = ({ model, disabled, onSelect }) => {
    if (disabled)
        return (
            <button className="w-32 h-12 flex-shrink-0 flex justify-center items-center bg-gray-200 outline-none rounded-full pointer-events-none">
                {model}
            </button>
        );

    return (
        <Dropdown>
            <DropdownTrigger>
                <button className="w-32 h-12 flex-shrink-0 flex justify-center items-center bg-white hover:bg-gray-50 active:bg-gray-200 outline-none transition rounded-full">
                    {model}
                </button>
            </DropdownTrigger>
            <DropdownMenu
                variant="solid"
                aria-label="Chat history"
                disabledKeys={[model]}
            >
                <DropdownSection title="Model">
                    {chatModels.map((item) => (
                        <DropdownItem
                            key={item}
                            className={clsx(
                                "text-black",
                                item === model && "bg-gray-200 opacity-100",
                            )}
                            textValue={item}
                        >
                            <div
                                className="max-w-56 flex justify-between gap-2 group"
                                onClick={() => onSelect(item)}
                            >
                                <span className="ellipsis">{item}</span>
                            </div>
                        </DropdownItem>
                    ))}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};

export default ModelSelect;

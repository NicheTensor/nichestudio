import clsx from "clsx";

const Message = ({ role, content }) => (
  <div
    className={clsx("flex gap-4", role === "user" ? "flex-row-reverse" : "")}
  >
    <img
      className="w-12 h-12 rounded-full"
      src={role === "user" ? "user.svg" : "assistant.svg"}
      alt="avatar"
    />
    <div
      className={clsx(
        "rounded-xl p-3",
        role === "user" ? "bg-gray-200" : "bg-white",
      )}
    >
      {content}
    </div>
  </div>
);

export default Message;

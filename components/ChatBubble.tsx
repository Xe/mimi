import { ComponentChildren } from "preact";

export interface ChatBubbleProps {
  reply?: boolean;
  bg?: string;
  fg?: string;
  children: ComponentChildren;
  id?: string;
}

export default function ChatBubble({
  reply = false,
  bg = "blue-200",
  fg = "slate-50",
  children,
  id,
}: ChatBubbleProps) {
  return (
    <div id={id} className={`mx-auto my-2 w-full ${reply ? "" : "space-y-4"}`}>
      <div className={`flex ${reply ? "justify-start" : "justify-end"}`}>
        <div className={`flex w-11/12 ${reply ? "" : "flex-row-reverse"}`}>
          <div
            className={`relative max-w-xl rounded-xl ${
              reply ? "rounded-tl-none" : "rounded-tr-none"
            } bg-${bg} px-4 py-2`}
          >
            <span className={`font-medium text-${fg}`}>{children}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

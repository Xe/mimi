import { ComponentChildren } from "preact";
import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { Message } from "@/lib/chatml.ts";
import { Button } from "@/components/Button.tsx";

interface ChatProps {
  chatID: Signal<string>;
}

export function ChatBubble({
  reply = false,
  bg = "blue-200",
  fg = "slate-50",
  children,
  id,
}: {
  reply?: boolean;
  bg?: string;
  fg?: string;
  children: ComponentChildren;
  id?: string;
}) {
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

export default function Chat(props: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<string>("xe/mimi:7b");
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    console.log(`connecting to /api/chat/ws/${props.chatID.value}...`);
    const ws = new WebSocket(
      `ws://${location.host}/api/chat/ws/${props.chatID.value}`,
    );

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      console.log(message);

      if (message.type === "init") {
        setModel(message.model);
        return;
      }

      setMessages((messages) => [...messages, message]);
    });

    return () => ws.close();
  }, [connected]);

  return (
    <div className="m-4">
      <h1 class="text-4xl font-bold">Mimi</h1>
      <p class="my-4">
        Model: <code>{model}</code>
      </p>
      <p class="my-4">
        Chat ID: <code>{props.chatID.value}</code>
      </p>

      <Button
        onClick={() => {
          console.log("clicked");
          setConnected(!connected);
          setMessages([]);
        }}
      >
        Connect
      </Button>

      <div className="max-w-2xl mx-auto">
        {messages.map((message: Message) => (
          <ChatBubble
            id={message.id}
            bg={message.role === "assistant" ? "green-300" : "blue-300"}
            reply={message.role === "assistant"}
          >
            {message.content}
          </ChatBubble>
        ))}
      </div>
    </div>
  );
}

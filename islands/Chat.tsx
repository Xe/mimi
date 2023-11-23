import type { Signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { Message } from "@/lib/chatml.ts";
import Button from "@/components/Button.tsx";
import ChatBubble from "@/components/ChatBubble.tsx";

interface ChatProps {
  chatID: Signal<string>;
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

      {messages.map((message: Message) => (
        <ChatBubble
          id={message.id}
          bg={message.role === "assistant" ? "green-300" : "blue-300"}
          reply={message.role === "assistant"}
        >
          <span dangerouslySetInnerHTML={{ __html: message.content }} />
        </ChatBubble>
      ))}
    </div>
  );
}

import { PageProps } from "$fresh/server.ts";
import ChatIsland from "@/islands/Chat.tsx";
import { useSignal } from "@preact/signals";

export default function Chat(props: PageProps) {
  const { chatID } = props.params;
  const chatIDSignal = useSignal(chatID);

  return <ChatIsland chatID={chatIDSignal} />;
}

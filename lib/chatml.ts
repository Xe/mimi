export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  id?: string;
}

export function stringify(message: Message): string {
  return `<|im_start|>${message.role}
${message.content}
<|im_end|>`;
}

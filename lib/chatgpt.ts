export interface ChatRequest {
  model: "gpt-3.5-turbo" | "gpt-4" | "gpt-4-1106-preview";
  messages: Message[];
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: string;
  completion_tokens: string;
  total_tokens: string;
}

export interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: Usage;
  choices: Choice[];
}

export default async function complete(
  cr: ChatRequest,
  apiKey: string,
): Promise<ChatResponse> {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(cr),
  });

  if (resp.status != 200) {
    throw new Error(`chatgpt: ${resp.statusText}: ${await resp.text()}`);
  }

  return (await resp.json());
}

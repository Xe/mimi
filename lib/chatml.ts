export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  id?: string;
}

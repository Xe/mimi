import ollama, { GenerateRequest } from "@/lib/ollama.ts";
import { HandlerContext } from "$fresh/server.ts";
import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { Message } from "@/lib/chatml.ts";

const model = "xe/mimi:7b";

const kv = await Deno.openKv();

export const handler = (req: Request, ctx: HandlerContext): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  const convID = ctx.params.id !== "new" ? ctx.params.id : ulid();

  socket.onopen = async () => {
    console.log("WebSocket has been opened.");
    socket.send(JSON.stringify({ type: "init", model, convID }));

    for await (
      const message of kv.list({
        prefix: ["conversations", "messages", convID],
      })
    ) {
      socket.send(JSON.stringify(message.value));
    }
  };

  socket.onmessage = async (e) => {
    const { prompt, action } = JSON.parse(e.data);

    const userMessageID = ulid();

    const message: Message = {
      role: "user",
      content: prompt,
      id: userMessageID,
    };

    await kv.set(
      ["conversations", "messages", convID, userMessageID],
      message,
    );

    const opts: GenerateRequest = {
      prompt,
      model,
      stream: false,
    };

    const contextVal = await kv.get(["conversations", "context", convID]);
    const context = contextVal ? contextVal.value : [];

    if (context && context.length > 0) {
      opts.context = context;
    }

    const response = await ollama.generate(opts);

    const assistantMessageID = ulid();

    const assistantMessage: Message = {
      role: "assistant",
      content: response.response,
      id: assistantMessageID,
    };

    await kv.set(
      ["conversations", "messages", convID, assistantMessageID],
      assistantMessage,
    );

    await kv.set(
      ["conversations", "context", convID],
      response.context,
    );

    socket.send(
      JSON.stringify({ response: response.response.trim(), done: true }),
    );

    // for await (
    //   const token of ollama.stream({
    //     prompt,
    //     model,
    //     stream: true,
    //   })
    // ) {
    //   socket.send(JSON.stringify(token));
    // }
  };
  socket.onclose = () => {
    console.log("WebSocket has been closed.");
  };
  socket.onerror = (e) => console.error("WebSocket error:", e);
  return response;
};

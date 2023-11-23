export class Conversation {
  #context: number[]; // private
  #socket: WebSocket;
  #model: string;

  constructor(socket: WebSocket, model: string) {
    this.#context = [];
    this.#socket = socket;
    this.#model = model;
  }

  async onMessage(message: string): Promise<void> {
  }
}

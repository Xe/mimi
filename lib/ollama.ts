export interface GenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  format?: "json";
  options?: any;
  system?: string;
  template?: string;
  context?: number[];
  raw?: boolean;
}

export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  context: number[];
  done: boolean;
}

export interface GenerateStep {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export interface GenerateDone extends GenerateStep {
  context: number[];
  total_duration: string;
  load_duration: string;
  prompt_eval_count: number;
  eval_count: number;
  eval_duration: string;
}

export class Client {
  constructor(
    public url: string,
  ) {}

  async generate(inp: GenerateRequest): Promise<GenerateResponse> {
    const u = `${this.url}/api/generate`;

    const resp = await fetch(u, {
      method: "POST",
      body: JSON.stringify(inp),
    });
    if (resp instanceof Error) {
      throw new Error(`error fetching response: ${resp.message}`);
    }

    if (resp.status !== 200) {
      throw new Error(
        `error fetching response: ${resp.status}: ${await resp.text()}`,
      );
    }

    const result = await resp.json() as GenerateResponse;
    if (result instanceof Error) {
      throw new Error(`error parsing GenerateResponse: ${result.message}`);
    }

    return result;
  }

  async *stream(
    inp: GenerateRequest,
  ): AsyncGenerator<GenerateStep | GenerateDone> {
    inp.stream = true;
    const u = `${this.url}/api/generate`;

    const resp = await fetch(u, {
      method: "POST",
      body: JSON.stringify(inp),
    });
    if (resp instanceof Error) {
      throw new Error(`error fetching response: ${resp.message}`);
    }

    if (resp.status !== 200) {
      throw new Error(
        `error fetching response: ${resp.status}: ${await resp.text()}`,
      );
    }

    for await (
      const step of parseJSON<GenerateStep | GenerateDone>(resp.body)
    ) {
      if (step.done) {
        return step;
      }

      yield step;
    }
  }
}

const cli = new Client("http://localhost:11434");

export default cli;

export const parseJSON = async function* <T = unknown>(
  itr:
    | Iterable<{ toString: () => string }>
    | AsyncIterable<{ toString: () => string }>,
): AsyncGenerator<T> {
  let buffer = "";

  for await (const chunk of itr) {
    buffer += chunk;

    const parts = buffer.split("\n");

    buffer = parts.pop() ?? "";

    for (const part of parts) {
      try {
        yield JSON.parse(part);
      } catch (error) {
        console.warn("invalid json: ", part);
      }
    }
  }

  for (const part of buffer.split("\n").filter((p) => p !== "")) {
    try {
      yield JSON.parse(part);
    } catch (error) {
      console.warn("invalid json: ", part);
    }
  }
};

export interface Agent<TInput = any, TOutput = any> {
  run(input: TInput): Promise<TOutput>
}

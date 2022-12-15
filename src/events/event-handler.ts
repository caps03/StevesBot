export interface EventHandler {
  process(...args: Array<any>): Promise<void>;
}

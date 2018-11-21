export interface IExchange {
  message: string;
  response: string;
  intent: string;
  time: Date;
}

export interface IConversation {
  exchanges: Array<IExchange>;
  status: string;
}

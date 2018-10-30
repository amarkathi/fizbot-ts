export interface IExchange {
  message: string;
  response: string;
  time: Date;
}

export interface IConversation {
  exchanges: Array<IExchange>;
  status: string;
}

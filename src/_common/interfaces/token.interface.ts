import { IMessage } from './message.interface';

export interface IToken extends Partial<IMessage> {
  access_token: string;
}

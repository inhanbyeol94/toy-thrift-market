import { IPayload } from 'src/_common/interfaces/payload.interface';

export interface IView extends Partial<IPayload> {
  title: string;
  subtitle: string;
  isLogin: boolean;
}

import { Injectable } from '@nestjs/common';
import { IPayload } from 'src/_common/interfaces/payload.interface';
import { IView } from 'src/_common/interfaces/view.interface';

@Injectable()
export class ViewService {
  requiredAuth(title: string, subtitle: string, payload: IPayload): IView {
    if (!payload) return { title, subtitle, isLogin: false };
    return {
      title,
      subtitle,
      ...payload,
      profileImage: payload.profileImage || 'https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png',
      isLogin: true,
    };
  }
}

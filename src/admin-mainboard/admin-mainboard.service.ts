import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MainPage, MainPageDocument } from '../_common/schema/like.schema';
import { IMessage } from '../_common/interfaces/message.interface';

@Injectable()
export class AdminMainboardService {
  constructor(@InjectModel(MainPage.name) private mainPageModel: Model<MainPageDocument>) {}

  // test code add
  async createPost(mainList: MainPage): Promise<IMessage> {
    const newPost = new this.mainPageModel(mainList);
    await newPost.save();
    return { message: '테스트완료' };
  }
}

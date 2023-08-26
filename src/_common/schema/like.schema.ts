import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MainPageDocument = Document & MainPage;
@Schema()
export class MainPage {
  @Prop()
  mainTitle: string;
  @Prop()
  subTitle: string;
  @Prop()
  bottomTap: string;
  @Prop()
  mainImage: string;
  @Prop()
  bottomTitle: string;
  // @Prop()
  // columns: [
  //   {
  //     icon: string;
  //     title: string;
  //     content: string;
  //   },
  // ];
  @Prop([
    {
      icon: String,
      title: String,
      content: String,
      icon2: String,
      title2: String,
      content2: String,
      icon3: String,
      title3: String,
      content3: String,
      icon4: String,
      title4: String,
      content4: String,
    },
  ])
  columns: {
    icon: string;
    title: string;
    content: string;
    icon2: string;
    title2: string;
    content2: string;
    icon3: string;
    title3: string;
    content3: string;
    icon4: string;
    title4: string;
    content4: string;
  }[];

  isAdmin: boolean;
}
export const MainPageSchema = SchemaFactory.createForClass(MainPage);
// 1. 몽구스 연결 확인부터 하기

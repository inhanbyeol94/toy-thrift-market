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
    },
  ])
  columns: { icon: string; title: string; content: string }[];

  isAdmin: boolean;
}
export const MainPageSchema = SchemaFactory.createForClass(MainPage);
// 1. 몽구스 연결 확인부터 하기

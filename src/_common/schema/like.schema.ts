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
  @Prop()
  columns: [
    {
      icon: string;
      title: string;
      content: string;
    },
  ];
}
export const MainPageSchema = SchemaFactory.createForClass(MainPage);
// 1. 몽구스 연결 확인부터 하기

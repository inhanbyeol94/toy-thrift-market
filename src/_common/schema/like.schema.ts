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
  mainImage: string;
  @Prop()
  bottomTitle: string;
  @Prop()
  bottomColor: string;

  @Prop()
  icon1: string;
  @Prop()
  title1: string;
  @Prop()
  content1: string;
  @Prop()
  icon2: string;
  @Prop()
  title2: string;
  @Prop()
  content2: string;
  @Prop()
  icon3: string;
  @Prop()
  title3: string;
  @Prop()
  content3: string;
  @Prop()
  icon4: string;
  @Prop()
  title4: string;
  @Prop()
  content4: string;
  //   @Prop([
  //     {
  //       icon1: String,
  //       title1: String,
  //       content1: String,
  //       icon2: String,
  //       title2: String,
  //       content2: String,
  //       icon3: String,
  //       title3: String,
  //       content3: String,
  //       icon4: String,
  //       title4: String,
  //       content4: String,
  //     },
  //   ])
  //   columns: {
  //     icon1: string;
  //     title1: string;
  //     content1: string;
  //     icon2: string;
  //     title2: string;
  //     content2: string;
  //     icon3: string;
  //     title3: string;
  //     content3: string;
  //     icon4: string;
  //     title4: string;
  //     content4: string;
  //   }[];
}
export const MainPageSchema = SchemaFactory.createForClass(MainPage);
// 1. 몽구스 연결 확인부터 하기

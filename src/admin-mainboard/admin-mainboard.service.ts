import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MainPage, MainPageDocument } from '../_common/schema/like.schema';
import { IMessage } from '../_common/interfaces/message.interface';
import { UploadService } from '../upload/upload.service';
import { MainBoardDto } from '../_common/dtos/mainboard.dto';

@Injectable()
export class AdminMainboardService {
  constructor(
    @InjectModel(MainPage.name) private mainPageModel: Model<MainPageDocument>,
    private uploadService: UploadService,
  ) {}

  async upsertMainpage(mainList: MainBoardDto, file: string): Promise<IMessage> {
    await this.mainPageModel.updateOne({ target: 1 }, { ...mainList, mainImage: file }, { upsert: true });

    return { message: '생성완료' };
  }

  // 조회
  async findmainBoard(): Promise<MainPage[]> {
    return this.mainPageModel.find().exec(); // isAdmin:true
  }
  //   // 메인페이지 수정
  //   async editmainBoard(id: string, mainPage: any): Promise<IMessage> {
  //     // 몽고DB에서는 기본적으로 _id필드를 ObjectID 타입으로 생성함 / _id": "64e9bae4516f0e147346eb13
  //     // id필드를 Number로 지정할수 있긴한데 이렇게하면 몽고DB가 자동으로 id값을 생성하지 않고 새 문서를 만들때마다 고유숫자ID를 직접 제공해야한다고 함
  //     // 그래서 객체구조분해 안하고 따로 선언
  //     // const _id = updateBoard._id;
  //     console.log(mainPage);
  //     const updateFields = { ...mainPage };
  //     // _id 필드 수정하지 않기 위해 delete 추가
  //     delete updateFields._id;
  //     const docToUpdate = await this.mainPageModel.findOne({ _id: id });
  //
  //     if (!docToUpdate) {
  //       throw new HttpException('수정할 메인보드가 없습니다.', 400);
  //     }
  //     docToUpdate.set(updateFields);
  //     console.log(updateFields);
  //     await docToUpdate.save();
  //     return { message: '메인보드가 변경되었습니다.' };
  //   }

  // 수정
  // async updateBoard(id: string );
}

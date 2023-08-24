import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../_common/dtos/create-comment.dto';
import { UpdateCommentDto } from '../_common/dtos/update-comment.dto';
import { IMessage } from 'src/_common/interfaces/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, Document, Member } from 'src/_common/entities';
import { SlackService } from '../slack/slack.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Document) private documentRepository: Repository<Document>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private slackService: SlackService,
    private configService: ConfigService,
  ) {}
  // 댓글 작성
  async createComment(data: CreateCommentDto, id: number): Promise<IMessage> {
    const { content, documentId } = data;
    // console.log(memberId, documentId);
    const existingDocument = await this.documentRepository.findOne({ where: { id: documentId } });
    if (!existingDocument) throw new HttpException('해당 게시물이 존재하지 않습니다.', 404);
    const DocTitle = existingDocument.title;
    const DocId = existingDocument.id;
    const exisingMember = await this.memberRepository.findOne({ where: { id } });
    if (!exisingMember) throw new HttpException('해당 멤버가 존재하지 않습니다.', 404);
    const writerNickname = exisingMember.nickname;

    const newComment = this.commentRepository.create({ content, member: exisingMember, document: existingDocument });
    await this.commentRepository.save(newComment);

    // 슬랙 메시지 보내기
    const port = this.configService.get<string>('HOST');
    const slackMessage = `"${DocTitle}" 문의글에 답글이 등록되었습니다. \n - 작성자: ${writerNickname} \n - URL: http://${port}/document?id=${DocId}`;
    this.slackService.sendSlackMessage(slackMessage);

    return { message: '댓글이 작성되었습니다.' };
  }
  // 댓글 조회
  async getComments(documentId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { document: { id: documentId } } });
  }
  // 댓글 상세 조회
  async getOneComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    if (!comment) throw new HttpException('댓글을 찾지 못했습니다.', 404);
    return comment;
  }
  // 댓글 수정
  async updateComment(id: number, data: UpdateCommentDto): Promise<IMessage> {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    if (!comment) throw new NotFoundException('해당하는 댓글이 없습니다.');
    comment.content = data.content;
    await this.commentRepository.save(comment);
    return { message: '댓글이 수정되었습니다.' };
  }
  // 댓글 삭제
  async deleteComment(id: number): Promise<IMessage> {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    if (!comment) throw new NotFoundException('해당하는 댓글이 없습니다.');
    await this.commentRepository.softDelete(id);
    return { message: '댓글이 삭제되었습니다. ' };
  }
}

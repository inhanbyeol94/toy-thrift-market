import { PartialType } from '@nestjs/mapped-types';
import { CreatePickDto } from './create-pick.dto';

export class UpdatePickDto extends PartialType(CreatePickDto) {}

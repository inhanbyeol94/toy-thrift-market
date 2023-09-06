import { PartialType } from '@nestjs/mapped-types';
import { CreateEasyPasswordDto } from './create-easy-password.dto';

export class UpdateEasyPasswordDto extends PartialType(CreateEasyPasswordDto) {}

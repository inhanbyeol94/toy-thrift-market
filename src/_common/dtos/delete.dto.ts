import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
class DeleteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/[ㄱ-ㅎ가-힣a-zA-Z0-9\s~`!@#$%^&*()_+=[\]{}|\\;:'",<.>?/-]+$/)
  password: string;
}
export { DeleteDto };

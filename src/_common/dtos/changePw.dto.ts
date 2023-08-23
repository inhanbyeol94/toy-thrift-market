import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

class ChangeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
  confirmPassword: string;
}
export { ChangeDto };

import { IsEnum, IsOptional } from 'class-validator';

import { SubjectEnum } from '../../constants/enums/subject.enum';

export class GetRatingOfStudentQueries {
  @IsEnum(SubjectEnum)
  subject: SubjectEnum;
}

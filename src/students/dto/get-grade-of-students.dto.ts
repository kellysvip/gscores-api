import { IsEnum } from 'class-validator';

import { SubjectEnum } from '../../constants/enums/subject.enum';

export class GetGradeOfStudentQueries {
  @IsEnum(SubjectEnum)
  subject: SubjectEnum;
}

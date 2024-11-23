import { PickType } from '@nestjs/mapped-types';

import { StudentEntity } from '../student.entity';

export class GetStudentByIdParams extends PickType(StudentEntity, [
  'id',
] as const) {}

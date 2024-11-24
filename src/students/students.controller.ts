import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import validationPipe from '../validation-pipe';

import { GetRatingOfStudentQueries } from './dto/get-rating-of-students.dto';
import { StudentsService } from './students.service';
import {
  getGradeOfStudentsQueries,
  getRatingOfStudentsQueries,
} from './students.request-schema';
import { GetStudentByIdParams } from './dto/get-student-by-id';
import { GetGradeOfStudentQueries } from './dto/get-grade-of-students.dto';
import { EntityName } from '../constants/enums/entity-name.enum';
import { AllExceptionsFilter } from '../errors/exception-filter';

@UsePipes(validationPipe())
@UseFilters(AllExceptionsFilter)
@Controller(EntityName.STUDENTS)
@ApiTags('Students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('/count_grade')
  @ApiQuery(getGradeOfStudentsQueries)
  getGradeOfStudentsBySubject(@Query() queries: GetGradeOfStudentQueries) {
    return this.studentsService.getGradeOfStudentsBySubject(queries);
  }

  @Get('/')
  @ApiQuery(getRatingOfStudentsQueries)
  getRatingOfStudentsBySubject(@Query() queries: GetRatingOfStudentQueries) {
    return this.studentsService.getRatingOfStudentsBySubject(queries);
  }

  @Get('/top/groupA')
  getListOfTopStudents() {
    return this.studentsService.getListOfTopStudents();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
  })
  getStudentById(@Param() { id }: GetStudentByIdParams) {
    return this.studentsService.getStudentById(id);
  }
}

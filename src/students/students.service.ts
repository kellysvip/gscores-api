import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SELECTABLE_FIELDS, StudentEntity } from './student.entity';
import { GetRatingOfStudentQueries } from './dto/get-rating-of-students.dto';
import { SortingOption } from '../constants/enums/sorting-options.enum';
import { EntityName } from '../constants/enums/entity-name.enum';
import { SubjectEnum } from '../constants/enums/subject.enum';
import { GetGradeOfStudentQueries } from './dto/get-grade-of-students.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentsRepo: Repository<StudentEntity>,
  ) {}

  /**
   * Return rating of students matching all the given criteria
   * @param {object} subject     - the subject to filter
   *
   * @return {object}  number of students matching find conditions
   */
  async getRatingOfStudentsBySubject({ subject }: GetRatingOfStudentQueries) {
    const students = await this.studentsRepo
      .createQueryBuilder(EntityName.STUDENTS)
      .select([
        `${EntityName.STUDENTS}.id`,
        `${EntityName.STUDENTS}.${subject}`,
        `CASE WHEN ${EntityName.STUDENTS}.${subject} >= 8 THEN 'verygood'
        WHEN ${EntityName.STUDENTS}.${subject} >= 6 THEN 'good' 
        WHEN ${EntityName.STUDENTS}.${subject} >= 4 THEN 'average'
        ELSE 'poor' 
        END AS rating`,
      ])
      .where(`${EntityName.STUDENTS}.${subject} IS NOT NULL`)
      .orderBy('rating', SortingOption.DESC)
      .addOrderBy(`${EntityName.STUDENTS}.${subject}`, SortingOption.DESC)
      .getRawMany();

    return students.reduce((acc, student) => {
      const { rating } = student;

      if (!acc[rating]) {
        acc[rating] = 0;
      }

      acc[rating] += 1;

      return acc;
    }, {});
  }

  /**
   * Return a list of top ten students in group A
   */
  async getListOfTopStudents() {
    return await this.studentsRepo
      .createQueryBuilder(EntityName.STUDENTS)
      .select(`${EntityName.STUDENTS}.id`, 'id')
      .addSelect(`${EntityName.STUDENTS}.${SubjectEnum.MATH}`, SubjectEnum.MATH)
      .addSelect(
        `${EntityName.STUDENTS}.${SubjectEnum.PHYSICS}`,
        SubjectEnum.PHYSICS,
      )
      .addSelect(
        `${EntityName.STUDENTS}.${SubjectEnum.CHEMISTRY}`,
        SubjectEnum.CHEMISTRY,
      )
      .addSelect(
        `${EntityName.STUDENTS}.${SubjectEnum.MATH} + ${EntityName.STUDENTS}.${SubjectEnum.PHYSICS} + ${EntityName.STUDENTS}.${SubjectEnum.CHEMISTRY}`,
        `total_score`,
      )
      .where(`${EntityName.STUDENTS}.${SubjectEnum.MATH} IS NOT NULL`)
      .andWhere(`${EntityName.STUDENTS}.${SubjectEnum.PHYSICS} IS NOT NULL`)
      .andWhere(`${EntityName.STUDENTS}.${SubjectEnum.CHEMISTRY} IS NOT NULL`)
      .orderBy('total_score', SortingOption.DESC)
      .limit(10)
      .getRawMany();
  }

  /**
   * Return all student's details matching the given student id
   *
   * @param {string}   studentId - the student id
   *
   * @return {object} the student's details
   */
  async getStudentById(studentId: string) {
    return await this.studentsRepo.findOneOrFail({
      where: { id: studentId },
      select: SELECTABLE_FIELDS,
    });
  }

  /**
   * Return grade of students matching all the given criteria
   * @param {object} subject     - the subject to filter
   *
   * @return {object}  number of students matching find conditions
   */
  async getGradeOfStudentsBySubject({ subject }: GetGradeOfStudentQueries) {
    const students = await this.studentsRepo
      .createQueryBuilder(EntityName.STUDENTS)
      .select(`CAST(${EntityName.STUDENTS}.${subject} AS FLOAT)`, 'grade')
      .orderBy(`CAST(${EntityName.STUDENTS}.${subject} AS FLOAT)`, 'ASC')
      .getRawMany();

    const gradeCounts: Record<string, number> = {};

    for (const student of students) {
      const grade = student.grade !== null ? Number(student.grade) : null;
      if (grade !== null && !isNaN(grade)) {
        const gradeKey = grade.toFixed(1);
        gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1;
      }
    }

    return gradeCounts;
  }
}

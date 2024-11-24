import { DataSource, Repository } from 'typeorm';

import { clearDataSource, setupDataSource } from '../../test/_utils_/db.util';
import { StudentEntity } from './student.entity';
import { StudentsService } from './students.service';
import { SubjectEnum } from '../constants/enums/subject.enum';

import { students } from '../../test/__fixture__/students.fixture';

describe('[students] Students Service', () => {
  let dataSource: DataSource;
  let studentRepo: Repository<StudentEntity>;
  let studentsService: StudentsService;

  beforeAll(async () => {
    dataSource = await setupDataSource();
    studentRepo = dataSource.getRepository(StudentEntity);

    studentsService = new StudentsService(studentRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDataSource(dataSource);
  });

  describe('#getRatingOfStudentsBySubject', () => {
    let getStudentSpy: jest.SpyInstance;

    beforeAll(() => {
      getStudentSpy = jest.spyOn(studentRepo, 'createQueryBuilder');
    });

    afterAll(() => {
      getStudentSpy.mockRestore();
    });

    test('should correctly return the list of rating of students', async () => {
      const studentRepoMock = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValue([
          {
            id: '1000001',
            math: 8,
            rating: 'good',
          },
          {
            id: '1000002',
            math: 9,
            rating: 'verygood',
          },
          {
            id: '1000003',
            math: 5,
            rating: 'average',
          },
          {
            id: '1000004',
            math: 2,
            rating: 'poor',
          },
        ]),
      };

      getStudentSpy.mockReturnValue(studentRepoMock);

      await expect(
        studentsService.getRatingOfStudentsBySubject({
          subject: SubjectEnum.MATH,
        }),
      ).resolves.toEqual({
        average: 1,
        good: 1,
        poor: 1,
        verygood: 1,
      });

      expect(studentRepoMock.where.mock.calls).toEqual([
        ['students.math IS NOT NULL'],
      ]);

      expect(studentRepoMock.orderBy.mock.calls).toEqual([['rating', 'DESC']]);

      expect(studentRepoMock.addOrderBy.mock.calls).toEqual([
        ['students.math', 'DESC'],
      ]);
    });
  });

  describe('#getListOfTopStudents', () => {
    let getTopStudentSpy: jest.SpyInstance;

    beforeAll(() => {
      getTopStudentSpy = jest.spyOn(studentRepo, 'createQueryBuilder');
    });

    afterAll(() => {
      getTopStudentSpy.mockRestore();
    });

    test('should correctly return the list of top students', async () => {
      const sortedStudents = [
        {
          id: '1000001',
          math: 8,
          physics: 8,
          chemistry: 8,
        },
        {
          id: '1000002',
          math: 7,
          physics: 6,
          chemistry: 7,
        },
        {
          id: '1000003',
          math: 5,
          physics: 6,
          chemistry: 5,
        },
        {
          id: '1000004',
          math: 2,
          physics: 3,
          chemistry: 3,
        },
      ];
      const studentRepoMock = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValue(sortedStudents),
      };

      getTopStudentSpy.mockReturnValue(studentRepoMock);

      await expect(studentsService.getListOfTopStudents()).resolves.toEqual(
        sortedStudents,
      );

      expect(studentRepoMock.select.mock.calls).toEqual([
        ['students.id', 'id'],
      ]);

      expect(studentRepoMock.addSelect.mock.calls).toEqual([
        ['students.math', 'math'],
        ['students.physics', 'physics'],
        ['students.chemistry', 'chemistry'],
        [
          'students.math + students.physics + students.chemistry',
          'total_score',
        ],
      ]);
    });
  });

  describe('#getStudentById', () => {
    let findStudentByIdSpy: jest.SpyInstance;

    beforeAll(() => {
      findStudentByIdSpy = jest.spyOn(studentRepo, 'findOneOrFail');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should correctly return the students details', async () => {
      findStudentByIdSpy.mockResolvedValue(students[0]);

      await expect(
        studentsService.getStudentById(students[0].id),
      ).resolves.toEqual(students[0]);

      expect(findStudentByIdSpy.mock.calls).toEqual([
        [
          {
            where: {
              id: students[0].id,
            },
            select: [
              'id',
              'math',
              'literature',
              'foreignLanguage',
              'physics',
              'chemistry',
              'biology',
              'history',
              'geography',
              'civicEducation',
              'foreignLanguageCode',
            ],
          },
        ],
      ]);
    });
  });

  describe('#getGradeOfStudentsBySubject', () => {
    let getGradeStudentSpy: jest.SpyInstance;

    beforeAll(() => {
      getGradeStudentSpy = jest.spyOn(studentRepo, 'createQueryBuilder');
    });

    afterAll(() => {
      getGradeStudentSpy.mockRestore();
    });

    test('should correctly return the list of grade students', async () => {
      const sortedStudents = [
        {
          id: '1000001',
          grade: 8,
        },
        {
          id: '1000002',
          grade: 7,
        },
        {
          id: '1000003',
          grade: 5,
        },
        {
          id: '1000004',
          grade: 2,
        },
      ];

      const studentRepoMock = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValue(sortedStudents),
      };

      getGradeStudentSpy.mockReturnValue(studentRepoMock);

      await expect(
        studentsService.getGradeOfStudentsBySubject({
          subject: SubjectEnum.MATH,
        }),
      ).resolves.toEqual({ '2.0': 1, '5.0': 1, '7.0': 1, '8.0': 1 });

      expect(studentRepoMock.select.mock.calls).toEqual([
        ['CAST(students.math AS FLOAT)', 'grade'],
      ]);

      expect(studentRepoMock.orderBy.mock.calls).toEqual([
        ['CAST(students.math AS FLOAT)', 'ASC'],
      ]);
    });
  });
});

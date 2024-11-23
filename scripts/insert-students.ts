import { readExcel } from '../src/utils/read-excel';
import dataSource from '../src/config/ormconfig';
import { StudentEntity } from '../src/students/student.entity';
import { getCurrentDate } from '../src/helpers';

type PartialStudentType = Pick<
    StudentEntity,
    | 'id'
    | 'math'
    | 'literature'
    | 'foreignLanguage'
    | 'physics'
    | 'chemistry'
    | 'biology'
    | 'history'
    | 'geography'
    | 'civicEducation'
    | 'foreignLanguageCode'
    | 'createdAt'
    | 'updatedAt'
>;

export async function insertStudents(filePath, sheetName, dataSource) {
    try {
        let students: PartialStudentType[] = readExcel(
            filePath,
            sheetName,
        ) as PartialStudentType[];

        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }

        const studentsRepo = dataSource.getRepository(StudentEntity);

        for (let i = 0; i <= students.length; i += 5000)
            await studentsRepo.save(
                students.slice(i, i + 5000)
                    .map(({
                        id,
                        math,
                        literature,
                        foreignLanguage,
                        physics,
                        chemistry,
                        biology,
                        history,
                        geography,
                        civicEducation,
                        foreignLanguageCode,
                    }) => ({
                        id: id,
                        math: math ? Number(math) : null,
                        literature: math ? Number(literature) : null,
                        foreignLanguage: foreignLanguage ? Number(foreignLanguage) : null,
                        physics: physics ? Number(physics) : null,
                        chemistry: chemistry ? Number(chemistry) : null,
                        biology: biology ? Number(biology) : null,
                        history: history ? Number(history) : null,
                        geography: geography ? Number(geography) : null,
                        civicEducation: civicEducation ? Number(civicEducation) : null,
                        foreignLanguageCode: foreignLanguageCode ?? null,
                        createdAt: getCurrentDate(),
                        updatedAt: getCurrentDate(),
                    }))
            );

    } catch (error) {
        throw error;
    }
}

if (module.children.length > 0) {
    const [, , filePath, sheetName] = process.argv;
    insertStudents(filePath, sheetName, dataSource);
}
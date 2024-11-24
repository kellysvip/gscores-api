import { DataSource } from 'typeorm';
import { newDb } from 'pg-mem';
import * as path from 'path';
import * as uuid from 'uuid';

import { StudentEntity } from '../../src/students/student.entity';

export async function setupDataSource() {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    implementation: () => '1.1.0',
    name: 'version',
  });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    implementation: () => () => uuid.v4(),
    name: 'uuid_generate_v4',
  });

  const ds: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [path.join(__dirname, '../../src/**/*/*.entity.ts')],
  });
  await ds.initialize();
  await ds.synchronize();

  return ds;
}

export async function clearDataSource(dataSource: DataSource) {
  await dataSource.destroy();
}

export async function initializeTestDb(dataSource: DataSource) {
  await dataSource.getRepository(StudentEntity).save({});
}

export async function initializeDb(dataSource: DataSource, entity, data) {
  await dataSource.getRepository(entity).save(data);
}

import { Module } from '@nestjs/common';

import { StudentsModule } from './students/student.module';
import DatabaseModule from './database.module';

@Module({
  imports: [DatabaseModule, StudentsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }

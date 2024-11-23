import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentEntity } from './student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [],
  providers: [],
})
export class StudentsModule {}

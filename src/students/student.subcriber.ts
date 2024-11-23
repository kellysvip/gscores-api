import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as _ from 'lodash';
import { validate } from 'class-validator';

import { getCurrentDate } from '../helpers';
import { StudentEntity } from './student.entity';

@Injectable()
@EventSubscriber()
export class StudentSubscriber
  implements EntitySubscriberInterface<StudentEntity>
{
  constructor(@InjectConnection() readonly connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return StudentEntity;
  }

  async beforeInsert(event: InsertEvent<StudentEntity>) {
    event.entity.createdAt = event.entity.createdAt || getCurrentDate();
    event.entity.updatedAt = event.entity.updatedAt || getCurrentDate();

    const student = _.merge(new StudentEntity(), event.entity);

    const errors = await validate(student, {
      validationError: { target: false, value: true },
    });

    if (errors.length > 0) {
      throw Error(`Invalid student: ${JSON.stringify(errors)}`);
    }
  }
}

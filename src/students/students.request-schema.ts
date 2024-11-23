import { ApiQueryOptions } from '@nestjs/swagger';

export const getRatingOfStudentsQueries: ApiQueryOptions = {
  name: 'queries',
  schema: {
    type: 'object',
    properties: {
      subject: { type: 'string', example: 'math' },
    },
  },
};

export const getGradeOfStudentsQueries: ApiQueryOptions = {
  name: 'queries',
  schema: {
    type: 'object',
    properties: {
      subject: { type: 'string', example: 'math' },
    },
  },
};

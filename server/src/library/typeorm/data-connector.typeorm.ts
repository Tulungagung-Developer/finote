import { EntityManager } from 'typeorm';
import { DataSource } from '@libs/typeorm/datasource.typeorm';

export const DataConnenctor = async <T>(
  callback: (entityManager: EntityManager) => Promise<T>,
  manager?: EntityManager,
): Promise<T> => {
  if (manager) return callback(manager);
  return DataSource.transaction(async (entityManager) => callback(entityManager));
};

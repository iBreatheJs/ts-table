import {Table} from '../table';

// Table creation:
test('create Table with ', () => {
  expect(new Table()(1, 2)).toBe(3);
});
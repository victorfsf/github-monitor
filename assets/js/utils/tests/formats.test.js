import { formatDate, filterDuplicates } from 'utils';


describe('formatDate', () => {
  test('valid date', () => {
    expect(formatDate('2018-03-23T12:25:23')).toEqual(
      'Mar 23, 2018 at 12:25:23 PM',
    );
  });

  test('invalid date', () => {
    expect(formatDate('test invalid')).toEqual(
      'Invalid date',
    );
  });
});


describe('filterDuplicates', () => {
  test('removes duplicates', () => {
    expect(filterDuplicates([
      { key: 1 }, { key: 2 }, { key: 3 },
      { key: 1 }, { key: 2 }, { key: 3 },
      { key: 1 }, { key: 2 }, { key: 3 },
    ], 'key')).toEqual([
      { key: 1 }, { key: 2 }, { key: 3 },
    ]);
  });
});

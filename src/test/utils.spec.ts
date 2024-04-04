import { extractValueFrom, hasValueChanged } from '../utils';

describe('Utils', () => {
  describe('hasValueChanged(oldValue: any, newValue: any): boolean', () => {
    test.each([
      // Basic cases
      {
        description: 'Empty objects',
        oldValue: {},
        newValue: {},
        expected: false,
      },
      {
        description: 'Objects with the same values',
        oldValue: { a: 1 },
        newValue: { a: 1 },
        expected: false,
      },
      {
        description: 'Objects with different values',
        oldValue: { a: 1 },
        newValue: { a: 2 },
        expected: true,
      },
      // Nested object cases
      {
        description: 'Objects with nested properties',
        oldValue: { a: { b: 1, c: [1, 2, 3], d: true } },
        newValue: { a: { b: 1, c: [1, 2, 3], d: true } },
        expected: false,
      },
      {
        description:
          'Objects with nested properties (changes within nested objects)',
        oldValue: { a: { b: 1 } },
        newValue: { a: { b: 2 } },
        expected: true,
      },
      {
        description: 'Objects with nested properties (mixed properties)',
        oldValue: { a: { b: 1 }, c: 2 },
        newValue: { a: { b: 1 }, c: 2 },
        expected: false,
      },
      // Array cases
      {
        description: 'Empty arrays',
        oldValue: [],
        newValue: [],
        expected: false,
      },
      {
        description: 'Arrays with the same values',
        oldValue: [1, 2, 3],
        newValue: [1, 2, 3],
        expected: false,
      },
      {
        description: 'Arrays with different values',
        oldValue: [1, 2, 3],
        newValue: [1, 2, 4],
        expected: true,
      },
      // Mixed cases
      {
        description: 'Objects with mixed properties',
        oldValue: { a: 1, b: [1, 2], c: { d: 'test' } },
        newValue: { a: 1, b: [1, 2], c: { d: 'test' } },
        expected: false,
      },
      {
        description: 'Objects with mixed properties (changes in one property)',
        oldValue: { a: 1, b: [1, 2], c: { d: 'test' } },
        newValue: { a: 2, b: [1, 2], c: { d: 'test' } },
        expected: true,
      },
      // Edge cases
      {
        description: 'Undefined values',
        oldValue: undefined,
        newValue: undefined,
        expected: false,
      },
      {
        description: 'Null values',
        oldValue: null,
        newValue: null,
        expected: false,
      },
      {
        description: 'Zero values',
        oldValue: 0,
        newValue: 0,
        expected: false,
      },
      {
        description: 'Empty string values',
        oldValue: '',
        newValue: '',
        expected: false,
      },
      // { // TODO
      //     description: "NaN values",
      //     oldValue: NaN,
      //     newValue: NaN,
      //     expected: false
      // },
      {
        description: 'Infinity values',
        oldValue: Infinity,
        newValue: Infinity,
        expected: false,
      },
      {
        description: 'Objects with undefined properties',
        oldValue: { a: undefined },
        newValue: { a: undefined },
        expected: false,
      },
      {
        description: 'Objects with null properties',
        oldValue: { a: null },
        newValue: { a: null },
        expected: false,
      },
      // { // TODO
      //     description: "Objects with NaN properties",
      //     oldValue: { a: NaN },
      //     newValue: { a: NaN },
      //     expected: false
      // },
      {
        description: 'Objects with Infinity properties',
        oldValue: { a: Infinity },
        newValue: { a: Infinity },
        expected: false,
      },
    ])('$description', ({ oldValue, newValue, expected }) => {
      expect(hasValueChanged(oldValue, newValue)).toBe(expected);
    });
  });

  describe('extractValueFrom(key: string, object: Record<string, any>): any', () => {
    test.each([
      {
        description: 'should extract value from key "database.port"',
        key: 'database.port',
        object: { database: { port: 27017 } },
        expected: 27017,
      },
      {
        description: 'should extract value from key "database.user.name"',
        key: 'database.user.name',
        object: { database: { user: { name: 'John' } } },
        expected: 'John',
      },
      {
        description: 'should return null for missing key',
        key: 'missingKey',
        object: { database: { port: 27017 } },
        expected: null,
      },
      {
        description: 'should return null for null object',
        key: 'database.port',
        object: null,
        expected: null,
      },
      {
        description: 'should return null for undefined object',
        key: 'database.port',
        object: undefined,
        expected: null,
      },
      {
        description: 'should return null for empty object',
        key: 'database.port',
        object: {},
        expected: null,
      },
      {
        description: 'should return null for non-existing key',
        key: 'database.port',
        object: { database: { user: { name: 'John' } } },
        expected: null,
      },
    ])('$description', ({ key, object, expected }) => {
      // Arrange & Act
      const result = extractValueFrom(key, object as Record<string, any>);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { createMatcher } from '../src/FuzzyTableMatch.js';
import { createSearchIndex, rankRows, refreshRows } from '../src/FuzzyTableSearch.js';

function search(rows, term, options = {}, excluded = []) {
    return rankRows(rows, createMatcher(term, options), createSearchIndex(new Set(excluded)));
}

test('Jaro–Winkler counts transpositions and only boosts strong shared prefixes', () => {
    for (const [query, text, expected] of [
        ['marhta', 'martha', 0.9611111111111111],
        ['dicksonx', 'dixon', 0.8133333333333334],
        ['duane', 'dwayne', 0.84],
        ['abzz', 'abxx', 2 / 3],
        ['abcd', 'wxyz', 0]
    ]) {
        const matcher = createMatcher(query, { similarityThreshold: 0 });
        assert.ok(Math.abs(matcher.scoreField({ text }) - expected) < 1e-12);
    }
    assert.deepEqual(search([{ name: 'MARTHA' }], 'MARHTA', { similarityThreshold: 0.97 }), []);
});

test('literal matches rank by position and coverage, fuzzy ties retain source order', () => {
    const rows = ['Blue carrot', 'Carxrot', 'Carrot', 'Carrots', 'Carxrot'].map(name => ({ name }));
    assert.deepEqual(search(rows, 'CARROT'), [rows[2], rows[3], rows[0], rows[1], rows[4]]);
    assert.deepEqual(rows.map(row => row.name), ['Blue carrot', 'Carxrot', 'Carrot', 'Carrots', 'Carxrot']);
});

test('zero threshold and zero substring bonus are honored', () => {
    assert.equal(search([{ word: 'abcd' }], 'wxyz', { similarityThreshold: 0 }).length, 1);
    assert.deepEqual(search([{ word: 'x'.repeat(50) + 'ok' }], 'ok', { exactMatchBonus: 0 }), []);
    assert.equal(createMatcher('   '), null);
});

test('searches raw values and hidden fields while honoring explicit exclusions', () => {
    const rows = [{ id: 0, flag: false, tag: null, hidden: 'alias', excluded: 'secret' }];
    for (const term of ['0', 'false', 'alias']) assert.deepEqual(search(rows, term), rows);
    assert.deepEqual(search(rows, 'secret', {}, ['excluded']), []);
});

test('literal ranges preserve case, repeated punctuation, and Unicode offsets', () => {
    assert.deepEqual(createMatcher('a.').ranges('A. [a.]'), [[0, 2], [4, 6]]);
    assert.deepEqual(createMatcher('x').ranges('İ😀X'), [[3, 4]]);
    assert.deepEqual(createMatcher('i').ranges('İ'), [[0, 1]]);
    assert.deepEqual(createMatcher('😀').ranges('a😀😀'), [[1, 3], [3, 5]]);
});

test('fuzzy ranges skip unmatched characters and retain astral characters intact', () => {
    assert.deepEqual(createMatcher('carrot').ranges('red carxrot'), [[4, 7], [8, 11]]);
    assert.deepEqual(createMatcher('abc😀d').ranges('abc😅d'), [[0, 3], [5, 6]]);
    assert.deepEqual(createMatcher('one carrot').ranges('one carxrot'), [[0, 7], [8, 11]]);
    assert.deepEqual(createMatcher('nope').ranges('apple'), []);
});

test('active regular expressions start fresh for every row and every search', () => {
    const data = [{ name: 'apple', group: 'a' }, { name: 'apple', group: 'a' }, { name: 'apple', group: 'b' }];
    const option = { active: true, value: /a/g };
    const context = {
        data, query: 'apple', config: {}, searchIndex: createSearchIndex(new Set()),
        filters: [{ filterColumn: 'group', options: [option] }]
    };
    for (let i = 0; i < 2; i++) {
        refreshRows(context);
        assert.deepEqual(context.table, data.slice(0, 2));
    }
    option.inverse = true;
    refreshRows(context);
    assert.deepEqual(context.table, [data[2]]);
});

test('changing, adding, or removing a row property is reflected by the next search', () => {
    const row = { name: 'apple', list: ['plum'] };
    const index = createSearchIndex(new Set());
    const run = query => rankRows([row], createMatcher(query), index);
    assert.deepEqual(run('apple'), [row]);
    row.name = 'pear';
    row.tag = 'lime';
    row.list[0] = 'peach';
    assert.deepEqual(run('apple'), []);
    assert.deepEqual(run('peach'), [row]);
    assert.deepEqual(run('lime'), [row]);
    delete row.tag;
    assert.deepEqual(run('lime'), []);
});

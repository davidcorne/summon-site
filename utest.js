'use strict'
/* global describe, it */
const rewire = require('rewire')
const chai = require('chai')
const assert = chai.assert

const spellDatahModule = rewire('./spellData.js')

describe('Spell Data', function () {
  const normalSpellLevel = spellDatahModule.__get__('normalSpellLevel')
  it('Normal Spell Level', function () {
    // Heightened (2nd) Level 1.
    // Heightened (3rd) Level 2.
    // Heightened (4th) Level 3.
    // Heightened (5th) Level 5.
    // Heightened (6th) Level 7.
    // Heightened (7th) Level 9.
    // Heightened (8th) Level 11.
    // Heightened (9th) Level 13.
    // Heightened (10th) Level 15
    assert.strictEqual(normalSpellLevel(-1), 1)
    assert.strictEqual(normalSpellLevel(0), 2)
    assert.strictEqual(normalSpellLevel(1), 2)
    assert.strictEqual(normalSpellLevel(2), 3)
    assert.strictEqual(normalSpellLevel(3), 4)
    assert.strictEqual(normalSpellLevel(4), 5)
    assert.strictEqual(normalSpellLevel(5), 5)
    assert.strictEqual(normalSpellLevel(6), 6)
    assert.strictEqual(normalSpellLevel(7), 6)
    assert.strictEqual(normalSpellLevel(8), 7)
    assert.strictEqual(normalSpellLevel(9), 7)
    assert.strictEqual(normalSpellLevel(10), 8)
    assert.strictEqual(normalSpellLevel(11), 8)
    assert.strictEqual(normalSpellLevel(12), 9)
    assert.strictEqual(normalSpellLevel(13), 9)
    assert.strictEqual(normalSpellLevel(14), 10)
    assert.strictEqual(normalSpellLevel(15), 10)
  })
})

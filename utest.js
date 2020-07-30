'use strict'
/* global describe, it */
const rewire = require('rewire')
const chai = require('chai')
const assert = chai.assert
const fs = require('fs')

const monsters = require('./data/summonable_monsters')

const spellDataModule = rewire('./spellData.js')
const instrumentMonstersModule = rewire('./instrumentMonsters.js')
const scrapeModule = rewire('./scrape.js')
const clientModule = rewire('./public/resources/index.js')

describe('Spell Data', function () {
  const normalSpellLevel = spellDataModule.__get__('normalSpellLevel')
  const spellData = spellDataModule.__get__('spellData')
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
  it('Spell Data', function () {
    const summonAnimal = spellData.find((item) => {
      return item.spell === 'Summon Animal'
    })
    assert.strictEqual(summonAnimal.traits.length, 1)
    assert.strictEqual(summonAnimal.traits[0], 'Animal')

    const summonCelestial = spellData.find((item) => {
      return item.spell === 'Summon Celestial'
    })
    assert.strictEqual(summonCelestial.monsterLevelToSpellLevel(1), 5)
  })
})
describe('Instrument Monsters', function () {
  const instrumentMonster = instrumentMonstersModule.__get__('instrumentMonster')
  const instrumentMonsters = instrumentMonstersModule.__get__('instrumentMonsters')
  it('Instrument Monster', function () {
    let unsummonable = instrumentMonster({
      level: 16
    })
    assert.isNull(unsummonable)
    unsummonable = instrumentMonster({
      level: 12,
      traits: ['Humanoid']
    })
    assert.isNull(unsummonable)

    const giant = instrumentMonster({
      level: -1,
      traits: ['Giant']
    })
    assert.strictEqual(giant.summonSpells.length, 1)
    assert.strictEqual(giant.summonSpells[0].spell, 'Summon Giant')
    assert.strictEqual(giant.summonSpells[0].level, 5)
    const animal = instrumentMonster({
      level: -1,
      traits: ['Animal']
    })
    assert.strictEqual(animal.summonSpells.length, 1)
    assert.strictEqual(animal.summonSpells[0].spell, 'Summon Animal')
    assert.strictEqual(animal.summonSpells[0].level, 1)

    const elementalDragon = instrumentMonster({
      level: 12,
      traits: ['Elemental', 'Dragon']
    })
    assert.strictEqual(elementalDragon.summonSpells.length, 2)
    assert.strictEqual(elementalDragon.summonSpells[0].spell, 'Summon Dragon')
    assert.strictEqual(elementalDragon.summonSpells[0].level, 9)
    assert.strictEqual(elementalDragon.summonSpells[1].spell, 'Summon Elemental')
    assert.strictEqual(elementalDragon.summonSpells[1].level, 9)
  })
  it('Instrument Monsters', function () {
    const monsters = [
      {
        level: 5,
        traits: ['Giant']
      },
      {
        level: 16,
        traits: ['Giant']
      },
      {
        level: 12,
        traits: ['Humanoid']
      },
      {
        level: 11,
        traits: ['Fey', 'Animal', 'Plant']
      }
    ]
    const instrumentedMonsters = instrumentMonsters(monsters)
    assert.strictEqual(instrumentedMonsters.length, 2)
  })
})

describe('Scraper', function () {
  const getMonsters = scrapeModule.__get__('getMonsters')
  it('Whole table', function (done) {
    fs.readFile('test_data/Monsters.html', function (error, body) {
      if (error) {
        throw error
      }
      const monsters = getMonsters(body)
      assert.strictEqual(monsters.length, 856)
      done()
    })
  })
})

describe('ClientJS', function () {
  const SummonSite = clientModule.__get__('SummonSite')
  it('Monsters', function () {
    const nulls = []
    for (const monster of monsters) {
      const html = SummonSite.renderCreature(monster)
      if (html.includes(' null ')) {
        nulls.push(monster.name)
      }
    }
    assert.isEmpty(nulls, `The following monsters have nulls: ${nulls}`)
  })
})

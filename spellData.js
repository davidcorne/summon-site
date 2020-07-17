const spellLevelFunction = function (startingSpellLevel, startingMonsterLevel) {
  return function (monsterLevel) {
    if (monsterLevel < startingMonsterLevel) {
      return startingSpellLevel
    }
    if (monsterLevel === -1) {
      return 1
    } else if (monsterLevel <= 1) {
      return 2
    } else if (monsterLevel <= 2) {
      return 3
    } else if (monsterLevel <= 3) {
      return 4
    } else if (monsterLevel <= 5) {
      return 5
    } else if (monsterLevel <= 7) {
      return 6
    } else if (monsterLevel <= 9) {
      return 7
    } else if (monsterLevel <= 11) {
      return 8
    } else if (monsterLevel <= 13) {
      return 9
    } else if (monsterLevel <= 15) {
      return 10
    }
  }
}

const normalSpellLevel = spellLevelFunction(1, -1)

const spellData = [
  {
    spell: 'Summon Animal',
    traits: ['Animal'],
    monsterLevelToSpellLevel: normalSpellLevel
  },
  {
    spell: 'Summon Celestial',
    traits: ['Celestial'],
    monsterLevelToSpellLevel: spellLevelFunction(5, 5)
  },
  {
    spell: 'Summon Construct',
    traits: ['Construct'],
    monsterLevelToSpellLevel: normalSpellLevel
  },
  {
    spell: 'Summon Dragon',
    traits: ['Dragon'],
    monsterLevelToSpellLevel: spellLevelFunction(5, 5)
  },
  {
    spell: 'Summon Elemental',
    traits: ['Elemental'],
    monsterLevelToSpellLevel: spellLevelFunction(2, 1)
  },
  {
    spell: 'Summon Entity',
    traits: ['Aberration'],
    monsterLevelToSpellLevel: spellLevelFunction(5, 5)
  },
  {
    spell: 'Summon Fey',
    traits: ['Fey'],
    monsterLevelToSpellLevel: normalSpellLevel
  },
  {
    spell: 'Summon Fiend',
    traits: ['Fiend'],
    monsterLevelToSpellLevel: spellLevelFunction(5, 5)
  },
  {
    spell: 'Summon Giant',
    traits: ['Giant'],
    monsterLevelToSpellLevel: spellLevelFunction(5, 5)
  },
  {
    spell: 'Summon Plant or Fungus',
    traits: ['Plant', 'Fungus'],
    monsterLevelToSpellLevel: normalSpellLevel
  }
]

const instrumentMonster = function (monster) {
  if (monster.level > 15) {
    // too high level to summon
    return null
  }
}

module.exports.instrumentMonster = instrumentMonster
module.exports.spellData = spellData

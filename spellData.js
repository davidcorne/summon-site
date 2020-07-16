const normalSpellLevel = function (monsterLevel) {
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

const spellData = [
  {
    spell: 'Summon Animal',
    trait: 'Animal',
    monsterLevelToSpellLevel: normalSpellLevel
  }
]

module.exports.spellData = spellData

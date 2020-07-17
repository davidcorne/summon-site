const spellData = require('./spellData')

const instrumentMonster = function (monster) {
  if (monster.level > 15) {
    // too high level to summon
    return null
  }
  // Instrument the monster with an array of spells which can summon it, with their levels.
  monster.summonSpells = []
  for (const spell of spellData.spellData) {
    for (const trait of spell.traits) {
      if (monster.creatureType.includes(trait)) {
        monster.summonSpells.push({
          spell: spell.spell,
          level: spell.monsterLevelToSpellLevel(monster.level)
        })
        continue
      }
    }
  }
  if (monster.summonSpells.length > 0) {
    return monster
  }
  return null
}

module.exports.instrumentMonster = instrumentMonster

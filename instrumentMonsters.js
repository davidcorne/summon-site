'use strict'
const fs = require('fs')
const yaml = require('js-yaml')

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
      for (const monsterTrait of monster.traits) {
        if (monsterTrait === trait) {
          monster.summonSpells.push({
            spell: spell.spell,
            level: spell.monsterLevelToSpellLevel(monster.level)
          })
          continue
        }
      }
    }
  }
  if (monster.summonSpells.length > 0) {
    return monster
  }
  return null
}

const instrumentMonsters = function (monsters) {
  const instrumentedMonsters = []
  for (const monster of monsters) {
    const instrumentedMonster = instrumentMonster(monster)
    if (instrumentedMonster) {
      instrumentedMonsters.push(instrumentedMonster)
    }
  }
  return instrumentedMonsters
}

const addUrlToMonsters = function (monsters) {
  const nethysMonsters = require('./data/all_monsters')
  for (const monster of monsters) {
    const result = nethysMonsters.find(nethysMonster => monster.name === nethysMonster.name)
    if (result) {
      monster.url = result.url
    } else {
      monster.url = ''
      console.error(`Nethys monster not found for ${monster.name}`)
    }
  }
}

/**
 * Function to instrument then write an array of monsters.
 *
 * @param {array of uninstrumented monsters} monsters
 * @param {string} path
 * @param {function (error, number_of_written_monsters} callback
 */
const writeInstrumentedMonsters = function (monsters, path, callback) {
  const instrumentedMonsters = instrumentMonsters(monsters)
  addUrlToMonsters(monsters)
  fs.writeFile(path, JSON.stringify(instrumentedMonsters), function (error) {
    callback(error, instrumentedMonsters.length)
  })
}

/* eslint-disable no-unused-vars */
const instrumentScrapedMonsters = function () {
/* eslint-enable no-unused-vars */
  const monsters = require('./data/all_monsters')
  writeInstrumentedMonsters(monsters, './data/summonable_monsters.json', function (error, numberOfWrittenMonsters) {
    if (error) {
      throw error
    }
    console.log(numberOfWrittenMonsters + ' summonable monsters written')
  })
}

const loadYAMLMonsters = function (callback) {
  fs.readFile('data/monsters.yaml', function (error, contents) {
    if (error) {
      throw error
    }
    const data = yaml.safeLoad(contents)
    callback(data.monsters)
  })
}

const instrumentYAMLMonsters = function () {
  loadYAMLMonsters(monsters => {
    writeInstrumentedMonsters(monsters, './data/summonable_monsters.json', function (error, numberOfWrittenMonsters) {
      if (error) {
        throw error
      }
      console.log(numberOfWrittenMonsters + ' summonable monsters written')
    })
  })
}

module.exports.writeInstrumentedMonsters = writeInstrumentedMonsters

if (require.main === module) {
  instrumentYAMLMonsters()
}

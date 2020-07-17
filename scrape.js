'use strict'
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const BASE_URL = 'https://2e.aonprd.com/'

const summonableMonster = function (monster) {
  // For a monster to be summonable, it must be level <= 15 and have one of the summonable traits
  if (monster.level > 15) {
    // too high level to summon
    return false
  }
  const traits = [
    'Animal',
    'Celestial',
    'Construct',
    'Dragon',
    'Elemental',
    'Aberration',
    'Fey',
    'Fiend',
    'Giant',
    'Plant',
    'Fungus'
  ]
  for (let i = 0; i < traits.length; i++) {
    if (monster.creatureType.includes(traits[i])) {
      return true
    }
  }
  // It's not one of the summonable types
  return false
}

const getMonsters = function (body) {
  const $ = cheerio.load(body)
  const tableRows = $('tr')
  const monsters = []
  for (let i = 1; i < tableRows.length; ++i) {
    const row = tableRows.get(i)
    const monster = {
      name: row.children[1].children[0].children[0].children[0].data,
      url: BASE_URL + row.children[1].children[0].attribs.href,
      family: row.children[2].children[0].data,
      level: parseInt(row.children[3].children[0].data),
      alignment: row.children[4].children[0].data,
      creatureType: row.children[5].children[0].data,
      size: row.children[6].children[0].data
    }
    // Now check that the monster can be summoned
    if (summonableMonster(monster)) {
      monsters.push(monster)
    }
  }
  return monsters
}

const processAllMonsters = function (error, response, body) {
  if (error) {
    throw error
  }
  const monsters = getMonsters(body)
  fs.writeFile('data/monsters.json', JSON.stringify(monsters), function (error) {
    if (error) {
      throw error
    }
    console.log(monsters.length + ' monster stats written.')
  })
}

request(BASE_URL + 'Monsters.aspx?Letter=All', { json: true }, processAllMonsters)

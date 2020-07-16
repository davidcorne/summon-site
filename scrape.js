const request = require('request');
const cheerio = require('cheerio')
const fs = require('fs');

const BASE_URL = 'https://2e.aonprd.com/'

const getMonsters = function (body) {
    const $ = cheerio.load(body)
    const tableRows = $('tr')
    const monsters = []
    for (let i = 1; i < tableRows.length; ++i) {
        const row = tableRows.get(i)
        const monster = {
            'name': row.children[1].children[0].children[0].children[0].children[0].data,
            'url': BASE_URL + row.children[1].children[0].children[0].attribs.href,
            'family': row.children[2].children[0].children[0].data,
            'level': row.children[3].children[0].children[0].data,
            'alignment': row.children[4].children[0].children[0].data,
            'creatureType': row.children[5].children[0].children[0].data,
            'size': row.children[6].children[0].children[0].data,
        }
        monsters.push(monster)
    }
    return monsters
}

const processAllMonsters = function (error, response, body) {
    if (error) {
        throw error
    }
    const monsters = getMonsters(body)
    console.log(monsters)
}

request(BASE_URL + 'Monsters.aspx?Letter=All', { json: true}, processAllMonsters)

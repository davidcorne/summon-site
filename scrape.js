const request = require('request');
const cheerio = require('cheerio')
const fs = require('fs');

const URL = 'https://2e.aonprd.com/Monsters.aspx?Letter=All'

const processAllMonsters = function (error, response, body) {
    if (error) {
        throw error
    }
    const $ = cheerio.load(body)
    const tableRows = $('tr')
    for (let i = 1; i < tableRows.length; ++i) {
        const row = tableRows.get(i)
        console.log(row.children[2].children[0].children[0].data)
        const monster = {
            'name': '',
            'url': '',
            'family': row.children[2].children[0].children[0].data,
            'level': row.children[3].children[0].children[0].data,
            'alignment': row.children[4].children[0].children[0].data,
            'creatureType': row.children[5].children[0].children[0].data,
            'size': row.children[6].children[0].children[0].data,
        }
        console.log(monster)
        break
    }
}

request(URL, { json: true}, processAllMonsters)

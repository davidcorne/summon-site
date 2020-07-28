'use strict'

const monsters = require('./data/summonable_monsters')

if (require.main === module) {
  const master = {}
  for (const monster of monsters) {
    if (monster.sense_abilities) {
      for (const ability of monster.sense_abilities) {
        for (const key in ability) {
          if (ability[key]) {
            master[key] = monster.name
          }
        }
      }
    }
  }
  console.log(master)
  /*
{ name: 'Young White Dragon',
  action_cost: 'Young White Dragon',
  description: 'Young White Dragon',
  raw_description: 'Young White Dragon',
  traits: 'Veiled Master',
  trigger: 'Shadow Drake',
  effect: 'Shadow Drake' }
*/
}

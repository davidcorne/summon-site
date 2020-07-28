'use strict'

const monsters = require('./data/summonable_monsters')

if (require.main === module) {
  const master = {}
  for (const monster of monsters) {
    if (monster.ritual_lists) {
      for (const ability of monster.ritual_lists) {
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
{ name: 'Zuipnyrn',
  action_cost: 'Zuipnyrn',
  description: 'Zuipnyrn',
  raw_description: 'Zuipnyrn',
  traits: 'Zuipnyrn',
  generic_description: 'Young White Dragon',
  critical_success: 'Young White Dragon',
  success: 'Young White Dragon',
  failure: 'Young White Dragon',
  critical_failure: 'Young White Dragon',
  trigger: 'Young White Dragon',
  effect: 'Young White Dragon',
  frequency: 'Soulbound Ruin' }
*/
}

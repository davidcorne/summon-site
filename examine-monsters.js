'use strict'
// This is a YAML example of a monster block.
//
// name: Aapoph Serpentfolk
//   source:
//   - abbr: Bestiary 2
//     page_start: 238
//     page_stop:
//   description: >-
//     Aapophs possess greater strength and stronger venom than their zyss kin, but they lack zyss' intelligence and innate magic. Unlike their selfish superiors, aapophs are communal and group together to hunt, wrestle, and sleep curled together in pits. Though they're looked down upon and insulted by zyss, most aapophs lack the higher brain functions to recognize when they're being insulted, much less plan or execute a rebellion. Aapophs often have unusual physical mutations—horns, vestigial tails, or spines protruding from their scales—yet these variations have little impact on their overall combat prowess— and combat prowess is the measure by which zyss judge them.
//
//
//
//
//     **__Recall Knowledge - Humanoid__ (__Society__)**: DC 20
//   level: 3
//   rarity: Uncommon
//   type: Creature
//   alignment: CE
//   size: Medium
//   traits:
//   - Uncommon
//   - CE
//   - Medium
//   - Humanoid
//   - Mutant
//   - Serpentfolk
//   senses:
//   - Perception +8
//   - darkvision
//   - scent (imprecise) 30 feet
//   languages:
//   - Aklo
//   - Undercommon
//   - telepathy 100 feet
//   skills:
//   - name: 'Acrobatics '
//     bonus: 7
//     misc:
//   - name: 'Athletics '
//     bonus: 11
//     misc:
//   - name: 'Intimidation '
//     bonus: 6
//     misc:
//   perception: 8
//   ability_mods:
//     str_mod: 4
//     dex_mod: 2
//     con_mod: 3
//     int_mod: -3
//     wis_mod: 1
//     cha_mod: -1
//   sense_abilities:
//   items:
//   - scimitar
//   ac: 18
//   ac_special:
//   saves:
//     fort: 10
//     fort_misc:
//     ref: 7
//     ref_misc:
//     will: 6
//     will_misc: +2 status vs. mental
//     misc:
//   hp: 60
//   hp_misc:
//   immunities:
//   resistances:
//   - amount: 5
//     type: poison
//   weaknesses:
//   automatic_abilities:
//   - name: Attack of Opportunity
//     action_cost: Reaction
//     traits:
//     description:
//     raw_description: "**Attack of Opportunity** [Reaction] **Trigger** A creature within your reach uses a manipulate action or a move action, makes a ranged attack, or leaves a square during a move action it's using. **Effect** You lash out at a foe that leaves an opening. Make a melee Strike against the triggering creature. If your attack is a critical hit and the trigger was a manipulate action, you disrupt that action. This Strike doesn't count toward your multiple attack penalty, and your multiple attack penalty doesn't apply to this Strike."
//     generic_description:
//     frequency:
//     trigger: A creature within your reach uses a manipulate action or a move action, makes a ranged attack, or leaves a square during a move action it's using.
//     effect: You lash out at a foe that leaves an opening. Make a melee Strike against the triggering creature. If your attack is a critical hit and the trigger was a manipulate action, you disrupt that action. This Strike doesn't count toward your multiple attack penalty, and your multiple attack penalty doesn't apply to this Strike.
//     requirements:
//     range:
//     effects:
//     critical_success:
//     success:
//     failure:
//     critical_failure:
//     full_description:
//   speed:
//   - amount: 25
//     type: Land
//   melee:
//   - action_cost: One Action
//     name: scimitar
//     to_hit: 11
//     traits:
//     - forceful
//     - sweep
//     damage:
//       formula: 1d6+6
//       type: slashing
//     plus_damage:
//   - action_cost: One Action
//     name: fangs
//     to_hit: 11
//     traits:
//     damage:
//       formula: 1d8+6
//       type: piercing
//     plus_damage:
//     - formula:
//       type: serpentfolk venom
//   - action_cost: One Action
//     name: tail
//     to_hit: 11
//     traits:
//     - agile
//     damage:
//       formula: 1d6+6
//       type: bludgeoning
//     plus_damage:
//     - formula:
//       type: Knockdown
//   ranged:
//   spell_lists:
//   ritual_lists:
//   proactive_abilities:
//   - name: Serpentfolk Venom
//     action_cost: None
//     traits:
//     - poison
//     description: '**Saving Throw** DC 20 Fortitude; **Maximum Duration** 6 rounds; **Stage 1** 1d4 poison damage and __enfeebled 1__ (1 round); **Stage 2** 2d4 poison damage and enfeebled 1 (1 round)'
//     raw_description: '**Serpentfolk Venom** (__poison__) **Saving Throw** DC 20 Fortitude; **Maximum Duration** 6 rounds; **Stage 1** 1d4 poison damage and __enfeebled 1__ (1 round); **Stage 2** 2d4 poison damage and enfeebled 1 (1 round)'
//     generic_description:
//     frequency:
//     trigger:
//     effect:
//     requirements:
//     range:
//     effects:
//     critical_success:
//     success:
//     failure:
//     critical_failure:
//     full_description:
//   - name: Slithering Attack
//     action_cost: One Action
//     traits:
//     description: The aapoph serpentfolk makes one scimitar or fangs Strike and one tail Strike, each targeting a different creature. These attacks both count toward the aapoph's multiple attack penalty, but the penalty doesn't increase until after the aapoph makes both attacks.
//     raw_description: "**Slithering Attack**   The aapoph serpentfolk makes one scimitar or fangs Strike and one tail Strike, each targeting a different creature. These attacks both count toward the aapoph's multiple attack penalty, but the penalty doesn't increase until after the aapoph makes both attacks."
//     generic_description:
//     frequency:
//     trigger:
//     effect:
//     requirements:
//     range:
//     effects:
//     critical_success:
//     success:
//     failure:
//     critical_failure:
//     full_description:
const fs = require('fs')
const yaml = require('js-yaml')

const loadMonsters = function (callback) {
  fs.readFile('data/monsters.yaml', function (error, contents) {
    if (error) {
      throw error
    }
    const data = yaml.safeLoad(contents)
    callback(data)
  })
}

// Allow you to run the worker as a single process if you don't need the cluster.
if (require.main === module) {
  loadMonsters(data => {
    const monsters = data.monsters
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
{
  name: 'Zombie Shambler',
  action_cost: 'Zombie Shambler',
  description: 'Zombie Shambler',
  raw_description: 'Zombie Shambler',
  traits: 'Wraith',
  trigger: 'Shadow Drake',
  effect: 'Shadow Drake',
  generic_description: 'Xotanispawn',
  critical_success: 'Xotanispawn',
  success: 'Xotanispawn',
  failure: 'Xotanispawn',
  critical_failure: 'Xotanispawn'
}
*/
  })
}

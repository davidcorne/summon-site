const SummonSite = {}

SummonSite.levelSelection = function (selectedLevel, displayLowerLevels) {
  if (selectedLevel === 'All Levels') {
    return function (spellLevel) {
      return true
    }
  }
  selectedLevel = parseInt(selectedLevel)
  if (displayLowerLevels) {
    return function (spellLevel) {
      return spellLevel <= selectedLevel
    }
  }
  return function (spellLevel) {
    return spellLevel === selectedLevel
  }
}

SummonSite.filterTable = function () {
  const spellSelector = document.getElementById('spellSelector')
  const selectedSpell = spellSelector.value
  const levelSelector = document.getElementById('levelSelector')
  const lowerLevelsCheck = document.getElementById('upToLevelCheck')

  const levelChecker = SummonSite.levelSelection(levelSelector.value, lowerLevelsCheck.checked)

  const monsterTable = document.getElementById('monsterTable')
  const table = monsterTable.getElementsByTagName('tr')
  // From 1 to keep the headers
  for (let i = 1; i < table.length; ++i) {
    const row = table[i]
    const dataColumns = row.getElementsByClassName('spellColumn')
    let show = false
    // This seems fragile
    if (selectedSpell === 'All Spells') {
      show = true
    }
    for (const spell of dataColumns) {
      if (spell.innerHTML === selectedSpell) {
        show = true
        break
      }
    }
    // Only check the level, if we're already displaying it
    if (show) {
      const spellLevelElement = row.getElementsByClassName('spellLevel')[0]
      const spellLevel = parseInt(spellLevelElement.innerHTML)
      show = levelChecker(spellLevel)
    }
    if (show) {
      row.style.display = ''
    } else {
      row.style.display = 'none'
    }
  }
}

SummonSite.renderSpellGroup = function (group) {
  return `
  <b>${group.level}${group.heightened_level ? ` (${group.heightened_level})` : ''}</b>
  ${group.spells.map(spell =>
    `${spell.name} ${spell.frequency ? `(${spell.frequency})` : ''}`
    )}
  `
}

SummonSite.renderSpellLists = function (spellLists) {
  return `<div>${spellLists.map(list =>
    `<b>${list.name}</b> DC ${list.dc}; ${list.spell_groups.map(SummonSite.renderSpellGroup)}`
    ).join('')}</div>`
}

SummonSite.actionCost = function (actionCost) {
  let url = ''
  if (actionCost === 'Free Action') {
    url = 'free-action'
  } else if (actionCost === 'None') {
    // If it's not an action, just return empty
    return ''
  } else if (actionCost === 'One Action') {
    url = 'one-action'
  } else if (actionCost === 'Two Actions') {
    url = 'two-action'
  } else if (actionCost === 'Three Actions') {
    url = 'three-action'
  } else if (actionCost === 'Reaction') {
    url = 'reaction'
  }
  return `<a>${url}</a>`
}

SummonSite.renderTraits = function (traits) {
  return `${traits ? `(${traits.map(trait =>
    `${trait}`
  )})` : ''}`
}

SummonSite.renderDamage = function (damage, plusDamage) {
  return `<b>Damage</b> ${damage.formula} ${damage.type} 
  ${plusDamage ? `plus ${plusDamage.map(damage =>
    `${damage.formula ? damage.formula : ''} ${damage.type}`
    )}` : ''}`
}

SummonSite.renderAttack = function (type, attack) {
  return `
  <div><b>${type}</b> ${SummonSite.actionCost(attack.action_cost)} ${attack.name} ${attack.to_hit} 
  ${SummonSite.renderTraits(attack.traits)},
  ${attack.damage ? SummonSite.renderDamage(attack.damage, attack.plus_damage) : ''}
  </div>`
}

SummonSite.renderMelee = function (melee) {
  return SummonSite.renderAttack('Melee', melee)
}

SummonSite.renderRanged = function (ranged) {
  return SummonSite.renderAttack('Ranged', ranged)
}

SummonSite.renderSuccessFailure = function (obj) {
  return `<div class="successFailure">
  ${obj.critical_success ? `<div><b>Critical Success</b> ${obj.critical_success}</div>` : ''}
  ${obj.critical_success ? `<div><b>Success</b> ${obj.success}</div>` : ''}
  ${obj.critical_success ? `<div><b>Failure</b> ${obj.failure}</div>` : ''}
  ${obj.critical_success ? `<div><b>Critical Failure</b> ${obj.critical_failure}</div>` : ''}
  </div>
  `
}

SummonSite.renderAbility = function (ability) {
  return `<div><b>${ability.name}</b> ${SummonSite.actionCost(ability.action_cost)}
    ${ability.traits ? SummonSite.renderTraits(ability.traits) : ''}  
    ${ability.description ? ability.description : ''}
    ${ability.frequency ? `<b>Frequency</b> ${ability.frequency};` : ''}
    ${ability.trigger ? `<b>Trigger</b> ${ability.trigger};` : ''}
    ${ability.effect ? `<b>Effect</b> ${ability.effect}` : ''}
    ${ability.generic_description ? `${ability.generic_description}${SummonSite.renderSuccessFailure(ability)}` : ''}
    </div>`
}

SummonSite.renderAbilities = function (senseAbilities) {
  return `${senseAbilities.map(SummonSite.renderAbility).join('')}`
}

SummonSite.showMonster = function (monster) {
  const creature = document.getElementsByClassName('creature')[0]
  creature.innerHTML = `
  <h1 class="creature-name">
    <a>${monster.name}</a>
    <span class="monsterType">${monster.type} ${monster.level}
  </h1>
  <ul class="traits">
    ${monster.traits.map(trait =>
      `<li>${trait}</li>`).join('')}
  </ul>
  <div><b>Source</b>
    ${monster.source.map(source =>
      `<i>${source.abbr} pg. ${source.page_start}</i>`).join('')}
  </div>
  <div><b>Senses</b>
    ${monster.senses.map(sense =>
      ` ${sense}`
    )}
  </div>
  <div><b>Languages</b>
    ${monster.languages ? monster.languages.map(language =>
      ` ${language}`
    ) : ''}
  </div>
  <div><b>Skills</b>
    ${monster.skills.map(skill =>
      ` <u>${skill.name}</u>${skill.bonus}${skill.misc ? ' (' + skill.misc + ')' : ''}`
    )}
  </div>
  <div>
  <b>Str</b>
  ${monster.ability_mods.str_mod}
  <b>Dex</b>
  ${monster.ability_mods.dex_mod}
  <b>Con</b>
  ${monster.ability_mods.con_mod}
  <b>Int</b>
  ${monster.ability_mods.int_mod}
  <b>Wis</b>
  ${monster.ability_mods.wis_mod}
  <b>Cha</b>
  ${monster.ability_mods.cha_mod}
  </div>
  ${monster.sense_abilities ? SummonSite.renderAbilities(monster.sense_abilities) : ''}
  ${monster.items ? `<b>Items</b> 
    ${monster.items.map(item =>
      ` ${item}`
      )}
    `
    : ''}
  <hr>
  <div><b>AC</b>
  ${monster.ac}${monster.ac_special ? ' (' + monster.ac_special.map(ac => `${ac.descr}`) + ')' : ''};
  <b>Fort</b>
  ${monster.saves.fort}${monster.saves.fort_misc ? ' (' + monster.saves.fort_misc + ')' : ''},
  <b>Reflex</b>
  ${monster.saves.ref}${monster.saves.ref_misc ? ' (' + monster.saves.ref_misc + ')' : ''},
  <b>Will</b>
  ${monster.saves.will}${monster.saves.will_misc ? ' (' + monster.saves.will_misc + ')' : ''}${monster.saves.misc ? '; ' + monster.saves.misc : ''}
  </div>
  <div><b>HP</b>
  ${monster.hp}${monster.hp_misc ? ' (' + monster.hp_misc + ')' : ''};
  ${monster.immunities ? `<b>Immunities</b> 
    ${monster.immunities.map(immunity =>
      ` ${immunity}`
      )}
    `
    : ''}
  ${monster.resistances ? `<b>Resistances</b> 
    ${monster.resistances.map(resistance =>
      ` ${resistance.type} ${resistance.amount ? resistance.amount : ''}`
      )}
    `
    : ''}
  ${monster.weaknesses ? `<b>Weaknesses</b> 
    ${monster.weaknesses.map(weakness =>
      ` ${weakness.type} ${weakness.amount ? weakness.amount : ''}`
      )}
    `
    : ''}
  </div>
  ${monster.automatic_abilities ? `${SummonSite.renderAbilities(monster.automatic_abilities)}` : ''}
  <hr>
  <div><b>Speed</b>
  ${monster.speed.map(speed =>
    ` ${speed.type} ${speed.amount ? `${speed.amount} feet` : ''}`
  )}
  </div>
  ${monster.melee ? monster.melee.map(SummonSite.renderMelee).join('') : ''}
  ${monster.ranged ? monster.ranged.map(SummonSite.renderRanged).join('') : ''}
  ${monster.spell_lists ? SummonSite.renderSpellLists(monster.spell_lists) : ''}
  ${monster.ritual_lists ? SummonSite.renderSpellLists(monster.ritual_lists) : ''}
  ${monster.proactive_abilities ? `${SummonSite.renderAbilities(monster.proactive_abilities)}` : ''}
  
  <hr>
  <h3>${monster.name}</h3>
  ${monster.description}
  `
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
  })
}

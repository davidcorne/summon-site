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

SummonSite.renderSpellLevel = function (group) {
  const ordinalFunctor = levelString => {
    const level = parseInt(levelString)
    if (level === -1) {
      return 'Constant'
    } else if (level === 0) {
      return 'Cantrip'
    } else if (level === 1) {
      return '1st'
    } else if (level === 2) {
      return '2nd'
    } else if (level === 3) {
      return '3rd'
    } else {
      return `${level}th`
    }
  }
  return `<b>${ordinalFunctor(group.level)}${group.heightened_level ? ` (${ordinalFunctor(group.heightened_level)})` : ''}</b>`
}

SummonSite.renderSpellGroup = function (group) {
  return `<div class="spellGroup">${SummonSite.renderSpellLevel(group)}
  ${group.spells.map(spell =>
    `${spell.name} ${spell.frequency ? `(${spell.frequency})` : ''}`
    ).join('')}
  </div>`
}

SummonSite.renderSpellLists = function (spellLists) {
  return `<div>${spellLists.map(list =>
    `<b>${list.name}</b> ${list.dc ? `DC ${list.dc};` : ''} ${list.spell_groups.map(SummonSite.renderSpellGroup).join('')}`
    )}</div>`
}

SummonSite.actionCost = function (actionCost) {
  let image = ''
  if (actionCost === 'Free Action') {
    image = 'FreeAction.png'
  } else if (actionCost === 'None') {
    // If it's not an action, just return empty
    return ''
  } else if (actionCost === 'One Action') {
    image = 'OneAction.png'
  } else if (actionCost === 'Two Actions') {
    image = 'TwoActions.png'
  } else if (actionCost === 'Three Actions') {
    image = 'ThreeActions.png'
  } else if (actionCost === 'Reaction') {
    image = 'Reaction.png'
  }
  return `<img class="actionIcon" src="/public/images/${image}"</img>`
}

SummonSite.renderTraits = function (traits) {
  return `${traits ? ` (${traits.map(trait =>
    `${trait}`
  ).join(', ')})` : ''}`
}

SummonSite.renderDamage = function (damage, plusDamage) {
  return `<b>Damage</b> ${damage.formula} ${damage.type ? damage.type : ''} 
  ${plusDamage ? `plus ${plusDamage.map(damage =>
    `${damage.formula ? damage.formula : ''} ${damage.type}`
    )}` : ''}`
}

SummonSite.renderAttackBonus = function (bonus, traits) {
  const bonusNumber = parseInt(bonus)
  const MAP = traits ? traits.includes('agile') ? 4 : 5 : 5// Multiple Attack Penalty
  const signFunctor = bonus => bonus > 0 ? '+' : ''
  const firstAttack = `${signFunctor(bonusNumber)}${bonusNumber}`
  const secondAttack = `${signFunctor(bonusNumber - MAP)}${bonusNumber - MAP}`
  const thirdAttack = `${signFunctor(bonusNumber - (2 * MAP))}${bonusNumber - (2 * MAP)}`
  return `${firstAttack} [${secondAttack}/${thirdAttack}]`
}

SummonSite.renderAttack = function (type, attack) {
  return `
  <div><b>${type}</b> ${SummonSite.actionCost(attack.action_cost)} ${attack.name} ${SummonSite.renderAttackBonus(attack.to_hit, attack.traits)}${SummonSite.renderTraits(attack.traits)},
  ${attack.damage ? SummonSite.renderDamage(attack.damage, attack.plus_damage) : ''}
  </div>`
}

SummonSite.renderSpeed = function (speed) {
  const speedDescriptor = speed.type === 'Land' ? '' : ` ${speed.type}`
  return `${speedDescriptor} ${speed.amount ? `${speed.amount} feet` : ''}`
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

SummonSite.hideMonster = function () {
  const sidebar = document.getElementsByClassName('sidebar')[0]
  sidebar.style.display = 'none'
  const creature = document.getElementsByClassName('creature')[0]
  creature.innerHTML = ''
}

SummonSite.showMonster = function (monster) {
  const sidebar = document.getElementsByClassName('sidebar')[0]
  sidebar.style.display = 'block'
  const creature = document.getElementsByClassName('creature')[0]
  creature.innerHTML = SummonSite.renderCreature(monster)
}

SummonSite.renderCreature = function (monster) {
  return `<h1 class="creatureNameContainer">
    <div class="monsterName"><a ${monster.url ? `href="${monster.url}"` : ''} target="_blank">${monster.name}</a></div>
    <div class="monsterType">${monster.type} ${monster.level}</div>
  </h1>
  <div class="monsterBody">
  <div class="topLine">
    <div class="traits">
      ${monster.traits.map(trait =>
        `<span>${trait}</span>`).join('')}
      <button id="closeButton" onclick='SummonSite.hideMonster()' aria-label="Close ${monster.type} Box">×</button>
    </div>
  </div>
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
  ${monster.speed.map(SummonSite.renderSpeed)}
  </div>
  ${monster.melee ? monster.melee.map(SummonSite.renderMelee).join('') : ''}
  ${monster.ranged ? monster.ranged.map(SummonSite.renderRanged).join('') : ''}
  ${monster.spell_lists ? SummonSite.renderSpellLists(monster.spell_lists) : ''}
  ${monster.ritual_lists ? SummonSite.renderSpellLists(monster.ritual_lists) : ''}
  ${monster.proactive_abilities ? `${SummonSite.renderAbilities(monster.proactive_abilities)}` : ''}
  
  <hr>
  <h3>${monster.name}</h3>
  ${monster.description}
  </div>
  `
}

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
  })
}

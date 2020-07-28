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

SummonSite.showMonster = function (monster) {
  const sidebar = document.getElementsByClassName('sidebar')[0]
  sidebar.innerHTML = `
  <h1 class="creature-name">
    <a>${monster.name}</a>
    <span>Creature ${monster.level}
  </h1>
  <ul class="traits">
    ${monster.traits.map(trait =>
      `<li>${trait}</li>`).join('')}
  </ul>
  <b>Source</b>
    ${monster.source.map(source =>
      `<i>${source.abbr} pg. ${source.page_start}</i>`).join('')}
  <br>
  <b>Senses</b>
    ${monster.senses.map(sense =>
      `${sense}`
    )}
  <br>
  <b>Languages</b>
    ${monster.languages ? monster.languages.map(language =>
      `${language}`
    ) : ''}
  <br>
  <b>Skills</b>
    ${monster.skills.map(skill =>
      `<u>${skill.name}</u>${skill.bonus}${skill.misc ? ' (' + skill.misc + ')' : ''}`
    )}
  <br>
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
  <br>
  <p>Sense Abilities</p>
  <hr>
  <b>AC</b>
  ${monster.ac};
  <b>Fort</b>
  ${monster.saves.fort}
  ${monster.saves.fort_misc ? '(' + monster.saves.fort_misc + ')' : ''}
  ,
  <b>Reflex</b>
  ${monster.saves.ref}
  ${monster.saves.ref_misc ? '(' + monster.saves.ref_misc + ')' : ''}
  ,
  <b>Will</b>
  ${monster.saves.will}
  ${monster.saves.will_misc ? '(' + monster.saves.will_misc + ')' : ''}
  ${monster.saves.misc ? ';' + monster.saves.misc : ''}
  <br>
  <b>HP</b>
  ${monster.hp}${monster.hp_misc ? ' (' + monster.hp_misc + ')' : ''};
  ${monster.immunities ? `<b>Immunities</b> 
    ${monster.immunities.map(immunity =>
      `${immunity}`
      )}
    `
    : ''}
  ${monster.resistances ? `<b>Resistances</b> 
    ${monster.resistances.map(resistance =>
      `${resistance.type} ${resistance.amount}`
      )}
    `
    : ''}
  ${monster.weaknesses ? `<b>Weaknesses</b> 
    ${monster.weaknesses.map(weakness =>
      `${weakness.type} ${weakness.amount}`
      )}
    `
    : ''}
  <p>Automatic Abilities</p>
  <hr>
  <b>Speed</b>
  ${monster.speed.map(speed =>
    `${speed.type} ${speed.amount} feet`
  )}
  <br>
  <p>Melee</p>
  <p>Ranged</p>
  <p>Spell List</p>
  <p>Rituals</p>
  <p>Proactive Abilities</p>
  `
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
  })
}

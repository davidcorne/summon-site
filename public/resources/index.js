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
  sidebar.innerHTML = ''
  const p = document.createElement('p')
  p.innerHTML = monster.name
  sidebar.appendChild(p)
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js')
  })
}

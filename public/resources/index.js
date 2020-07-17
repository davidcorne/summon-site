const SummonSite = {}

SummonSite.filterTable = function () {
  const spellSelector = document.getElementById('spellSelector')
  const selectedSpell = spellSelector.value
  const monsterTable = document.getElementById('monsterTable')
  const table = monsterTable.getElementsByTagName('tr')
  // From 1 to keep the headers
  for (let i = 1; i < table.length; ++i) {
    const row = table[i]
    const dataColumns = row.getElementsByClassName('dataColumn')
    let show = false
    for (const spell of dataColumns) {
      if (spell.innerHTML === selectedSpell) {
        show = true
        break
      }
    }
    if (show) {
      row.style.display = ''
    } else {
      row.style.display = 'none'
    }
  }
}

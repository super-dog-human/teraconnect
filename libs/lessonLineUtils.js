export function createTimeline(materials) {
  const timeline = {}

  Object.keys(materials).forEach(kind => {
    if (!materials[kind]) return

    const kindName = kind === 'speeches' ? kind.slice(0, -2) : kind.slice(0, -1) // 複数形を単数形にする
    materials[kind].forEach(line => {
      const elapsedTime = line.elapsedTime
      if (!timeline[elapsedTime]) {
        timeline[elapsedTime] = {}
      }

      const newLine = { ...line }
      if (timeline[elapsedTime][kindName]) {
        timeline[elapsedTime][kindName].push(newLine)
      } else {
        timeline[elapsedTime][kindName] = [newLine]
      }
    })
  })

  return timeline
}
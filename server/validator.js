function validateLayout(layout) {
  if (!layout || typeof layout !== 'object') {
    throw new Error('Layout is not an object')
  }
  if (!Array.isArray(layout.rootNodes) || layout.rootNodes.length === 0) {
    throw new Error('Missing rootNodes array')
  }
  if (!layout.nodes || typeof layout.nodes !== 'object') {
    throw new Error('Missing nodes object')
  }

  const artboardId = layout.rootNodes[0]
  const artboard = layout.nodes[artboardId]

  if (!artboard) {
    throw new Error('Artboard node not found')
  }
  if (typeof artboard.width !== 'number' || typeof artboard.height !== 'number') {
    throw new Error('Artboard missing width/height')
  }
  if (!Array.isArray(artboard.children)) {
    throw new Error('Artboard missing children array')
  }

  for (const childId of artboard.children) {
    if (!layout.nodes[childId]) {
      throw new Error(`Child node ${childId} missing from nodes`)
    }
  }

  return true
}

function parseAndValidate(rawText) {
  try {
    let clean = rawText.trim()

    // Strip markdown fences
    clean = clean
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    // If there's text before the JSON, extract the first { } block
    if (!clean.startsWith('{')) {
      const match = clean.match(/\{[\s\S]*\}/)
      if (match) {
        clean = match[0]
      } else {
        throw new Error('No JSON object found in response')
      }
    }

    const parsed = JSON.parse(clean)

    if (!parsed.explanation) {
        parsed.explanation = "Done!"
    }

    if (parsed.updatedLayout !== null && parsed.updatedLayout !== undefined) {
      validateLayout(parsed.updatedLayout)
    }

    return parsed

  } catch (err) {
    console.error('Validation error:', err.message)
    console.error('Raw text preview:', rawText.substring(0, 300))
    return {
      updatedLayout: null,
      assistantMessage: `I couldn't apply that change. Please try rephrasing.`
    }
  }
}

module.exports = { parseAndValidate }
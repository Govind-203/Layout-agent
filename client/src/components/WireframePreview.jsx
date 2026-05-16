export function WireframePreview({ layout }) {
  const artboardId = layout.rootNodes[0]
  const artboard = layout.nodes[artboardId]

  if (!artboard) return <div className="text-gray-400 text-sm p-4">No artboard found</div>

  // Fit preview inside a max box — never overflow
  const MAX_WIDTH = 320
  const MAX_HEIGHT = 520

  const scaleByWidth  = MAX_WIDTH  / artboard.width
  const scaleByHeight = MAX_HEIGHT / artboard.height
  const scale = Math.min(scaleByWidth, scaleByHeight)   // ← key fix

  const previewWidth  = artboard.width  * scale
  const previewHeight = artboard.height * scale

  const children = (artboard.children || [])
    .map(id => layout.nodes[id])
    .filter(Boolean)

  function getNodeStyle(node) {
    const base = {
      position: 'absolute',
      left:   node.nx * previewWidth,
      top:    node.ny * previewHeight,
      width:  node.nw * previewWidth,
      height: node.nh * previewHeight,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }

    if (node.type === 'image') {
      return {
        ...base,
        backgroundImage: `url(${node.data?.sourceUrl || ''})`,
        backgroundSize: node.data?.fit === 'cover' ? 'cover' : 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }

    if (node.type === 'shape') {
      const fill = node.style?.visual?.fill?.value || '#F4CF1B'
      const isCircle = node.data?.shapeType === 'circle'
      return {
        ...base,
        background: fill,
        borderRadius: isCircle ? '50%' : '4px',
      }
    }

    if (node.type === 'text') {
      const color = node.style?.visual?.color?.value
      const fontSize = (node.style?.visual?.fontSize || 16) * scale
      const fontWeight = node.style?.visual?.fontWeight || 400
      const fontStyle  = node.style?.visual?.fontStyle  || 'normal'
      return {
        ...base,
        color: (!color || color === '#FFFF') ? '#ffffff' : color,
        fontSize: Math.max(fontSize, 5),
        fontWeight,
        fontStyle,
        fontFamily: 'Arial, sans-serif',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        padding: '1px 2px',
        display: 'flex',
        alignItems: 'flex-start',
        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
        lineHeight: 1.3,
      }
    }

    return base
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Wireframe Preview
        </span>
        <span className="text-xs text-gray-400">
          {artboard.width} × {artboard.height}px
        </span>
      </div>

      {/* Outer wrapper centers the preview and never overflows */}
      <div className="flex justify-center">
        <div
          style={{
            position: 'relative',
            width: previewWidth,
            height: previewHeight,
            background: artboard.data?.backgroundColor || '#e2e8f0',
            border: '2px solid #e2e8f0',
            borderRadius: 8,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {children.map(node => (
            <div key={node.id} style={getNodeStyle(node)} title={node.name}>
              {node.type === 'text' && (
                <span style={{
                  fontSize: Math.max((node.style?.visual?.fontSize || 10) * scale, 5),
                  lineHeight: 1.3,
                  pointerEvents: 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {node.data?.content}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
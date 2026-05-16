export function JsonViewer({ layout }) {
  return (
    <div className="h-full overflow-y-auto bg-gray-900 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Layout JSON
        </span>
        <span className="text-xs text-gray-500">
          {Object.keys(layout.nodes).length} nodes
        </span>
      </div>
      <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
        {JSON.stringify(layout, null, 2)}
      </pre>
    </div>
  )
}
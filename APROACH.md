# Approach

## System prompt design

The system prompt is the core of the agent. It gives Gemini:

1. **The full layout JSON** as context on every request
2. **Explicit semantic roles** — maps node IDs to human roles
   (which ID is the headline, badge, product, etc.)
3. **Exact transformation math** — tells the model how to recompute
   absolute coordinates from normalized values (nx/ny/nw/nh)
4. **Position keywords** — maps "top", "center", "higher" to concrete
   ny values so moves are consistent
5. **Strict output format** — JSON only, no prose outside the object

## JSON transformations

The key insight is the normalized coordinate system. Every node has both
absolute (x/y/width/height) and normalized (nx/ny/nw/nh) values where
normalized is relative to the artboard (0 to 1).

For any canvas resize, the formula is simply:
x = nx * newWidth
y = ny * newHeight
width  = nw * newWidth
height = nh * newHeight

This means the LLM only needs to change the artboard dimensions and
recompute absolute values — normalized values stay the same.

## Safe JSON parsing

LLM output goes through `parseAndValidate()` before touching app state:

1. Strip markdown code fences if present
2. Extract first `{...}` block if there is text around the JSON
3. `JSON.parse()` inside try/catch
4. Structural validation — checks rootNodes, nodes, artboard, children
5. If anything fails, return `null` so the UI keeps the last good layout

Using `responseMimeType: 'application/json'` in the Gemini config
enforces JSON at the API level, which eliminates most parsing failures.

## Conversation context

The last 6 messages are sent with every request as Gemini chat history.
This lets the model resolve references like "it", "make it bigger",
"the same element" without any extra logic on the backend.

## Wireframe preview

The preview uses absolute-positioned divs scaled from nx/ny/nw/nh:
previewX = nx * previewWidth
previewY = ny * previewHeight

Scale is computed as `Math.min(scaleByWidth, scaleByHeight)` so the
preview always fits its container regardless of aspect ratio.
Real images are loaded from Cloudinary URLs in the node data.

## Trade-offs and what I'd improve

| Trade-off | What I'd do with more time |
|---|---|
| Full layout JSON sent every request (large prompt) | Send only changed nodes, use a diff |
| No streaming — waits for full response | Stream the assistant message token by token |
| Wireframe uses divs, not canvas | Use HTML Canvas for pixel-accurate rendering |
| Single model call per instruction | Add tool use so model can call helper functions |
| No undo/redo | Maintain a layout history stack in state |

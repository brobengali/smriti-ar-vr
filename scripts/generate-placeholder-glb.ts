import fs from 'node:fs'
import path from 'node:path'

/**
 * Creates a minimal valid GLB file (a simple textured unit cube/box).
 * This allows <model-viewer> and Three.js GLTFLoader to parse successfully.
 */
function createMinimalGLB(title: string): Buffer {
  const json = {
    asset: { version: '2.0', generator: 'Smriti-AR-Asset-Generator' },
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: title }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0, NORMAL: 1 },
            indices: 2,
            mode: 4,
          },
        ],
        name: title,
      },
    ],
    buffers: [{ byteLength: 504 }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: 288, target: 34962 },
      { buffer: 0, byteOffset: 288, byteLength: 288, target: 34962 },
      { buffer: 0, byteOffset: 576, byteLength: 72, target: 34963 },
    ],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126,
        count: 24,
        type: 'VEC3',
        max: [1, 1, 1],
        min: [-1, -1, -1],
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126,
        count: 24,
        type: 'VEC3',
        max: [1, 1, 1],
        min: [-1, -1, -1],
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5123,
        count: 36,
        type: 'SCALAR',
        max: [23],
        min: [0],
      },
    ],
  }

  const jsonStr = JSON.stringify(json)
  const jsonPadding = (4 - (jsonStr.length % 4)) % 4
  const paddedJsonStr = jsonStr + ' '.repeat(jsonPadding)
  const jsonBuffer = Buffer.from(paddedJsonStr, 'utf-8')

  // Generate binary box data (positions, normals, indices)
  const binaryData = Buffer.alloc(648) // 288 + 288 + 72
  let offset = 0

  // Cube vertices (24 vertices, 8 * 3 per face)
  const positions = [
    // Front
    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    // Back
    -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
    // Top
    -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
    // Bottom
    -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
    // Right
    1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
    // Left
    -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
  ]
  for (const v of positions) {
    binaryData.writeFloatLE(v, offset)
    offset += 4
  }

  // Normals
  const normals = [
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]
  for (const n of normals) {
    binaryData.writeFloatLE(n, offset)
    offset += 4
  }

  // Indices
  for (let f = 0; f < 6; f++) {
    const b = f * 4
    const faceIndices = [b, b + 1, b + 2, b, b + 2, b + 3]
    for (const idx of faceIndices) {
      binaryData.writeUInt16LE(idx, offset)
      offset += 2
    }
  }

  const binaryPadding = (4 - (binaryData.length % 4)) % 4
  const paddedBinaryBuffer = Buffer.concat([binaryData, Buffer.alloc(binaryPadding)])

  // GLB Header: magic (0x46546C67), version (2), total length
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + paddedBinaryBuffer.length
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0) // 'glTF'
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(totalLength, 8)

  // Chunk 0: JSON
  const jsonHeader = Buffer.alloc(8)
  jsonHeader.writeUInt32LE(jsonBuffer.length, 0)
  jsonHeader.writeUInt32LE(0x4e4f534a, 4) // 'JSON'

  // Chunk 1: BIN
  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(paddedBinaryBuffer.length, 0)
  binHeader.writeUInt32LE(0x004e4942, 4) // 'BIN\0'

  return Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, paddedBinaryBuffer])
}

const monuments = ['virupaksha-temple', 'vittala-stone-chariot', 'lotus-mahal']
const publicModelsDir = path.join(process.cwd(), 'public', 'models')
fs.mkdirSync(publicModelsDir, { recursive: true })

for (const id of monuments) {
  const glbBuffer = createMinimalGLB(`Hampi-${id}`)
  // Write to data/monuments/<id>/model.glb
  const dest1 = path.join(process.cwd(), 'data', 'monuments', id, 'model.glb')
  fs.writeFileSync(dest1, glbBuffer)

  // Write to public/models/<id>.glb
  const dest2 = path.join(publicModelsDir, `${id}.glb`)
  fs.writeFileSync(dest2, glbBuffer)

  console.log(`Generated placeholder 3D model for: ${id}`)
}

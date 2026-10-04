import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const rootDir = process.cwd()
const schemasDir = path.join(rootDir, 'schemas')
const monumentsDir = path.join(rootDir, 'data', 'monuments')

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

// Load schemas
const reconstructionSchema = JSON.parse(
  fs.readFileSync(path.join(schemasDir, 'reconstruction.schema.json'), 'utf-8'),
)
const sourceSchema = JSON.parse(
  fs.readFileSync(path.join(schemasDir, 'source.schema.json'), 'utf-8'),
)
const monumentSchema = JSON.parse(
  fs.readFileSync(path.join(schemasDir, 'monument.schema.json'), 'utf-8'),
)

ajv.addSchema(reconstructionSchema, 'reconstruction.schema.json')
ajv.addSchema(sourceSchema, 'source.schema.json')

const validateMonument = ajv.compile(monumentSchema)
const validateSourcesArray = ajv.compile({
  type: 'array',
  items: { $ref: 'source.schema.json' },
})

console.log('🏛️  Smriti AR — Validating Monument & Source Datasets...\n')

let totalMonuments = 0
let failed = 0

if (!fs.existsSync(monumentsDir)) {
  console.error(`❌ Monuments directory not found at: ${monumentsDir}`)
  process.exit(1)
}

const entries = fs.readdirSync(monumentsDir, { withFileTypes: true })

for (const entry of entries) {
  if (!entry.isDirectory()) continue
  totalMonuments++
  const mId = entry.name
  const mDir = path.join(monumentsDir, mId)
  const metaPath = path.join(mDir, 'metadata.yaml')
  const sourcesPath = path.join(mDir, 'sources.yaml')

  let hasError = false
  console.log(`Checking [${mId}]...`)

  // 1. Validate metadata.yaml
  if (!fs.existsSync(metaPath)) {
    console.error(`  ❌ Missing metadata.yaml`)
    failed++
    continue
  }

  try {
    const metaRaw = fs.readFileSync(metaPath, 'utf-8')
    const metaData = YAML.parse(metaRaw)
    const validMeta = validateMonument(metaData)

    if (!validMeta) {
      hasError = true
      console.error(`  ❌ metadata.yaml schema violations:`)
      validateMonument.errors?.forEach((err) => {
        console.error(`     - ${err.instancePath || '/'}: ${err.message}`)
      })
    } else {
      console.log(`  ✓ metadata.yaml passed schema validation`)
    }

    // Check sample scholar review disclaimer
    const desc = metaData.description?.en || ''
    const notes = metaData.reconstruction?.evidence_notes || ''
    if (!desc.includes('needs scholar review') && !notes.includes('needs scholar review')) {
      console.warn(`  ⚠️ Warning: Placeholder text should mention "needs scholar review"`)
    }
  } catch (e) {
    hasError = true
    console.error(`  ❌ Failed to parse metadata.yaml: ${(e as Error).message}`)
  }

  // 2. Validate sources.yaml
  if (!fs.existsSync(sourcesPath)) {
    console.error(`  ❌ Missing sources.yaml`)
    hasError = true
  } else {
    try {
      const srcRaw = fs.readFileSync(sourcesPath, 'utf-8')
      const srcData = YAML.parse(srcRaw)
      const validSrc = validateSourcesArray(srcData)

      if (!validSrc) {
        hasError = true
        console.error(`  ❌ sources.yaml schema violations:`)
        validateSourcesArray.errors?.forEach((err) => {
          console.error(`     - ${err.instancePath || '/'}: ${err.message}`)
        })
      } else {
        console.log(`  ✓ sources.yaml passed schema validation (${(srcData as unknown[]).length} citations)`)
      }
    } catch (e) {
      hasError = true
      console.error(`  ❌ Failed to parse sources.yaml: ${(e as Error).message}`)
    }
  }

  if (hasError) {
    failed++
    console.log(`  ❌ [${mId}] Validation FAILED\n`)
  } else {
    console.log(`  ✅ [${mId}] Validation PASSED\n`)
  }
}

console.log('----------------------------------------------------')
console.log(`Total Monuments Checked: ${totalMonuments}`)
console.log(`Passed: ${totalMonuments - failed} | Failed: ${failed}`)

if (failed > 0) {
  console.error('\n❌ Data validation failed. Please fix schema errors above.')
  process.exit(1)
} else {
  console.log('\n✨ All monument datasets successfully validated against JSON Schemas!')
  process.exit(0)
}

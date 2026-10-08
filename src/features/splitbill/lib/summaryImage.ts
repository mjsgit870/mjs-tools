import { formatIDR } from '@/lib/format'
import type { BillResult } from './calculate'

const WIDTH = 720
const PAD = 40
const SCALE = 2

const BG = '#ffffff'
const TEXT = '#0f172a'
const MUTED = '#64748b'
const BORDER = '#e2e8f0'
const CARD = '#f8fafc'

const FONT = "'Segoe UI', system-ui, -apple-system, sans-serif"

interface TextOptions {
  size?: number
  fill?: string
  weight?: number
  anchor?: 'start' | 'middle' | 'end'
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value
  return `${value.slice(0, Math.max(0, max - 1))}…`
}

function text(
  content: string,
  x: number,
  y: number,
  options: TextOptions = {},
): string {
  const { size = 14, fill = TEXT, weight = 400, anchor = 'start' } = options
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${escapeXml(content)}</text>`
}

function divider(y: number): string {
  return `<line x1="${PAD}" y1="${y}" x2="${WIDTH - PAD}" y2="${y}" stroke="${BORDER}" />`
}

interface SvgSvg {
  markup: string
  height: number
}

function buildSvg(title: string, result: BillResult): SvgSvg {
  const parts: string[] = []
  let y = PAD

  parts.push(text('MJS Tools', PAD, y, { size: 13, fill: MUTED, weight: 700 }))
  y += 38

  const heading = title.trim() ? title.trim() : 'Split Bill'
  parts.push(text(truncate(heading, 40), PAD, y, { size: 28, weight: 700 }))
  y += 26

  const date = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  parts.push(text(date, PAD, y, { size: 13, fill: MUTED }))
  y += 30

  const cardHeight = 104
  parts.push(
    `<rect x="${PAD}" y="${y}" width="${WIDTH - PAD * 2}" height="${cardHeight}" rx="16" fill="${CARD}" stroke="${BORDER}" />`,
  )
  parts.push(
    text('Total tagihan', PAD + 24, y + 36, {
      size: 13,
      fill: MUTED,
      weight: 600,
    }),
  )
  parts.push(
    text(formatIDR(result.grandTotal), PAD + 24, y + 80, {
      size: 34,
      weight: 700,
    }),
  )
  y += cardHeight + 36

  parts.push(text('Rincian per orang', PAD, y, { size: 15, weight: 700 }))
  y += 26
  for (const person of result.people) {
    parts.push(text(truncate(person.name.trim() || 'Tanpa nama', 32), PAD, y, { size: 15 }))
    parts.push(
      text(formatIDR(person.total), WIDTH - PAD, y, {
        size: 15,
        weight: 600,
        anchor: 'end',
      }),
    )
    parts.push(divider(y + 12))
    y += 30
  }
  y += 48

  if (result.settlements.length > 0) {
    parts.push(text('Settlemen', PAD, y, { size: 15, weight: 700 }))
    y += 26
    for (const settlement of result.settlements) {
      const from = settlement.fromName.trim() || 'Tanpa nama'
      const to = settlement.toName.trim() || 'Tanpa nama'
      parts.push(text(truncate(`${from} → ${to}`, 36), PAD, y, { size: 15 }))
      parts.push(
        text(formatIDR(settlement.amount), WIDTH - PAD, y, {
          size: 15,
          weight: 600,
          anchor: 'end',
        }),
      )
      parts.push(divider(y + 12))
      y += 30
    }
    y += 48
  }

  y += 12
  parts.push(divider(y))
  y += 26
  parts.push(
    text('Dibuat dengan MJS Tools', PAD, y, { size: 12, fill: MUTED }),
  )

  const height = y + PAD

  const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}"><rect width="${WIDTH}" height="${height}" fill="${BG}" />${parts.join('')}</svg>`

  return { markup, height }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Gagal memuat gambar'))
    image.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Gagal membuat gambar'))
    }, 'image/png')
  })
}

export async function buildSummaryImage(
  title: string,
  result: BillResult,
): Promise<Blob> {
  const { markup, height } = buildSvg(title, result)
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  const image = await loadImage(url)

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH * SCALE
  canvas.height = height * SCALE
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas tidak didukung')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return canvasToBlob(canvas)
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export type ShareResult = 'shared' | 'downloaded' | 'cancelled'

export async function shareSummaryImage(
  blob: Blob,
  title: string,
): Promise<ShareResult> {
  const filename = `${slugify(title) || 'split-bill'}.png`

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function'
  ) {
    const file = new File([blob], filename, { type: 'image/png' })
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: title || 'Split Bill' })
        return 'shared'
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'cancelled'
        }
      }
    }
  }

  downloadBlob(blob, filename)
  return 'downloaded'
}

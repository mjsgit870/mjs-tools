import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { SplitBillPage } from './SplitBillPage'

describe('SplitBillPage', () => {
  it('render tanpa error', () => {
    const html = renderToString(<SplitBillPage />)
    expect(html).toContain('Split Bill')
    expect(html).toContain('Peserta')
    expect(html).toContain('Ringkasan')
  })
})

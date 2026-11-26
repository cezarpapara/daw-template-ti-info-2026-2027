// Node >= 20. API real; creeaza numai produse/recenzii temporare proprii.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const base = process.env.DAW_API_URL || 'http://localhost:8080'
const marker = `QA-${randomUUID()}`
const ownedProducts = new Map()
const ownedReviews = new Set()
let checks = 0
async function call(path, method = 'GET', body, status = 200) {
  const response = await fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  })
  const raw = await response.text()
  assert.equal(response.status, status, `${method} ${path}: ${raw.slice(0, 300)}`)
  checks++
  if (status === 204) { assert.equal(raw, ''); return null }
  assert.match(response.headers.get('content-type') || '', /application\/json/)
  return JSON.parse(raw)
}
async function product(suffix, categoryId) {
  const name = `${marker}-${suffix}`
  const data = await call('/api/products', 'POST', { name, price: '12.34', categoryId }, 201)
  assert.ok(Number.isInteger(data.id) && data.id > 0)
  ownedProducts.set(data.id, name)
  return data.id
}
async function review(data) {
  const created = await call('/api/reviews', 'POST', data, 201)
  assert.ok(Number.isInteger(created.id) && created.id > 0)
  ownedReviews.add(created.id)
  return created
}
let failure
try {
  assert.equal((await call('/api/health')).database, 'conectata')
  assert.equal((await call('/api/hello/Alexandru')).message, 'Salut, Alexandru!')
  await call('/api/hello/Alex2', 'GET', undefined, 404)
  await call('/api/hello/Alex', 'POST', {}, 405)
  const time = await call('/api/time')
  assert.match(time.date, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(time.timezone)
  assert.deepEqual(await call('/api/numbers?n=6'), { n: 6, numbers: [2, 4, 6], sum: 12, squares: [4, 16, 36] })
  assert.deepEqual((await call('/api/numbers?n=1')).numbers, [])
  assert.equal((await call('/api/numbers')).n, 5)
  for (const n of ['0', '101', 'abc', '1.5', '-1']) await call(`/api/numbers?n=${n}`, 'GET', undefined, 400)
  await call('/api/numbers?n[]=2', 'GET', undefined, 400)
  assert.equal((await call('/api/sum?a=-2&b=7')).sum, 5)
  for (const query of ['a=2', 'a=1.1&b=2', 'a[]=3&b=1']) await call(`/api/sum?${query}`, 'GET', undefined, 400)
  const categories = await call('/api/categories')
  assert.ok(categories.length > 0)
  const first = await product('first', categories[0].id)
  const second = await product('second', categories[0].id)
  assert.deepEqual(await call(`/api/products/${first}/rating`), { productId: first, count: 0, average: null })
  assert.deepEqual(await call(`/api/products/${first}/reviews`), [])
  const payload = { author: marker, rating: 5, comment: '<img src=x onerror=alert(1)>', productId: first }
  const created = await review(payload)
  assert.equal(created.comment, payload.comment)
  assert.equal(created.productId, first)
  assert.match(created.createdAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  assert.equal((await call(`/api/reviews/${created.id}`)).author, marker)
  await review({ ...payload, rating: 2, comment: null })
  assert.deepEqual(await call(`/api/products/${first}/rating`), { productId: first, count: 2, average: 3.5 })
  assert.equal((await call(`/api/products/${first}/reviews`)).length, 2)
  for (const [change, field] of [
    [{ author: '' }, 'author'], [{ author: 'A' }, 'author'], [{ author: 'A'.repeat(101) }, 'author'],
    [{ rating: '4' }, 'rating'], [{ rating: 1.5 }, 'rating'], [{ rating: 0 }, 'rating'], [{ rating: 6 }, 'rating'],
    [{ comment: 'x'.repeat(1001) }, 'comment'], [{ comment: [] }, 'comment'],
    [{ productId: 2147483647 }, 'product'], [{ productId: '1' }, 'product'],
  ]) {
    const invalid = await call('/api/reviews', 'POST', { ...payload, ...change }, 400)
    assert.ok(invalid.errors[field], `Expected ${field} error`)
  }
  for (const bad of ['{', '[]', 'null', '"text"', '']) {
    assert.ok((await call('/api/reviews', 'POST', bad, 400)).errors.body)
  }
  await call(`/api/reviews/${created.id}`, 'PUT', { ...payload, rating: 8 }, 400)
  assert.equal((await call(`/api/reviews/${created.id}`)).rating, 5, 'Invalid update must not persist')
  const updated = await call(`/api/reviews/${created.id}`, 'PUT', { ...payload, rating: 4, productId: second, comment: '' })
  assert.equal(updated.createdAt, created.createdAt)
  assert.equal(updated.productId, second)
  assert.equal(updated.comment, null)
  assert.equal((await call(`/api/products/${first}/reviews`)).length, 1)
  await call('/api/reviews/abc', 'GET', undefined, 404)
  await call('/api/reviews/999999999999999999999', 'GET', undefined, 404)
  await call('/api/reviews/2147483647', 'PUT', payload, 404)
  await call('/api/products/2147483647/reviews', 'GET', undefined, 404)
  await call(`/api/reviews/${created.id}`, 'DELETE', undefined, 204)
  ownedReviews.delete(created.id)
  await call(`/api/reviews/${created.id}`, 'GET', undefined, 404)
  const cascade = await review({ ...payload, productId: second })
  await call(`/api/products/${second}`, 'DELETE', undefined, 204)
  ownedProducts.delete(second)
  await call(`/api/reviews/${cascade.id}`, 'GET', undefined, 404)
  ownedReviews.delete(cascade.id)
  console.log(`PASS: ${checks} HTTP checks; validation, CRUD, averages and cascade verified.`)
} catch (error) {
  failure = error
} finally {
  for (const id of ownedReviews) {
    try {
      const row = await call(`/api/reviews/${id}`)
      assert.equal(row.author, marker, 'Cleanup refused: unrelated review')
      await call(`/api/reviews/${id}`, 'DELETE', undefined, 204)
    } catch (error) { failure ||= error; console.error(`Cleanup review ${id}: ${error.message}`) }
  }
  for (const [id, name] of ownedProducts) {
    try {
      assert.equal((await call(`/api/products/${id}`)).name, name, 'Cleanup refused: unrelated product')
      await call(`/api/products/${id}`, 'DELETE', undefined, 204)
    } catch (error) { failure ||= error; console.error(`Cleanup product ${id}: ${error.message}`) }
  }
}
if (failure) { console.error(failure); process.exitCode = 1 }
else console.log('PASS: temporary test records cleaned up; existing data retained.')

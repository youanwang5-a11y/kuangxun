import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EXAMPLE_QUERY, decideClaim, findListings, getSearchIntent, imageSuggestion, matchListings,
  publishListing, requestClaim, seedState, sendMessage, validateImageFiles, validateListing,
} from '../public/domain.js';
import { openStore } from '../public/storage.js';

const now = new Date(2026, 10, 23, 20);
const nameList = posts => posts.map(post => post.id);
const draft = {
  type: 'found', name: ' 水杯 ', category: 'daily', place: 'library',
  time: '2026-11-23T12:00', description: ' 杯盖有贴纸 ', images: [],
};

test('the home example finds only the phone picked up in the library last night', () => {
  const { listings } = seedState(now);
  const intent = getSearchIntent(EXAMPLE_QUERY);
  assert.deepEqual(intent, {
    category: 'electronics', place: 'library', time: 'yesterday',
    night: true, term: '手机', type: 'found', fallback: '',
  });
  assert.deepEqual(nameList(findListings(listings, intent, now)), ['green-phone']);
});

test('keyword, campus location, type, category and time combine', () => {
  const { listings } = seedState(now);
  const filters = { keyword: '折叠伞', type: 'found', place: 'classroom', category: 'daily', time: 'last7' };
  assert.deepEqual(nameList(findListings(listings, filters, now)), ['black-umbrella']);
  assert.deepEqual(findListings(listings, { ...filters, place: 'library' }, now), []);
  assert.deepEqual(findListings(listings, { ...filters, time: 'yesterday' }, now), []);
  assert.equal(findListings(listings, { keyword: '图书馆' }, now).length, 3);
});

test('the candidate must have the opposite type, nearby time and the same category and place', () => {
  const state = seedState(now);
  const post = state.listings.find(item => item.id === 'green-phone');
  const candidate = state.listings.find(item => item.id === 'lost-phone');
  assert.deepEqual(nameList(matchListings(post, state)), ['lost-phone']);
  candidate.time = new Date(2026, 10, 11, 23).toISOString();
  assert.deepEqual(matchListings(post, state), []);
});

test('publishing validates required fields and picture constraints', () => {
  assert.throws(() => validateListing({ ...draft, name: ' ' }), /物品名称/);
  assert.throws(() => validateListing({ ...draft, time: 'bad' }), /时间/);
  assert.throws(() => validateListing({ ...draft, place: '' }), /地点/);
  assert.throws(() => validateImageFiles([new Blob(['<svg/>'], { type: 'image/svg+xml' })]), /图片/);
  assert.throws(() => validateImageFiles([new Blob(['png'], { type: 'image/png' })], 6), /最多/);
  assert.equal(validateListing(draft).name, '水杯');
  assert.equal(imageSuggestion({ name: 'phone.jpg' }).name, '绿色手机');
  assert.equal(imageSuggestion({ name: 'untitled.jpg' }).name, '待确认物品');
});

test('an officer publication consumes the queue entry only after successful validation', () => {
  const state = seedState(now);
  const intake = { ...draft, queueId: 'intake-card' };
  assert.throws(() => publishListing(state, intake, 'student', 'new', now), /权限/);
  assert.throws(() => publishListing(state, { ...intake, name: '' }, 'officer', 'new', now), /物品名称/);
  assert.equal(state.queue.length, 2);
  publishListing(state, intake, 'officer', 'new', now);
  assert.equal(state.listings[0].name, '水杯');
  assert.equal(state.listings[0].authorId, 'officer');
  assert.equal(state.queue.some(item => item.id === intake.queueId), false);
  assert.throws(() => publishListing(state, intake, 'officer', 'retry', now), /已处理/);
});

test('a claim belongs to the applicant and only the publisher can resolve it once', () => {
  const state = seedState(now);
  const request = { id: 'application', listingId: 'green-phone', claimantId: 'student', text: ' 绿色壳 ' };
  requestClaim(state, request, now);
  assert.equal(state.claims[0].status, 'pending');
  assert.throws(() => requestClaim(state, { ...request, id: 'duplicate' }, now), /已申请/);
  const decision = { claimId: request.id, authorId: 'officer', status: 'approved' };
  assert.throws(() => decideClaim(state, { ...decision, authorId: 'student' }, now), /发布者/);
  decideClaim(state, decision, now);
  assert.equal(state.claims[0].status, 'approved');
  assert.equal(state.listings.find(post => post.id === request.listingId).claimed, true);
  assert.throws(() => decideClaim(state, decision, now), /已经处理/);
});

test('demo messages can be saved and replied to between the publisher and another user', () => {
  const state = seedState(now);
  const message = { listingId: 'green-phone', senderId: 'student', recipientId: 'officer', text: ' 我的手机 ', id: 'message-1' };
  sendMessage(state, message, now);
  sendMessage(state, { ...message, senderId: 'officer', recipientId: 'student', text: '收到', id: 'message-2' }, now);
  assert.deepEqual(state.messages.slice(0, 2).map(entry => entry.text), ['收到', '我的手机']);
  assert.throws(() => sendMessage(state, { ...message, recipientId: 'student' }, now), /收件人/);
});

test('storage reports write failure and preserves stored data for a retry', async () => {
  let record = { items: ['saved'] };
  let failWrite = true;
  const fakeDatabase = {
    transaction() {
      const request = { result: structuredClone(record) };
      const transaction = {
        error: null,
        objectStore: () => ({
          get() {
            queueMicrotask(() => {
              request.onsuccess();
              if (!transaction.error) transaction.oncomplete();
            });
            return request;
          },
          put(next) {
            if (failWrite) {
              transaction.error = new Error('QuotaExceededError');
              queueMicrotask(() => transaction.onabort());
            } else {
              record = structuredClone(next);
            }
          },
        }),
      };
      return transaction;
    },
  };
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
  Object.defineProperty(globalThis, 'indexedDB', { configurable: true, value: {
    open() {
      const request = { result: fakeDatabase };
      queueMicrotask(() => request.onsuccess());
      return request;
    },
  } });

  try {
    const store = await openStore(() => ({ items: [] }));
    const save = data => data.items.push('draft');
    await assert.rejects(store.change(save), /未能保存/);
    assert.deepEqual((await store.change()).items, ['saved']);
    failWrite = false;
    assert.deepEqual((await store.change(save)).items, ['saved', 'draft']);
    assert.deepEqual((await store.change()).items, ['saved', 'draft']);
  } finally {
    if (previous) Object.defineProperty(globalThis, 'indexedDB', previous);
    else delete globalThis.indexedDB;
  }
});

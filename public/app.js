import {
  CATEGORIES, EXAMPLE_QUERY, PEOPLE, PLACES, TIMES, TYPES, decideClaim, getSearchIntent, imageSuggestion,
  matchListings, publishListing, requestClaim, seedState, sendMessage, validateImageFiles, validateListing,
} from './domain.js';
import { openStore } from './storage.js';
import {
  composeForm, dialogFrame, escapeHTML, matchDialog, plazaLink, publishPreview, renderApp,
} from './ui.js';

const app = document.querySelector('#app');
const dialog = document.querySelector('#action-dialog');
const toast = document.querySelector('#toast');
const objectURLs = new Map();
const subsections = ['posts', 'messages', 'claims', 'workbench'];
const filterOptions = { type: TYPES, category: CATEGORIES, place: PLACES, time: TIMES };
const draftFields = ['type', 'name', 'category', 'place', 'time', 'description'];
let userId = 'student';
try {
  const rememberedUser = sessionStorage.getItem('kuangxun-demo-role');
  if (Object.hasOwn(PEOPLE, rememberedUser)) userId = rememberedUser;
} catch {
  // The identity still works in memory when browser session storage is unavailable.
}

let store;
let state;
let route;
let draft = emptyDraft();
let gallery = 0;
let storageWarning = '';
let saving = false;
let timer;
let dialogContext;
let nextFocus;

function emptyDraft() {
  return { type: 'lost', name: '', category: '', place: '', time: '', description: '', images: [], queueId: '', suggestion: false };
}

function localInputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function readRoute() {
  const [path, queryString] = location.hash.slice(1).split('?');
  const params = new URLSearchParams(queryString);
  const [, segment, id] = path.split('/');
  if (segment === 'plaza') {
    const query = (params.get('query') || '').trim().slice(0, 120);
    const intent = getSearchIntent(query);
    const filters = { ...intent, keyword: (params.get('keyword') || '').trim().slice(0, 120) };
    for (const [name, values] of Object.entries(filterOptions)) {
      const value = params.get(name);
      if (value !== null) filters[name] = Object.hasOwn(values, value) ? value : '';
    }
    filters.night = intent.night && filters.time === intent.time;
    return { page: 'plaza', params, query, filters };
  }
  if (segment === 'publish') return { page: 'publish', params };
  if (segment === 'items') return { page: 'details', id };
  if (segment === 'me') return { page: 'me', subsection: subsections.includes(id) ? id : 'posts' };
  return { page: 'home' };
}

function media(blob) {
  if (!objectURLs.has(blob)) objectURLs.set(blob, URL.createObjectURL(blob));
  return objectURLs.get(blob);
}

function releaseUnusedMedia() {
  const visible = new Set([...document.images].map(image => image.src));
  for (const [blob, url] of objectURLs) {
    if (!visible.has(url)) {
      URL.revokeObjectURL(url);
      objectURLs.delete(blob);
    }
  }
}

function render(focusSelector) {
  app.innerHTML = renderApp({ state, route, userId, draft, gallery, media, storageWarning });
  releaseUnusedMedia();
  const focus = focusSelector && app.querySelector(focusSelector);
  if (focus) {
    if (focus.matches('h1, h2')) focus.tabIndex = -1;
    focus.focus({ preventScroll: true });
  }
}

function setRoute(initial = false) {
  const previous = route;
  route = readRoute();
  if (route.page === 'details' && previous?.id !== route.id) gallery = 0;
  if (route.page === 'publish') {
    const queueId = route.params.get('queue') || '';
    const requested = route.params.get('type');
    const entry = userId === 'officer' && state.queue.find(item => item.id === queueId);
    if (entry && draft.queueId !== queueId) {
      draft = { ...emptyDraft(), type: 'found', queueId, name: entry.name, category: entry.category || '',
        place: entry.place || '', time: localInputDate(entry.time), images: [...entry.images],
        description: entry.description || '', suggestion: Boolean(entry.suggested) };
    } else if (!entry) {
      if (draft.queueId) draft = emptyDraft();
      if (Object.hasOwn(TYPES, requested)) draft.type = requested;
      if (queueId) notify('这条待办已处理，或当前身份不能整理。');
    }
  }
  if (dialog.open) closeDialog();
  const focusSelector = nextFocus;
  nextFocus = undefined;
  render(focusSelector);
  if (initial || focusSelector) return;
  window.scrollTo(0, 0);
  const heading = app.querySelector('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll: true });
}

function navigate(href, focusSelector) {
  if (location.hash === href) {
    if (focusSelector) app.querySelector(focusSelector)?.focus();
    return;
  }
  nextFocus = focusSelector;
  location.hash = href;
}

function notify(text) {
  clearTimeout(timer);
  toast.textContent = text;
  toast.hidden = false;
  timer = setTimeout(() => { toast.hidden = true; }, 4200);
}

function showError(form, message) {
  const output = form.querySelector('.form-error');
  if (output) {
    output.hidden = false;
    output.textContent = message;
  } else {
    notify(message);
  }
}

function openDialog(title, markup, context) {
  dialogContext = context;
  dialog.innerHTML = dialogFrame(title, markup);
  if (!dialog.open) dialog.showModal();
}

function closeDialog() {
  dialog.close();
  dialog.innerHTML = '';
  dialogContext = undefined;
  releaseUnusedMedia();
}

async function changeState(update, trigger, onSave, onError = notify) {
  if (saving) return;
  if (!store) {
    onError('浏览器存储不可用。请启用本地存储后重试，当前输入仍可编辑。');
    return;
  }
  saving = true;
  if (trigger) trigger.disabled = true;
  try {
    state = await store.change(update);
    onSave();
  } catch (error) {
    onError(error.message);
  } finally {
    if (trigger) trigger.disabled = false;
    saving = false;
  }
}

function search(query) {
  const value = query.trim();
  if (value) navigate(plazaLink(new URLSearchParams({ query: value })));
  else notify('请输入想查找的物品或地点。');
}

function updateFilters(values, selector) {
  const next = new URLSearchParams(route.params);
  for (const [name, value] of values) next.set(name, value.trim());
  navigate(plazaLink(next), selector);
}

function syncDraft(form) {
  const data = new FormData(form);
  for (const key of draftFields) draft[key] = data.get(key) ?? '';
}

const currentPost = () => state.listings.find(post => post.id === route.id);

function compose(kind, post, recipientId) {
  const label = kind === 'claim' ? '申请认领' : '联系发布者 · 演示留言';
  openDialog(label, composeForm(kind, PEOPLE[recipientId].name), { post, recipientId });
}

function openForwardDialog() {
  const latest = state.listings.find(post => post.authorId === userId);
  const text = latest
    ? `【矿寻 · ${TYPES[latest.type]}】${latest.name}\n地点：${PLACES[latest.place].label}\n请在矿寻广场查看或联系发布者。`
    : '【矿寻】欢迎在校园失物招领广场查找物品或发布信息。';
  openDialog('转发信息', `<p class="muted">复制这段演示文案，再粘贴到你选择的渠道。</p>
    <label class="field"><span>转发文案</span><textarea id="forward-copy" rows="4" readonly>${escapeHTML(text)}</textarea></label>
    <div class="button-row dialog-buttons"><button class="button primary" type="button" data-action="copy-forward">复制文案</button></div>`);
}

async function copyForward() {
  const field = dialog.querySelector('#forward-copy');
  field.focus();
  field.select();
  try {
    await navigator.clipboard.writeText(field.value);
    notify('已复制转发文案。');
    closeDialog();
  } catch {
    notify('文案已选中，请使用系统复制。');
  }
}

app.addEventListener('input', event => {
  const form = event.target.form;
  if (form?.dataset.form === 'publish') syncDraft(form);
});

app.addEventListener('change', async event => {
  const control = event.target;
  if (control.id === 'demo-role') {
    const selected = control.value;
    if (!Object.hasOwn(PEOPLE, selected) || saving) return;
    userId = selected;
    try { sessionStorage.setItem('kuangxun-demo-role', userId); } catch { /* In-memory selection still works. */ }
    if (route.subsection === 'workbench' && userId !== 'officer') navigate('#/me', '#demo-role');
    else render('#demo-role');
    notify(`已切换为${PEOPLE[userId].role}演示身份。`);
    return;
  }
  if (control.form?.dataset.form === 'filters') {
    updateFilters([[control.name, control.value]], `[data-form="filters"] [name="${control.name}"]`);
    return;
  }
  if (control.name === 'type' && control.form?.dataset.form === 'publish') {
    syncDraft(control.form);
    render(`[name="type"][value="${draft.type}"]`);
    return;
  }
  if (!['listing-images', 'intake-images'].includes(control.id) || !control.files.length) return;
  const files = [...control.files];
  control.value = '';
  try {
    validateImageFiles(files, control.id === 'listing-images' ? draft.images.length : 0);
    if (control.id === 'listing-images') {
      draft.images.push(...files);
      render('[data-action="pick-files"], [data-action="remove-photo"]');
      notify(`已加入 ${files.length} 张图片。`);
    } else if (userId === 'officer') {
      const ready = files.map(file => ({
        id: crypto.randomUUID(), name: '待整理物品', category: '', place: '',
        images: [file], time: new Date().toISOString(),
      }));
      await changeState(data => data.queue.unshift(...ready), null, () => {
        render('[data-action="pick-intake"]');
        notify(`已接收 ${ready.length} 条待办。`);
      });
    }
  } catch (error) {
    notify(error.message);
  }
});

app.addEventListener('submit', event => {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  if (form.dataset.form === 'ai-search') search(data.get('query'));
  if (form.dataset.form === 'keyword') updateFilters([['keyword', data.get('keyword')]], '#keyword');
  if (form.dataset.form === 'filters') updateFilters(data, '[data-form="filters"] select');
  if (form.dataset.form === 'publish') {
    syncDraft(form);
    try {
      const listing = validateListing(draft);
      openDialog('发布预览', publishPreview(listing, media), { listing: { ...listing, queueId: draft.queueId } });
    } catch (error) {
      showError(form, error.message);
    }
  }
});

const actions = {
  skip: () => app.querySelector('main').focus(),
  'search-example': () => search(EXAMPLE_QUERY),
  'pick-files': () => app.querySelector('#listing-images').click(),
  'pick-intake': () => app.querySelector('#intake-images').click(),
  'remove-photo': button => {
    draft.images.splice(Number(button.dataset.index), 1);
    render('[data-action="pick-files"]');
  },
  suggest: () => {
    if (!draft.images.length) {
      notify('请先添加至少一张物品图片。');
      return;
    }
    const suggestion = imageSuggestion(draft.images[0]);
    for (const [key, value] of Object.entries(suggestion)) {
      if (!draft[key].trim()) draft[key] = value;
    }
    draft.suggestion = true;
    render('[data-action="suggest"]');
    notify('已补充空白字段，可编辑模拟建议。');
  },
  gallery: button => {
    gallery = Number(button.dataset.index);
    render(`[data-action="gallery"][data-index="${gallery}"]`);
  },
  contact: () => compose('message', currentPost(), currentPost().authorId),
  claim: () => compose('claim', currentPost(), currentPost().authorId),
  matches: () => openDialog('可能匹配的信息', matchDialog(matchListings(currentPost(), state), media)),
  reply: button => {
    const entry = state.messages.find(message => message.id === button.dataset.id);
    const recipientId = entry.senderId === userId ? entry.recipientId : entry.senderId;
    compose('message', state.listings.find(post => post.id === entry.listingId), recipientId);
  },
  decide: button => {
    const { id, status } = button.dataset;
    const approved = status === 'approved';
    openDialog(approved ? '通过认领申请' : '驳回认领申请', `<p class="muted">${approved ? '确认后，物品将显示为已认领。' : '确认后，申请人可在个人中心查看结果。'}</p>
      <form data-form="decide"><p class="form-error" role="alert" hidden></p><div class="button-row dialog-buttons">
      <button class="button outline" type="button" data-action="close-dialog">取消</button><button class="button primary" type="submit">确认${approved ? '通过' : '驳回'}</button>
      </div></form>`, { id, status });
  },
  'organize-ai': async button => {
    if (userId !== 'officer') return;
    const pending = state.queue.filter(entry => !entry.suggested);
    if (!pending.length) return notify('当前没有需要生成建议的待办。');
    await changeState(data => {
      for (const entry of data.queue.filter(item => !item.suggested)) {
        const suggestion = imageSuggestion(entry.images[0]);
        entry.name = entry.name === '待整理物品' ? suggestion.name : entry.name;
        entry.category ||= suggestion.category;
        entry.description ||= suggestion.description;
        entry.suggested = true;
      }
    }, button, () => {
      render('[data-action="organize-ai"]');
      notify('已生成模拟整理建议，请打开待办核对。');
    });
  },
  forward: openForwardDialog,
};

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  event.preventDefault();
  actions[button.dataset.action]?.(button);
});

dialog.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'close-dialog' && !saving) closeDialog();
  if (action === 'copy-forward') copyForward();
});

dialog.addEventListener('cancel', event => {
  event.preventDefault();
  if (!saving) closeDialog();
});

dialog.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.target;
  const kind = form.dataset.form;
  const id = crypto.randomUUID();
  const actor = userId;
  const context = dialogContext;
  const body = new FormData(form).get('message');
  const update = {
    'confirm-publish': data => publishListing(data, context.listing, actor, id),
    claim: data => requestClaim(data, { listingId: context.post.id, claimantId: actor, text: body, id }),
    message: data => sendMessage(data, { listingId: context.post.id, senderId: actor, recipientId: context.recipientId, text: body, id }),
    decide: data => decideClaim(data, { claimId: context.id, authorId: actor, status: context.status }),
  }[kind];
  const notices = { 'confirm-publish': '发布成功，已同步到广场和我的发布。', claim: '认领申请已提交，可在个人中心查看。', message: '留言已保存在当前浏览器。', decide: '已更新认领结果。' };
  await changeState(update, event.submitter, () => {
    closeDialog();
    notify(notices[kind]);
    if (kind === 'confirm-publish') {
      draft = emptyDraft();
      navigate(`#/items/${id}`);
    } else {
      render(kind === 'claim' ? '.detail-actions .primary' : kind === 'message' && route.page === 'details' ? '[data-action="contact"]' : 'h2');
    }
  }, message => showError(form, message));
});

try {
  store = await openStore(seedState);
  state = await store.change();
} catch {
  store = undefined;
  state = seedState();
  storageWarning = '浏览器存储不可用，目前可浏览示例。启用本地存储后刷新即可保存操作。';
}

window.addEventListener('hashchange', () => setRoute());
setRoute(true);

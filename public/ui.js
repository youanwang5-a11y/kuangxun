import {
  CATEGORIES, CLAIM_STATUS, EXAMPLE_QUERY, MAX_IMAGES, PEOPLE, PLACES, TIMES, TYPES,
  findListings, matchListings,
} from './domain.js';

const icons = {
  brand: '<circle cx="10.5" cy="10.5" r="8"/><path d="m16.5 16.5 5 5"/><path d="M13 9.6c0 2-2.5 3.9-2.5 3.9S8 11.6 8 9.6a2.5 2.5 0 1 1 5 0Z"/><circle cx="10.5" cy="9.5" r=".45"/>',
  home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"/>',
  plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/>',
  pen: '<path d="m14 5 5 5M4 20l4.7-1.1L20 7.5a2 2 0 0 0-2.8-2.8L6 16z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/>',
  sparkle: '<path d="M9 3.5c.8 5 2.6 6.8 7.5 7.5-4.9.8-6.7 2.6-7.5 7.5C8.2 13.6 6.4 11.8 1.5 11 6.4 10.3 8.2 8.5 9 3.5Z" fill="currentColor" stroke="none"/><path d="M18 2c.4 2.7 1.3 3.6 4 4-2.7.4-3.6 1.3-4 4-.4-2.7-1.3-3.6-4-4 2.7-.4 3.6-1.3 4-4Zm1 12c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.8-.3-1.9-.9-2.5-2.7-2.8 1.8-.3 2.4-.9 2.7-2.7Z" fill="currentColor" stroke="none"/>',
  bag: '<path d="M5 8h14l2 11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M8 8V6a4 4 0 0 1 8 0v2m-6 8 2-1 2 1"/>',
  box: '<path d="m12 3 9 5v8l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5m-9 5v8m-4.5-15.5 9 5"/>',
  pin: '<path d="M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 1.5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  picture: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.4"/><path d="m3 16 5-4 4 3 4-5 5 5"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L4 20l.8-4.2A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.5 11.5h7"/>',
  shield: '<path d="M12 3 4 6v5c0 4.5 3.7 8 8 10 4.3-2 8-5.5 8-10V6z"/><path d="m9 12 2 2 4-4"/>',
  list: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7m-7 4h7m-7 4h4"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  share: '<path d="m14 5 6 5-6 5v-3c-4 0-7 1-10 4 1-5 4-8 10-8z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};

export function icon(name) {
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg>`;
}

export function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

const text = escapeHTML;
const labels = options => Object.entries(options).map(([value, option]) => [value, option.label || option]);
const badge = (type, label) => `<span class="badge ${type}">${text(label)}</span>`;
const roleBadge = id => PEOPLE[id].role === '失物委员'
  ? `<span class="badge found">${icon('shield')}失物委员</span>`
  : badge('neutral', '普通同学');
const dateTime = new Intl.DateTimeFormat('zh-CN', {
  month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const formatTime = time => dateTime.format(new Date(time));
const imageKeys = new Set(['phone', 'card', 'umbrella', 'earbuds', 'keys', 'tumbler']);
const detailLink = id => `#/items/${encodeURIComponent(id)}`;
const filterChoices = ['type', 'category', 'place', 'time'];

export function plazaLink(params) {
  const search = params.toString();
  return search ? `#/plaza?${search}` : '#/plaza';
}

function navLink(href, label, symbol, selected) {
  return `<a href="${href}" ${selected ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></a>`;
}

function pageShell(content, section, unread, storageWarning) {
  const hasInbox = unread ? '<span class="unread-dot" aria-hidden="true"></span>' : '';
  return `<a class="skip-link" href="#main-content" data-action="skip">跳到主要内容</a>
    <header class="site-header"><div class="container header-inner">
      <a class="brand" href="#/" aria-label="矿寻首页">${icon('brand')}<span><strong>矿寻</strong><small>中国矿业大学</small></span></a>
      <nav class="desktop-nav" aria-label="主导航">
        ${navLink('#/', '首页', 'home', section === 'home')}
        ${navLink('#/plaza', '失物广场', 'grid', section === 'plaza')}
        ${navLink('#/me', '个人中心', 'user', section === 'me')}
      </nav>
      <div class="header-actions">
        <a class="icon-button inbox-link" href="#/me/messages" aria-label="我的消息">${icon('message')}${hasInbox}</a>
        <a class="button primary header-publish" href="#/publish" ${section === 'publish' ? 'aria-current="page"' : ''}>${icon('pen')}发布信息</a>
      </div>
    </div></header>
    <main id="main-content" class="container main-content" tabindex="-1">
      ${storageWarning ? `<p class="callout error" role="alert">${text(storageWarning)}</p>` : ''}
      ${content}
    </main>
    <footer class="site-footer"><div class="container footer-inner"><span>矿寻 · 中国矿业大学校园失物招领</span><span>V0.1 本地演示 · 数据保存在当前浏览器</span></div></footer>
    <nav class="mobile-nav" aria-label="移动端主导航">
      ${navLink('#/', '首页', 'home', section === 'home')}
      ${navLink('#/plaza', '广场', 'grid', section === 'plaza')}
      ${navLink('#/publish', '发布', 'plus', section === 'publish')}
      ${navLink('#/me', '我的', 'user', section === 'me')}
    </nav>`;
}

export function picture(image, label, media, modifier = '') {
  const alt = label ? `role="img" aria-label="${text(label)}"` : 'aria-hidden="true"';
  if (typeof image === 'string' && imageKeys.has(image)) {
    return `<span class="picture ${modifier}" ${alt}><span class="photo-tile photo-${image}"></span></span>`;
  }
  if (image instanceof Blob) {
    return `<span class="picture ${modifier}"><img src="${text(media(image))}" alt="${text(label)}"></span>`;
  }
  return `<span class="picture picture-empty ${modifier}" role="img" aria-label="暂无图片">${icon('box')}</span>`;
}

function listingCard(post, media) {
  return `<a class="listing-card surface" href="${detailLink(post.id)}">
    ${picture(post.images[0], '', media, 'card-photo')}
    <div class="listing-copy">
      ${post.claimed ? badge('neutral', '已认领') : badge(post.type, TYPES[post.type])}
      <h3>${text(post.name)}</h3>
      <p>${icon('pin')}<span>${PLACES[post.place].label}</span></p>
      <p>${icon('clock')}<time datetime="${text(post.time)}">${formatTime(post.time)}</time></p>
    </div>
    <span class="card-arrow">${icon('chevron')}</span>
  </a>`;
}

function emptyState(title, description, action = '') {
  return `<div class="empty-state surface">${icon('box')}<h2>${title}</h2><p>${description}</p>${action}</div>`;
}

function home(view) {
  const latest = findListings(view.state.listings).slice(0, 3);
  return `<section class="hero">
    <div class="hero-photo" aria-hidden="true"></div>
    <div class="hero-copy">
      <h1>找回你的校园失物</h1>
      <p>在矿大，发布、查找和认领遗失物品。</p>
      <form class="search-field hero-search" data-form="ai-search">
        ${icon('search')}<label class="sr-only" for="ai-query">描述你要找的物品</label>
        <input type="search" name="query" id="ai-query" placeholder="${EXAMPLE_QUERY}" maxlength="120" required>
        <button class="button primary" type="submit">${icon('sparkle')}AI 搜索</button>
      </form>
      <button class="text-button hero-example" type="button" data-action="search-example">试试示例</button>
    </div>
  </section>
  <section class="quick-actions" aria-label="快速发布">
    <a class="quick-action quick-lost" href="#/publish?type=lost"><span class="quick-icon">${icon('bag')}</span>
      <span><strong>我丢了东西</strong><small>发布寻物信息，寻找失物</small></span>${icon('chevron')}</a>
    <a class="quick-action quick-found" href="#/publish?type=found"><span class="quick-icon">${icon('box')}</span>
      <span><strong>我捡到了东西</strong><small>发布招领信息，帮物品找到主人</small></span>${icon('chevron')}</a>
  </section>
  <section class="latest" aria-labelledby="latest-title">
    <div class="section-heading"><h2 id="latest-title">最新失物招领</h2><a class="subtle-link" href="#/plaza">查看更多${icon('chevron')}</a></div>
    <div class="listing-grid">${latest.map(post => listingCard(post, view.media)).join('')}</div>
  </section>`;
}

function selectField(name, label, options, selected, { placeholder = '', required = false } = {}) {
  return `<label class="field"><span>${label}</span><span class="select-wrap">
    <select name="${name}" ${required ? 'required' : ''}>
      ${placeholder ? `<option value="">${placeholder}</option>` : ''}
      ${labels(options).map(([value, title]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${title}</option>`).join('')}
    </select>${icon('down')}</span></label>`;
}

function searchSummary(query, filters, resultCount) {
  if (!query) return '';
  const recognized = [filters.term || CATEGORIES[filters.category]?.label, PLACES[filters.place]?.label,
    filters.night ? (filters.time === 'today' ? '今晚' : '昨晚') : TIMES[filters.time], TYPES[filters.type]].filter(Boolean);
  return `<div class="callout ai search-summary">
    <div>${icon('sparkle')}<strong>AI 搜索 · 模拟</strong><span>${text(recognized.length ? recognized.join(' · ') : query)}</span></div>
    <span class="search-count">${resultCount} 条结果</span>
  </div>`;
}

function plaza(view) {
  const { filters, params, query } = view.route;
  const results = findListings(view.state.listings, filters);
  const tab = (value, label) => {
    const updated = new URLSearchParams(params);
    updated.set('type', value);
    return `<a class="filter-tab ${value}" ${value === filters.type ? 'aria-current="true"' : ''} href="${text(plazaLink(updated))}">${label}</a>`;
  };
  const hasFilters = query || filters.keyword || filterChoices.some(name => filters[name]);
  return `<header class="page-heading plaza-heading"><h1>失物招领广场</h1><p>查找校园里的寻物和招领信息。</p></header>
    <section class="filter-panel surface" aria-label="搜索和筛选">
      <div class="filter-top"><nav class="filter-tabs" aria-label="信息类型">${tab('', '全部')}${tab('lost', '寻物')}${tab('found', '招领')}</nav>
        <form class="search-field keyword-search" data-form="keyword">
          ${icon('search')}<label class="sr-only" for="keyword">物品关键词</label>
          <input type="search" id="keyword" name="keyword" value="${text(filters.keyword)}" placeholder="搜索物品关键词" maxlength="120">
          <button type="submit" class="button outline">搜索</button>
        </form>
      </div>
      <form class="filters" data-form="filters">
        ${selectField('category', '物品分类', CATEGORIES, filters.category, { placeholder: '全部分类' })}
        ${selectField('place', '地点', PLACES, filters.place, { placeholder: '全部地点' })}
        ${selectField('time', '时间', TIMES, filters.time, { placeholder: '不限时间' })}
        ${hasFilters ? '<a class="text-button clear-filters" href="#/plaza">清除筛选</a>' : ''}
      </form>
    </section>
    ${searchSummary(query, filters, results.length)}
    <section class="plaza-results" aria-labelledby="result-heading">
      <div class="section-heading"><h2 id="result-heading">${query ? '搜索结果' : '物品列表'}</h2><span class="muted">${results.length} 条信息</span></div>
      ${results.length ? `<div class="listing-grid">${results.map(post => listingCard(post, view.media)).join('')}</div>`
        : emptyState('没有找到符合条件的物品', '可以更换关键词，或减少筛选条件。', '<a class="button outline" href="#/plaza">查看全部信息</a>')}
    </section>`;
}

function imageUploader(draft, media) {
  const previews = draft.images.map((image, index) => `<div class="upload-preview">
    ${picture(image, `物品照片 ${index + 1}`, media)}
    <button class="icon-button remove-photo" type="button" data-action="remove-photo" data-index="${index}" aria-label="移除第 ${index + 1} 张图片">${icon('close')}</button>
  </div>`);
  return `<div class="upload-grid">${previews.join('')}
    ${draft.images.length < MAX_IMAGES ? `<button class="upload-tile" type="button" data-action="pick-files">${icon('plus')}<span>批量上传</span></button>` : ''}
  </div>
  <input type="file" id="listing-images" hidden accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple>
  <p class="microcopy">${draft.images.length} / ${MAX_IMAGES} 张 · 每张不超过 8 MB</p>`;
}

function publish(view) {
  const { draft, media } = view;
  const verb = draft.type === 'found' ? '拾取' : '遗失';
  return `<header class="page-heading"><h1>发布信息</h1><p>添加物品照片和关键信息，方便同学查找。</p></header>
    <form class="publish-form" data-form="publish">
      <fieldset class="type-picker"><legend class="sr-only">发布类型</legend>
        ${[['lost', 'bag'], ['found', 'box']].map(([type, symbol]) => `<label class="type-option ${type}">
          <input type="radio" name="type" value="${type}" ${draft.type === type ? 'checked' : ''}>
          <span>${icon(symbol)}${TYPES[type]}${icon('check')}</span></label>`).join('')}
      </fieldset>
      <div class="publish-columns">
        <section class="surface panel upload-panel">
          <h2>${icon('picture')}上传物品图片</h2>
          <p class="muted">添加照片，让同学更容易辨认物品。</p>
          ${imageUploader(draft, media)}
          <div class="callout ai ai-tool"><div><strong>${icon('sparkle')}AI 图片识别</strong><small>模拟建议，可修改后发布。</small></div>
            <button type="button" class="button outline" data-action="suggest">AI 识别并填写</button></div>
          ${draft.suggestion ? '<p class="form-note" role="status">已填入模拟建议，请核对物品名称、类别与描述。</p>' : ''}
        </section>
        <section class="surface panel publish-fields" aria-label="物品信息">
          <label class="field"><span>物品名称</span><input name="name" placeholder="如绿色手机" maxlength="60" value="${text(draft.name)}" required></label>
          ${selectField('category', '物品类别', CATEGORIES, draft.category, { placeholder: '选择类别', required: true })}
          ${selectField('place', `${verb}地点`, PLACES, draft.place, { placeholder: '选择地点', required: true })}
          <label class="field"><span>${verb}时间</span><input name="time" type="datetime-local" value="${text(draft.time)}" required></label>
          <label class="field"><span>物品描述</span><textarea name="description" maxlength="600" rows="4" placeholder="补充颜色、外观和具体位置…" required>${text(draft.description)}</textarea></label>
          <p class="form-error" role="alert" hidden></p>
          <button class="button primary full-width" type="submit">预览${TYPES[draft.type]}信息</button>
        </section>
      </div>
    </form>`;
}

function person(id, subtitle = '') {
  const user = PEOPLE[id];
  return `<div class="person"><span class="avatar ${id}">${user.initial}</span>
    <div><div class="person-name"><strong>${user.name}</strong>${roleBadge(id)}</div>${subtitle ? `<small>${subtitle}</small>` : ''}</div>
  </div>`;
}

function facts(post) {
  return `<dl class="facts">
    <div><dt>${icon('pin')}地点</dt><dd>${PLACES[post.place].label}</dd></div>
    <div><dt>${icon('clock')}时间</dt><dd><time datetime="${text(post.time)}">${formatTime(post.time)}</time></dd></div>
    <div><dt>${icon('grid')}类别</dt><dd>${CATEGORIES[post.category].label}</dd></div>
  </dl>`;
}

function details(view) {
  const { state, route, media, userId } = view;
  const post = state.listings.find(entry => entry.id === route.id);
  if (!post) return `<h1>未找到物品</h1>${emptyState('这条信息不存在', '请返回广场查看当前浏览器里的物品。', '<a class="button outline" href="#/plaza">返回广场</a>')}`;

  const matched = matchListings(post, state);
  const own = post.authorId === userId;
  const applied = state.claims.some(claim => claim.listingId === post.id && claim.claimantId === userId);
  const thumbIndex = view.gallery < post.images.length ? view.gallery : 0;
  const canClaim = !own && post.type === 'found' && !post.claimed;
  return `<a class="back-link" href="#/plaza">${icon('back')}返回广场</a>
    <article class="detail-layout">
      <section class="surface panel gallery" aria-label="物品图片">
        ${picture(post.images[thumbIndex], post.name, media, 'gallery-main')}
        ${post.images.length > 1 ? `<div class="gallery-thumbs">${post.images.map((image, index) => `<button type="button" data-action="gallery" data-index="${index}" aria-label="查看第 ${index + 1} 张照片" aria-pressed="${index === thumbIndex}">${picture(image, '', media)}</button>`).join('')}</div>` : ''}
      </section>
      <section class="surface panel detail-content">
        <div class="detail-badges">${badge(post.type, TYPES[post.type])}${post.claimed ? badge('neutral', '已认领') : ''}</div>
        <h1>${text(post.name)}</h1>
        ${facts(post)}
        <div class="detail-description"><h2>物品描述</h2><p>${text(post.description)}</p></div>
        <div class="detail-person">${person(post.authorId, '发布者')}</div>
        <div class="detail-actions">
          ${own ? '<a class="button outline" href="#/me">查看我的发布</a>' : `<button type="button" class="button outline" data-action="contact">${icon('message')}联系发布者</button>`}
          ${canClaim ? (applied ? '<a class="button primary" href="#/me/claims">查看认领进度</a>' : '<button type="button" class="button primary" data-action="claim">申请认领</button>') : ''}
        </div>
        <div class="callout ai ai-tool"><div><strong>${icon('sparkle')}AI 智能匹配 · 模拟</strong>
          <small>${matched.length ? `发现 ${matched.length} 条可能相关的信息。` : '暂未找到类别、地点和时间相近的信息。'}</small></div>
          ${matched.length ? '<button type="button" class="button outline" data-action="matches">查看匹配</button>' : ''}</div>
      </section>
    </article>`;
}

const profileSections = [
  ['posts', '我的发布', 'list'], ['messages', '我的消息', 'message'],
  ['claims', '我的认领记录', 'bookmark'], ['workbench', '委员工作台', 'layers'],
];

function accountPosts(view) {
  const posts = findListings(view.state.listings.filter(post => post.authorId === view.userId));
  const match = posts.find(post => post.type === 'lost' && matchListings(post, view.state).length);
  return `<h2>我的发布</h2>
    ${match ? `<a class="callout ai profile-alert" href="${detailLink(match.id)}">${icon('sparkle')} <strong>有 1 条发布存在可能的 AI 匹配</strong>${icon('chevron')}</a>` : ''}
    ${posts.length ? `<div class="row-list">${posts.map(post => `<a class="record-row surface" href="${detailLink(post.id)}">
      ${picture(post.images[0], post.name, view.media, 'row-photo')}<div class="row-copy"><h3>${text(post.name)}</h3>
      <p>${icon('pin')}${PLACES[post.place].label}</p><p>${icon('clock')}${formatTime(post.time)}</p></div>
      ${badge(post.claimed ? 'neutral' : post.type, post.claimed ? '已认领' : post.type === 'lost' ? '寻找中' : '待认领')}
    </a>`).join('')}</div>` : emptyState('还没有发布', '发布寻物或招领信息后，可在这里查看。', '<a class="button outline" href="#/publish">发布信息</a>')}`;
}

function accountMessages(view) {
  const { state, userId } = view;
  const messages = state.messages.filter(entry => [entry.recipientId, entry.senderId].includes(userId));
  const requests = state.claims.filter(claim => state.listings.some(post => post.id === claim.listingId && post.authorId === userId));
  return `<h2>我的消息</h2><p class="muted">消息和申请仅用于当前浏览器内的演示。</p>
    ${requests.length ? `<h3 class="account-subheading">收到的认领申请</h3>
      <div class="row-list">${requests.map(claim => {
        const post = state.listings.find(entry => entry.id === claim.listingId);
        return `<article class="message-row surface"><div class="message-head">
          <div><a class="subtle-link" href="${detailLink(post.id)}">${text(post.name)}</a><p class="microcopy">${PEOPLE[claim.claimantId].name} · ${formatTime(claim.createdAt)}</p></div>
          ${badge(claim.status === 'approved' ? 'found' : 'neutral', CLAIM_STATUS[claim.status])}</div>
          <p class="message-text">${text(claim.evidence)}</p>
          ${claim.status === 'pending' ? `<div class="button-row">
            <button type="button" class="button outline" data-action="decide" data-id="${text(claim.id)}" data-status="rejected">驳回</button>
            <button type="button" class="button primary" data-action="decide" data-id="${text(claim.id)}" data-status="approved">通过认领</button></div>` : ''}
        </article>`;
      }).join('')}</div>` : ''}
    <h3 class="account-subheading">站内留言</h3>
    ${messages.length ? `<div class="row-list">${messages.map(entry => {
      const post = state.listings.find(item => item.id === entry.listingId);
      const received = entry.recipientId === userId;
      const otherId = received ? entry.senderId : entry.recipientId;
      return `<article class="message-row surface"><div class="message-head">
        <div><strong>${received ? '来自' : '发给'}${PEOPLE[otherId].name}</strong>
        <p class="microcopy"><a href="${detailLink(post.id)}">${text(post.name)}</a> · ${formatTime(entry.createdAt)}</p></div>
        <button type="button" class="button outline" data-action="reply" data-id="${text(entry.id)}">留言回复</button></div>
        <p class="message-text">${text(entry.text)}</p></article>`;
    }).join('')}</div>` : emptyState('暂无留言', '联系发布者后，留言会显示在这里。')}`;
}

function accountClaims(view) {
  const claims = view.state.claims.filter(entry => entry.claimantId === view.userId);
  return `<h2>我的认领记录</h2>${claims.length ? `<div class="row-list">${claims.map(claim => {
    const post = view.state.listings.find(entry => entry.id === claim.listingId);
    return `<a href="${detailLink(post.id)}" class="surface record-row">
      ${picture(post.images[0], post.name, view.media, 'row-photo')}
      <div class="row-copy"><h3>${text(post.name)}</h3><p>${icon('clock')}申请于 ${formatTime(claim.createdAt)}</p></div>
      ${badge(claim.status === 'approved' ? 'found' : claim.status === 'pending' ? 'lost' : 'neutral', CLAIM_STATUS[claim.status])}
    </a>`;
  }).join('')}</div>` : emptyState('暂无认领记录', '在招领信息的详情页可以申请认领。', '<a class="button outline" href="#/plaza">浏览广场</a>')}`;
}

function workbench(view) {
  if (view.userId !== 'officer') return emptyState('需要委员演示身份', '切换演示身份后即可查看委员工作台。');
  return `<h2>失物委员工作台</h2>
    <div class="workbench-actions">
      <button type="button" class="button work-action mint" data-action="pick-intake">${icon('upload')}批量上传</button>
      <a class="button work-action peach" href="#/publish?type=found">${icon('plus')}协助发布</a>
      <button type="button" class="button work-action mint" data-action="forward">${icon('share')}转发信息</button>
    </div>
    <input type="file" id="intake-images" hidden accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple>
    <div class="callout ai ai-tool"><div><strong>${icon('sparkle')}AI 信息整理 · 模拟</strong><small>为待办补充可核对的物品名称和类别。</small></div>
      <button class="button outline" type="button" data-action="organize-ai">生成整理建议</button>
    </div>
    <div class="section-heading queue-heading"><h3>待处理信息</h3>${badge('found', `${view.state.queue.length} 条`)}</div>
    ${view.state.queue.length ? `<div class="row-list">${view.state.queue.map(entry => `<article class="record-row surface queue-row">
      ${picture(entry.images[0], entry.name, view.media, 'row-photo')}
      <div class="row-copy"><h3>${text(entry.name)}</h3><p>${icon('pin')}${PLACES[entry.place]?.label || '地点待补充'}</p></div>
      ${badge(entry.suggested ? 'found' : 'lost', entry.suggested ? '待核对' : '待整理')}
      <a href="#/publish?type=found&amp;queue=${encodeURIComponent(entry.id)}" class="button outline">整理信息</a>
    </article>`).join('')}</div>` : emptyState('待办已处理完', '可批量上传新照片继续整理。')}`;
}

function account(view) {
  const sections = { posts: accountPosts, messages: accountMessages, claims: accountClaims, workbench };
  const active = view.route.subsection;
  const links = profileSections.filter(([key]) => key !== 'workbench' || view.userId === 'officer');
  return `<header class="page-heading account-heading"><h1>个人中心</h1></header>
    <div class="account-layout">
      <aside class="surface panel identity">
        ${person(view.userId, '当前演示身份')}
        <label class="field role-select"><span>切换演示身份</span><span class="select-wrap">
          <select id="demo-role"><option value="student" ${view.userId === 'student' ? 'selected' : ''}>普通同学</option>
          <option value="officer" ${view.userId === 'officer' ? 'selected' : ''}>失物委员</option></select>${icon('down')}
        </span></label>
        <nav class="account-nav" aria-label="个人中心导航">${links.map(([key, label, symbol]) => navLink(key === 'posts' ? '#/me' : `#/me/${key}`, label, symbol, key === active)).join('')}</nav>
      </aside>
      <section class="account-main">${sections[active](view)}</section>
    </div>`;
}

export function renderApp(view) {
  const pages = { home, plaza, publish, details, me: account };
  const section = view.route.page === 'details' ? 'plaza' : view.route.page;
  const unread = view.state.claims.some(claim => claim.status === 'pending'
    && view.state.listings.some(post => post.id === claim.listingId && post.authorId === view.userId));
  return pageShell(pages[view.route.page](view), section, unread, view.storageWarning);
}

export function dialogFrame(title, content) {
  return `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2>
    <button type="button" class="icon-button" aria-label="关闭弹窗" data-action="close-dialog">${icon('close')}</button></div>${content}`;
}

export function publishPreview(listing, media) {
  return `<div class="preview-post">${picture(listing.images[0], listing.name, media, 'preview-cover')}
    <div>${badge(listing.type, TYPES[listing.type])}<h3>${text(listing.name)}</h3>${facts(listing)}</div></div>
    <p class="preview-text">${text(listing.description)}</p>
    ${listing.images.length > 1 ? `<div class="preview-thumbs" aria-label="其余物品图片">
      ${listing.images.slice(1).map((image, index) => picture(image, `物品照片 ${index + 2}`, media)).join('')}
    </div>` : ''}
    <form data-form="confirm-publish"><p class="form-error" role="alert" hidden></p><div class="button-row dialog-buttons">
    <button class="button outline" type="button" data-action="close-dialog">返回修改</button>
    <button class="button primary" type="submit">确认发布</button></div></form>`;
}

export function composeForm(kind, recipientName) {
  const isClaim = kind === 'claim';
  const description = isClaim ? '描述能证明物品归属的外观细节，供发布者核对。' : `给${text(recipientName)}留言。消息仅保存在当前浏览器。`;
  return `<p class="muted">${description}</p>
    <form data-form="${kind}" class="dialog-form"><label class="field"><span>${isClaim ? '物品识别特征' : '留言内容'}</span>
    <textarea name="message" rows="4" maxlength="600" required autofocus></textarea></label>
    <p class="form-error" role="alert" hidden></p>
    <div class="button-row dialog-buttons"><button class="button outline" type="button" data-action="close-dialog">取消</button>
    <button class="button primary" type="submit">${isClaim ? '提交申请' : '保存留言'}</button></div></form>`;
}

export function matchDialog(posts, media) {
  return `<p class="muted">依据类别、地点和时间筛选的演示候选，请查看详情后自行核对。</p>
    <div class="match-list">${posts.map(post => listingCard(post, media)).join('')}</div>`;
}

export const PEOPLE = {
  student: { name: '林同学', initial: '林', role: '学生' },
  officer: { name: '陈同学', initial: '陈', role: '失物委员' },
};

export const CATEGORIES = {
  electronics: { label: '数码电子', terms: /手机|耳机|相机|平板|数码|充电|电脑|蓝牙/ },
  card: { label: '卡证资料', terms: /校园卡|学生证|身份证|银行卡|卡证|证件|饭卡/ },
  keys: { label: '钥匙配饰', terms: /钥匙|配饰|手链|戒指|钥匙扣/ },
  daily: { label: '生活用品', terms: /伞|水杯|保温杯|雨具|生活用品|书包|杯子/ },
  other: { label: '其他', terms: /其他/ },
};

export const PLACES = {
  library: { label: '南湖校区图书馆', terms: /图书馆|阅览室/ },
  canteen: { label: '南湖校区一食堂', terms: /一食堂|食堂|餐厅/ },
  classroom: { label: '南湖校区教学楼', terms: /教学楼|教室|教学区/ },
  gym: { label: '南湖校区体育馆', terms: /体育馆|操场|球场/ },
  dorm: { label: '南湖校区宿舍区', terms: /宿舍|公寓/ },
  wenchang: { label: '文昌校区', terms: /文昌/ },
  other: { label: '其他地点', terms: /其他地点/ },
};

export const TIMES = { today: '今天', yesterday: '昨天', last7: '近 7 天', last30: '近 30 天' };
export const TYPES = { lost: '寻物', found: '招领' };
export const CLAIM_STATUS = { pending: '待处理', approved: '已通过', rejected: '未通过' };
export const EXAMPLE_QUERY = '昨天晚上在图书馆丢了一部手机';
export const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MEDIA_TERMS = /校园卡|学生证|手机|耳机|折叠伞|雨伞|钥匙|保温杯|水杯|书包|相机|平板|电脑/;

const exampleDates = (now, days, hour, minute = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export function seedState(now = new Date()) {
  function post(id, type, name, category, place, authorId, picture, description, days, hour, minute, order) {
    return {
      id, type, name, category, place, authorId, description, images: [picture],
      time: exampleDates(now, days, hour, minute),
      createdAt: new Date(+now - order * 3600000).toISOString(),
    };
  }

  return {
    listings: [
      post('green-phone', 'found', '绿色手机', 'electronics', 'library', 'officer', 'phone', '在图书馆二楼自习区发现，绿色保护壳，屏幕完好。认领时请说明手机的识别特征。', 1, 21, 10, 2),
      post('campus-card', 'lost', '浅蓝色校园卡', 'card', 'canteen', 'student', 'card', '可能落在一食堂二楼靠窗处。卡面是浅蓝色，有一个透明卡套。', 1, 12, 20, 4),
      post('black-umbrella', 'found', '黑色折叠伞', 'daily', 'classroom', 'officer', 'umbrella', '在教学楼 B 区一楼入口发现，伞柄有一条黑色手绳。', 2, 16, 30, 6),
      post('white-earbuds', 'found', '白色无线耳机', 'electronics', 'gym', 'officer', 'earbuds', '在体育馆看台附近拾到，白色充电盒。', 2, 14, 0, 11),
      post('silver-keys', 'lost', '一串银色钥匙', 'keys', 'dorm', 'student', 'keys', '两把钥匙，挂着一个墨绿色圆形钥匙扣。', 3, 10, 20, 12),
      post('green-tumbler', 'found', '浅绿色保温杯', 'daily', 'library', 'officer', 'tumbler', '在图书馆借阅区发现，杯身为浅绿色，杯盖完好。', 4, 13, 20, 13),
      post('lost-phone', 'lost', '绿色手机（带保护壳）', 'electronics', 'library', 'student', 'phone', '昨晚经过二楼自习区，手机装在绿色保护壳里。', 1, 20, 40, 15),
    ],
    claims: [{
      id: 'demo-claim', listingId: 'white-earbuds', claimantId: 'student',
      evidence: '充电盒为白色，背面有一处浅划痕。', status: 'rejected',
      createdAt: exampleDates(now, 1, 12), decidedAt: exampleDates(now, 1, 14),
    }],
    messages: [{
      id: 'demo-message', listingId: 'campus-card', senderId: 'officer', recipientId: 'student',
      text: '你好，一食堂服务台也会代为保管捡到的校园卡，可以去问一问。', createdAt: exampleDates(now, 1, 16),
    }],
    queue: [
      { id: 'intake-card', name: '浅蓝色校园卡', category: 'card', place: 'canteen', images: ['card'], time: exampleDates(now, 0, 10) },
      { id: 'intake-umbrella', name: '黑色折叠伞', category: 'daily', place: 'classroom', images: ['umbrella'], time: exampleDates(now, 0, 11) },
    ],
  };
}

export function getSearchIntent(query) {
  const category = Object.keys(CATEGORIES).find(key => CATEGORIES[key].terms.test(query)) || '';
  const place = Object.keys(PLACES).find(key => PLACES[key].terms.test(query)) || '';
  const night = /昨晚|昨天晚上|昨夜|今晚|今天晚上/.test(query);
  let time = '';
  if (/昨天|昨晚|昨夜/.test(query)) time = 'yesterday';
  else if (/今天|今晚/.test(query)) time = 'today';
  else if (/近\s*[7七]\s*天|一周/.test(query)) time = 'last7';
  else if (/近\s*30\s*天|一个月/.test(query)) time = 'last30';
  const term = query.match(MEDIA_TERMS)?.[0] || '';
  const type = /丢|遗失|不见|找不到/.test(query) ? 'found'
    : /捡到|拾到|拾获/.test(query) ? 'lost' : '';
  const fallback = category || place || time || type ? '' : query.trim();
  return { category, place, time, night, term, type, fallback };
}

function inPeriod(value, period, now) {
  if (!period) return true;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + (period === 'yesterday' ? 0 : 1));
  const offset = { today: 0, yesterday: 1, last7: 6, last30: 29 }[period] ?? 0;
  start.setDate(start.getDate() - offset);
  const date = new Date(value);
  return date >= start && date < end;
}

export function findListings(listings, filters = {}, now = new Date()) {
  const text = (filters.term || filters.fallback || '').toLocaleLowerCase();
  const keyword = (filters.keyword || '').trim().toLocaleLowerCase();
  return listings.filter(post => {
    const summary = `${post.name} ${post.description}`.toLocaleLowerCase();
    const searchable = `${summary} ${CATEGORIES[post.category].label} ${PLACES[post.place].label}`;
    return (!filters.type || post.type === filters.type)
      && (!filters.category || post.category === filters.category)
      && (!filters.place || post.place === filters.place)
      && inPeriod(post.time, filters.time, now)
      && (!filters.night || new Date(post.time).getHours() >= 18)
      && (!text || summary.includes(text))
      && (!keyword || searchable.includes(keyword));
  }).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function matchListings(post, state) {
  if (post.claimed) return [];
  return state.listings.filter(candidate => candidate.type !== post.type && !candidate.claimed
    && candidate.category === post.category && candidate.place === post.place
    && Math.abs(Date.parse(candidate.time) - Date.parse(post.time)) <= 3 * 86400000)
    .sort((left, right) => Math.abs(Date.parse(left.time) - Date.parse(post.time))
      - Math.abs(Date.parse(right.time) - Date.parse(post.time)));
}

export function validateImageFiles(files, existing = 0) {
  if (files.length + existing > MAX_IMAGES) throw new Error(`一次最多添加 ${MAX_IMAGES} 张图片。`);
  if (files.some(file => !IMAGE_TYPES.has(file.type) || file.size === 0 || file.size > MAX_IMAGE_BYTES)) {
    throw new Error('请选择 JPG、PNG、WebP、GIF 或 AVIF 图片，每张不超过 8 MB。');
  }
}

export function imageSuggestion(image) {
  const filename = typeof image === 'string' ? image : image.name;
  const sample = [
    [/phone|手机/i, '绿色手机', 'electronics', '请补充保护壳、颜色等外观特征。'],
    [/card|校园卡/i, '浅蓝色校园卡', 'card', '请补充卡套或卡面特征，隐藏卡号。'],
    [/umbrella|雨伞|折叠伞/i, '折叠伞', 'daily', '请补充伞柄、颜色等外观特征。'],
    [/earbuds|耳机/i, '无线耳机', 'electronics', '请补充充电盒和耳机的外观特征。'],
    [/keys|钥匙/i, '钥匙', 'keys', '请补充钥匙数量与钥匙扣特征。'],
    [/tumbler|水杯|保温杯/i, '保温杯', 'daily', '请补充杯身颜色与杯盖特征。'],
  ].find(([pattern]) => pattern.test(filename || ''));
  const [, name, category, description] = sample || [null, '待确认物品', 'other', '请补充物品的颜色、外观和可用于确认的特征。'];
  return { name, category, description };
}

export function validateListing(input) {
  const name = input.name.trim();
  const description = input.description.trim();
  if (!Object.hasOwn(TYPES, input.type)) throw new Error('请选择发布类型。');
  if (!name || name.length > 60) throw new Error('请输入 1 至 60 个字符的物品名称。');
  if (!Object.hasOwn(CATEGORIES, input.category) || !Object.hasOwn(PLACES, input.place)) {
    throw new Error('请选择物品分类和地点。');
  }
  if (!input.time || !Number.isFinite(Date.parse(input.time))) throw new Error('请输入有效的时间。');
  if (!description || description.length > 600) throw new Error('请输入 1 至 600 个字符的物品描述。');
  if (input.images.length > MAX_IMAGES) throw new Error(`最多上传 ${MAX_IMAGES} 张图片。`);
  validateImageFiles(input.images.filter(image => typeof image !== 'string'));
  return { type: input.type, name, category: input.category, place: input.place,
    time: new Date(input.time).toISOString(), description, images: [...input.images] };
}

export function publishListing(state, input, authorId, id, now = new Date()) {
  const listing = validateListing(input);
  if (input.queueId && (authorId !== 'officer' || !state.queue.some(entry => entry.id === input.queueId))) {
    throw new Error('这条待办已处理，或当前身份没有整理权限。');
  }
  state.listings.unshift({ ...listing, id, authorId, createdAt: now.toISOString() });
  if (input.queueId) state.queue = state.queue.filter(entry => entry.id !== input.queueId);
}

export function sendMessage(state, { listingId, senderId, recipientId, text, id }, now = new Date()) {
  const listing = state.listings.find(post => post.id === listingId);
  const body = text.trim();
  if (!listing || !PEOPLE[senderId] || !PEOPLE[recipientId] || senderId === recipientId
    || ![senderId, recipientId].includes(listing.authorId)) throw new Error('找不到这条消息的收件人。');
  if (!body || body.length > 600) throw new Error('请输入 1 至 600 个字符的消息。');
  state.messages.unshift({ id, listingId, senderId, recipientId, text: body, createdAt: now.toISOString() });
}

export function requestClaim(state, { listingId, claimantId, text, id }, now = new Date()) {
  const listing = state.listings.find(post => post.id === listingId);
  if (!listing || listing.type !== 'found' || listing.authorId === claimantId) throw new Error('这条信息无法申请认领。');
  if (listing.claimed) throw new Error('该物品已完成认领。');
  if (state.claims.some(claim => claim.listingId === listingId && claim.claimantId === claimantId)) {
    throw new Error('你已申请过认领，可以在个人中心查看记录。');
  }
  const evidence = text.trim();
  if (!evidence || evidence.length > 600) throw new Error('请输入 1 至 600 个字符的物品特征。');
  state.claims.unshift({ id, listingId, claimantId, evidence, status: 'pending', createdAt: now.toISOString() });
}

export function decideClaim(state, { claimId, authorId, status }, now = new Date()) {
  const claim = state.claims.find(entry => entry.id === claimId);
  const listing = state.listings.find(post => post.id === claim?.listingId);
  if (!listing || listing.authorId !== authorId) throw new Error('只有发布者可以处理这条申请。');
  if (claim.status !== 'pending' || listing.claimed) throw new Error('这条申请已经处理。');
  if (!['approved', 'rejected'].includes(status)) throw new Error('请选择有效处理结果。');
  const decidedAt = now.toISOString();
  Object.assign(claim, { status, decidedAt });
  if (status === 'approved') {
    listing.claimed = true;
    for (const pending of state.claims) {
      if (pending.listingId === listing.id && pending.status === 'pending') {
        Object.assign(pending, { status: 'rejected', decidedAt });
      }
    }
  }
}

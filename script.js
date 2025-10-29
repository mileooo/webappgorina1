document.addEventListener('DOMContentLoaded', () => {
  /* Telegram WebApp fallback */
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : { sendData: () => {}, close: () => {}, expand: () => {} };

  /* ====== Data ====== */
  const products = [
    ["🍉 Арбуз — 40₽/кг", "Арбуз", 40, "fruits"],
    ["🍐 Груша — 340₽/кг", "Груша", 340, "fruits"],
    ["🍊 Апельсин — 220₽/кг", "Апельсин", 220, "fruits"],
    ["🍈 Дыня торпеда Узбекистан — 80₽/кг", "Дыня торпеда Узбекистан", 80, "fruits"],
    ["🍈 Дыня колхозница — 80₽/кг", "Дыня колхозница", 80, "fruits"],
    ["🍇 Виноград зеленый (без косточек) — 320₽/кг", "Виноград зеленый (без косточек)", 320, "fruits"],
    ["🍇 Виноград темный (без косточек) — 320₽/кг", "Виноград темный (без косточек)", 320, "fruits"],
    ["🍇 Виноград черный (Мерседес) — 300₽/кг", "Виноград черный (Мерседес)", 300, "fruits"],
    ["🍑 Нектарин Узбекистан красный — 170₽/кг", "Нектарин Узбекистан красный", 170, "fruits"],
    ["🍑 Нектарин Турция — 350₽/кг", "Нектарин Турция", 350, "fruits"],
    ["🍑 Нектарин Узбекистан желтый (вкус лимон) — 250₽/кг", "Нектарин Узбекистан желтый (вкус лимон)", 250, "fruits"],
    ["🍑 Нектарин Узбекистан зеленый — 190₽/кг", "Нектарин Узбекистан зеленый", 190, "fruits"],
    ["🍌 Банан — 170₽/кг", "Банан", 170, "fruits"],
    ["🥔 Картофель Чувашия — 45₽/кг", "Картофель Чувашия", 45, "vegetables"],
    ["🥔 Картофель Краснодар — 45₽/кг", "Картофель Краснодар", 45, "vegetables"],
    ["🥕 Морковь Волгоград — 45₽/кг", "Морковь Волгоград", 45, "vegetables"],
    ["🧅 Лук репчатый Волгоград — 45₽/кг", "Лук репчатый Волгоград", 45, "vegetables"],
    ["🌱 Лук зеленый — 350₽/кг", "Лук зеленый", 350, "vegetables"],
    ["🌱 Укроп, петрушка — 350₽/кг", "Укроп, петрушка", 350, "vegetables"],
    ["🌱 Кинза — 440₽/кг", "Кинза", 440, "vegetables"],
    ["🌱 Базелик — 50₽/пучок", "Базелик (пучок)", 50, "vegetables"],
    ["🧄 Чеснок Ташкент — 400₽/кг", "Чеснок Ташкент", 400, "vegetables"],
    ["🫑 Перец болгарский — 130₽/кг", "Перец болгарский", 130, "vegetables"],
    ["🌶️ Перец чили — 25₽/шт", "Перец чили", 25, "vegetables"],
    ["🍅 Помидоры Азербайджанские — 220₽/кг", "Помидоры Азербайджанские", 220, "vegetables"],
    ["🍅 Помидоры Ростовские — 180₽/кг", "Помидоры Ростовские", 180, "vegetables"],
    ["🍅 Помидоры Волгоград (мелкие) — 80₽/кг", "Помидоры Волгоград (мелкие)", 80, "vegetables"],
    ["🍅 Помидоры домашние — 240₽/кг", "Помидоры домашние", 240, "vegetables"],
    ["🍅 Помидоры Астрахань (желтые) — 190₽/кг", "Помидоры Астрахань (желтые)", 190, "vegetables"],
    ["🥒 Огурцы Московские — 150₽/кг", "Огурцы Московские", 150, "vegetables"],
    ["🥒 Огурцы Самарские — 80₽/кг", "Огурцы Самарские", 80, "vegetables"],
    ["🥒 Огурцы домашние — 150₽/кг", "Огурцы домашние", 150, "vegetables"],
    ["🍑 Слива 4 вида — 190₽/кг - Ташкент; Медовая - 220₽/кг; Желтая - 250₽/кг; Чернослива - 220₽/кг", "Слива 4 вида", 220, "fruits"],
    ["🍒 Черешня — 580₽/кг", "Черешня", 580, "fruits"],
    ["🫐 Голубика — 800₽/кг", "Голубика", 800, "fruits"],
    ["🍑 Абрикос Армения — 240₽/кг", "Абрикос Армения", 240, "fruits"],
    ["🍑 Абрикос Киргизия — 150₽/кг", "Абрикос Киргизия", 150, "fruits"],
    ["🍑 Персик Ташкент — 250₽/кг", "Персик Ташкент", 250, "fruits"],
    ["🍑 Персик Армения — 380₽/кг", "Персик Армения", 380, "fruits"],
    ["🍑 Персик Турция — 450₽/кг", "Персик Турция", 450, "fruits"],
    ["🍑 Персик Инжирный — 350₽/кг", "Персик Инжирный", 350, "fruits"],
    ["🥝 Киви — 450₽/кг", "Киви", 450, "fruits"],
    ["Кабачок — 55₽/кг", "Кабачок", 55, "vegetables"],
    ["🍆 Баклажан — 130₽/кг", "Баклажан", 130, "vegetables"],
    ["🍋 Лимон — 290₽/кг", "Лимон", 290, "fruits"]
  ];

  /* KBJU & descriptions mapping (100 г) */
  const kbjuData = {
    'Арбуз': { kbju: 'В 100 граммах\n30 ккал • Б 0.6 г • Ж 0.2 г • У 7.6 г', desc: '💚 Освежающий и богатый ликопином фрукт, помогает выводить токсины и поддерживает водный баланс.' },
    'Груша': { kbju: 'В 100 граммах\n57 ккал • Б 0.4 г • Ж 0.4 г • У 15 г', desc: '🍐 Отличный источник клетчатки, поддерживает здоровое пищеварение и снижает уровень холестерина.' },
    'Апельсин': { kbju: 'В 100 граммах\n47 ккал • Б 0.9 г • Ж 0.1 г • У 11.8 г', desc: '🍊 Мощный заряд витамина C, укрепляет иммунитет и повышает уровень энергии.' },
    'Дыня торпеда Узбекистан': { kbju: 'В 100 граммах\n35 ккал • Б 0.8 г • Ж 0.2 г • У 8 г', desc: '🍈 Освежающая, насыщена калием и витамином C, способствует детоксикации организма.' },
    'Дыня колхозница': { kbju: 'В 100 граммах\n36 ккал • Б 0.6 г • Ж 0.3 г • У 8.1 г', desc: '🍈 Поддерживает водный баланс, мягко улучшает обмен веществ.' },
    'Виноград зеленый (без косточек)': { kbju: 'В 100 граммах\n69 ккал • Б 0.7 г • Ж 0.2 г • У 18 г', desc: '🍇 Источник антиоксидантов, укрепляет сердце и сосуды.' },
    'Виноград темный (без косточек)': { kbju: 'В 100 граммах\n70 ккал • Б 0.6 г • Ж 0.2 г • У 18 г', desc: '🍇 Содержит ресвератрол — мощный антиоксидант для молодости кожи и сосудов.' },
    'Виноград черный (Мерседес)': { kbju: 'В 100 граммах\n72 ккал • Б 0.7 г • Ж 0.2 г • У 17 г', desc: '🍇 Благотворно влияет на сердце и иммунную систему.' },
    'Нектарин Узбекистан красный': { kbju: 'В 100 граммах\n44 ккал • Б 1.1 г • Ж 0.3 г • У 10 г', desc: '🍑 Богат витамином A и антиоксидантами, поддерживает здоровье кожи.' },
    'Нектарин Турция': { kbju: 'В 100 граммах\n45 ккал • Б 1 г • Ж 0.3 г • У 10 г', desc: '🍑 Улучшает обмен веществ и способствует здоровому пищеварению.' },
    'Нектарин Узбекистан желтый (вкус лимон)': { kbju: 'В 100 граммах\n45 ккал • Б 1 г • Ж 0.3 г • У 10 г', desc: '🍑 Сочный и ароматный фрукт, укрепляет иммунитет и придаёт энергии.' },
    'Нектарин Узбекистан зеленый': { kbju: 'В 100 граммах\n44 ккал • Б 1.1 г • Ж 0.3 г • У 10 г', desc: '🍑 Освежает и помогает очищать организм.' },
    'Банан': { kbju: 'В 100 граммах\n89 ккал • Б 1.1 г • Ж 0.3 г • У 23 г', desc: '🍌 Источник калия и магния — поддерживает сердце и нервную систему.' },
    'Слива 4 вида': { kbju: 'В 100 граммах\n46 ккал • Б 0.7 г • Ж 0.3 г • У 11 г', desc: '🍑 Помогает очищать кишечник, богата антиоксидантами и витамином C.' },
    'Черешня': { kbju: 'В 100 граммах\n63 ккал • Б 1.1 г • Ж 0.2 г • У 16 г', desc: '🍒 Укрепляет сосуды, улучшает сон и настроение.' },
    'Голубика': { kbju: 'В 100 граммах\n57 ккал • Б 0.7 г • Ж 0.3 г • У 14 г', desc: '🫐 Один из лучших антиоксидантов, улучшает память и зрение.' },
    'Абрикос Армения': { kbju: 'В 100 граммах\n48 ккал • Б 1.4 г • Ж 0.4 г • У 11 г', desc: '🍑 Богат бета-каротином, улучшает зрение и состояние кожи.' },
    'Абрикос Киргизия': { kbju: 'В 100 граммах\n48 ккал • Б 1.4 г • Ж 0.4 г • У 11 г', desc: '🍑 Поддерживает работу печени и способствует выработке коллагена.' },
    'Персик Ташкент': { kbju: 'В 100 граммах\n39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г', desc: '🍑 Помогает очищению организма и укрепляет иммунитет.' },
    'Персик Армения': { kbju: 'В 100 граммах\n39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г', desc: '🍑 Источник витаминов A и E, улучшает состояние кожи и волос.' },
    'Персик Турция': { kbju: 'В 100 граммах\n39 ккал • Б 0.9 г • Ж 0.3 г • У 10 г', desc: '🍑 Поддерживает обмен веществ и восполняет запасы антиоксидантов.' },
    'Персик Инжирный': { kbju: 'В 100 граммах\n40 ккал • Б 0.9 г • Ж 0.3 г • У 10 г', desc: '🍑 Сладкий и нежный, помогает при усталости и стрессах.' },
    'Киви': { kbju: 'В 100 граммах\n41 ккал • Б 1.1 г • Ж 0.5 г • У 10 г', desc: '🥝 Содержит больше витамина C, чем апельсин, укрепляет иммунитет и улучшает пищеварение.' },
    'Лимон': { kbju: 'В 100 граммах\n29 ккал • Б 1.1 г • Ж 0.3 г • У 9 г', desc: '🍋 Мощный антиоксидант, очищает организм и улучшает обмен веществ.' },
    'Картофель Чувашия': { kbju: 'В 100 граммах\n77 ккал • Б 2 г • Ж 0.1 г • У 17 г', desc: '🥔 Источник калия и витамина B6, даёт энергию и поддерживает нервную систему.' },
    'Картофель Краснодар': { kbju: 'В 100 граммах\n77 ккал • Б 2 г • Ж 0.1 г • У 17 г', desc: '🥔 Полезен при физических нагрузках, содержит клетчатку и антиоксиданты.' },
    'Морковь Волгоград': { kbju: 'В 100 граммах\n41 ккал • Б 0.9 г • Ж 0.2 г • У 10 г', desc: '🥕 Богата бета-каротином, улучшает зрение и укрепляет кожу.' },
    'Лук репчатый Волгоград': { kbju: 'В 100 граммах\n40 ккал • Б 1.1 г • Ж 0.1 г • У 9.3 г', desc: '🧅 Повышает иммунитет, обладает противомикробными свойствами.' },
    'Лук зеленый': { kbju: 'В 100 граммах\n32 ккал • Б 1.8 г • Ж 0.2 г • У 7.3 г', desc: '🌱 Источник витамина C, железа и кальция, помогает укрепить кости.' },
    'Укроп, петрушка': { kbju: 'В 100 граммах\n43 ккал • Б 3 г • Ж 0.4 г • У 8 г', desc: '🌱 Улучшают пищеварение, освежают дыхание и снабжают организм витаминами.' },
    'Кинза': { kbju: 'В 100 граммах\n23 ккал • Б 2.1 г • Ж 0.5 г • У 3.7 г', desc: '🌿 Способствует выведению тяжёлых металлов и поддерживает детоксикацию организма.' },
    'Базелик (пучок)': { kbju: 'В 100 граммах\n22 ккал • Б 3.2 г • Ж 0.6 г • У 2.6 г', desc: '🌿 Богат эфирными маслами, улучшает настроение и пищеварение.' },
    'Чеснок Ташкент': { kbju: 'В 100 граммах\n149 ккал • Б 6.4 г • Ж 0.5 г • У 33 г', desc: '🧄 Мощный природный антибиотик, укрепляет иммунитет и сердце.' },
    'Перец болгарский': { kbju: 'В 100 граммах\n27 ккал • Б 1.3 г • Ж 0.2 г • У 6 г', desc: '🫑 Один из лучших источников витамина C, повышает иммунитет и улучшает кожу.' },
    'Перец чили': { kbju: 'В 100 граммах\n40 ккал • Б 2 г • Ж 0.4 г • У 9 г', desc: '🌶️ Улучшает обмен веществ и способствует сжиганию калорий.' },
    'Помидоры Азербайджанские': { kbju: 'В 100 граммах\n18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г', desc: '🍅 Богаты ликопином, поддерживают сердце и защищают клетки от старения.' },
    'Помидоры Ростовские': { kbju: 'В 100 граммах\n18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г', desc: '🍅 Отличный источник антиоксидантов и витамина C.' },
    'Помидоры Волгоград (мелкие)': { kbju: 'В 100 граммах\n18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г', desc: '🍅 Улучшают обмен веществ и укрепляют иммунную систему.' },
    'Помидоры домашние': { kbju: 'В 100 граммах\n18 ккал • Б 0.9 г • Ж 0.2 г • У 3.9 г', desc: '🍅 Содержат натуральный ликопин, защищают клетки от старения.' },
    'Помидоры Астрахань (желтые)': { kbju: 'В 100 граммах\n20 ккал • Б 1 г • Ж 0.2 г • У 4 г', desc: '🍅 Мягче по кислотности, подходят для людей с чувствительным желудком.' },
    'Огурцы Московские': { kbju: 'В 100 граммах\n15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г', desc: '🥒 Состоят на 95 % из воды, очищают организм и улучшают состояние кожи.' },
    'Огурцы Самарские': { kbju: 'В 100 граммах\n15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г', desc: '🥒 Помогают вывести лишнюю жидкость и тонизируют.' },
    'Огурцы домашние': { kbju: 'В 100 граммах\n15 ккал • Б 0.8 г • Ж 0.1 г • У 3.6 г', desc: '🥒 Поддерживают баланс жидкости и электролитов в организме.' },
    'Кабачок': { kbju: 'В 100 граммах\n24 ккал • Б 1.5 г • Ж 0.3 г • У 4.6 г', desc: '🥒 Легко усваивается, богат клетчаткой и витаминами группы B.' },
    'Баклажан': { kbju: 'В 100 граммах\n25 ккал • Б 1 г • Ж 0.2 г • У 6 г', desc: '🍆 Содержит антиоксиданты, снижает уровень холестерина и поддерживает сердце.' },
    'Лимон': { kbju: 'В 100 граммах\n29 ккал • Б 1.1 г • Ж 0.3 г • У 9 г', desc: '🍋 Мощный антиоксидант, очищает организм и улучшает обмен веществ.' }
  };

  /* ====== State & refs ====== */
  let cart = [];
  let visibleProducts = products.slice();
  let currentFilter = 'all';

  const catalogEl = document.getElementById('catalog');
  const shownCountEl = document.getElementById('shown-count');
  const filtersWrap = document.getElementById('filters');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  const mobileSearchInput = document.getElementById('mobile-search-input');
  const mobileSort = document.getElementById('mobile-sort');
  const fabOpen = document.getElementById('fab-open');
  const searchPanel = document.getElementById('search-panel');

  const floatingCart = document.getElementById('floating-cart');
  const fcCountEl = document.getElementById('fc-count');
  const fcTotalEl = document.getElementById('fc-total');

  const cartPanel = document.getElementById('cart-panel');
  const cartItemsEl = document.getElementById('cart-items');
  const cartSumEl = document.getElementById('cart-sum');
  const cartCountSmall = document.getElementById('cart-count-2');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const clearCartBtn = document.getElementById('clear-cart');
  const gotoCheckoutBtn = document.getElementById('goto-checkout');

  /* helpers */
  function idify(s){ return String(s).replace(/\W+/g,'_'); }
  function formatRub(v){ return Math.round(v) + ' ₽'; }
  function displayQty(kg){ if(kg<1) return Math.round(kg*1000) + ' г'; return kg.toFixed(2) + ' кг'; }
  function randInt(max){ return Math.floor(Math.random()*max); }

  /* transliterate/slugify for images */
  function transliterate(str){ if(!str) return ''; const map = { 'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya' }; return String(str).split('').map(ch=>{ const lower = ch.toLowerCase(); if(map[lower] !== undefined) return map[lower]; if(/[a-z0-9]/i.test(ch)) return ch; if(/\s/.test(ch)) return '-'; return ''; }).join(''); }
  function slugify(name){ return transliterate(name).toLowerCase().replace(/[^a-z0-9\-]+/g,'-').replace(/^-+|-+$/g,''); }

  function tryLoadImage(imgEl, name){ if(!imgEl) return; const exts = ['.webp','.jpg','.jpeg','.png']; const candidates = []; const slug = slugify(name || ''); if(slug){ exts.forEach(ext => candidates.push('images/' + slug + ext)); } const encoded = encodeURIComponent(name || ''); if(encoded){ exts.forEach(ext => candidates.push('images/' + encoded + ext)); } if(name && /^[\x00-\x7F]+$/.test(name)){ exts.forEach(ext => candidates.push('images/' + name + ext)); } candidates.push('images/noimage.png'); let idx = 0; function tryNext(){ if(idx >= candidates.length){ imgEl.src = 'images/noimage.png'; imgEl.onload = ()=> imgEl.style.opacity = '1'; return; } const url = candidates[idx]; const tester = new Image(); tester.onload = () => { imgEl.src = url; imgEl.onload = ()=> imgEl.style.opacity = '1'; }; tester.onerror = () => { idx++; tryNext(); }; tester.src = url; } tryNext(); }

  function getLabel(it){ if(!it) return ''; if(Array.isArray(it)) return it[0]||it[1]||''; return it.label||it.name||''; }
  function getName(it){ if(!it) return ''; if(Array.isArray(it)) return it[1]||it[0]||''; return it.name||it.label||''; }
  function getPrice(it){ if(!it) return 0; if(Array.isArray(it)) return Number(it[2]||0); return Number(it.price||0); }
  function getCategory(it){ if(!it) return ''; if(Array.isArray(it)) return it[3]||''; return it.category||''; }

  /* ====== Product modal (created dynamically) ====== */
  function createProductModal(){
    if(document.getElementById('product-modal')) return;
    const md = document.createElement('div'); md.id = 'product-modal'; md.className = 'product-modal';
    md.innerHTML = `
      <div class="panel">
        <button id="pm-close" style="float:right;background:transparent;border:0;font-size:18px;cursor:pointer">✕</button>
        <h3 id="pm-title"></h3>
        <div class="pm-top">
          <img id="pm-img" class="pm-img" alt="">
          <div style="flex:1">
            <div class="kbju-label">В 100 граммах</div>
            <div id="pm-kbju" class="kbju"></div>
            <button id="pm-toggle-desc" style="margin-top:8px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:#fff;cursor:pointer">Подробнее о товаре</button>
            <div id="pm-desc" class="prod-desc" style="display:none"></div>
            <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
              <input id="pm-qty" type="number" min="1" step="1" value="1" style="width:72px;padding:6px;border-radius:8px;border:1px solid var(--border)">
              <select id="pm-unit" style="padding:8px;border-radius:8px;border:1px solid var(--border)"><option value="kg">кг</option><option value="g">гр</option></select>
              <button id="pm-add" class="add-to-cart">Добавить в корзину</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(md);

    // wiring
    document.getElementById('pm-close').addEventListener('click', ()=> closeProductModal());
    document.getElementById('pm-toggle-desc').addEventListener('click', ()=> {
      const d = document.getElementById('pm-desc'); d.style.display = d.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('pm-add').addEventListener('click', ()=> {
      const name = document.getElementById('pm-title').dataset.pname;
      const qty = parseFloat(document.getElementById('pm-qty').value) || 0;
      const unit = document.getElementById('pm-unit').value;
      const qtyKg = unit === 'g' ? qty/1000 : qty;
      if(qtyKg <= 0) return alert('Укажите количество');
      const price = findPriceByName(name);
      addToCart({ name, price, qtyKg });
      closeProductModal();
    });
  }

  function openProductModal(item){
    createProductModal();
    const md = document.getElementById('product-modal');
    const title = document.getElementById('pm-title');
    const img = document.getElementById('pm-img');
    const kbjuEl = document.getElementById('pm-kbju');
    const descEl = document.getElementById('pm-desc');

    const label = getLabel(item);
    const name = getName(item);
    title.textContent = label;
    title.dataset.pname = name;
    tryLoadImage(img, name);

    const info = kbjuData[name];
    if(info){ kbjuEl.textContent = info.kbju; descEl.textContent = info.desc; descEl.style.display = 'none'; }
    else { kbjuEl.textContent = 'Информация недоступна'; descEl.textContent = 'Описание отсутствует'; descEl.style.display = 'none'; }

    md.style.display = 'flex';
  }
  function closeProductModal(){ const md = document.getElementById('product-modal'); if(md) md.style.display = 'none'; }

  function findPriceByName(name){ const idx = products.findIndex(pp => getName(pp) === name); return idx !== -1 ? getPrice(products[idx]) : 0; }

  /* ====== Render catalog ====== */
  function renderCatalog(list){
    if(!catalogEl) return; catalogEl.innerHTML = '';
    list.forEach((p, idxVisible) => {
      const label = getLabel(p); const name = getName(p); const price = getPrice(p); const category = getCategory(p);
      let globalIdx = products.findIndex(pp => getName(pp) === name && getPrice(pp) === price && String(getCategory(pp)) === String(category));
      if(globalIdx === -1) globalIdx = idxVisible;

      const card = document.createElement('div');
      card.className = 'card fade-in';
      card.innerHTML = `
        <div class="photo"><img alt="${name}" loading="lazy"></div>
        <div class="info">
          <div class="name">${label}</div>
          <div class="desc">${name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">
            <div class="price">${price} ₽/кг</div>
            <div class="actions">
              <input class="qty-input" type="number" min="1" step="1" value="1" title="Кол-во">
              <select class="unit-select" title="Единица"><option value="kg">кг</option><option value="g">гр</option></select>
              <button class="add-to-cart" data-idx="${idxVisible}" data-global-idx="${globalIdx}">В корзину</button>
            </div>
          </div>
          <div class="reco small" data-idx="${idxVisible}"></div>
        </div>
      `;
      catalogEl.appendChild(card);

      // load image
      const img = card.querySelector('img'); tryLoadImage(img, name);

      // recommendations
      const others = products.map((pp,i)=> i !== globalIdx ? pp : null).filter(Boolean);
      const picks = [];
      while(picks.length < 2 && others.length){ const k = randInt(others.length); picks.push(others.splice(k,1)[0]); }
      const recoEl = card.querySelector('.reco'); if(picks.length) recoEl.textContent = 'Рекомендуем: ' + picks.map(x=>getName(x)).join(', ');

      // click on card opens modal except when clicking 'add-to-cart' or inputs
      card.addEventListener('click', (e) => {
        if(e.target.closest('.add-to-cart') || e.target.closest('input') || e.target.closest('select')) return; // don't open modal
        openProductModal(p);
      });
    });
    if(shownCountEl) shownCountEl.textContent = list.length;
  }

  /* ====== Cart logic ====== */
  function addToCart(productObj){
    const existing = cart.find(i => i.name === productObj.name && JSON.stringify(i.components||[]) === JSON.stringify(productObj.components||[]));
    if(existing){ existing.qtyKg += productObj.qtyKg; existing.total = existing.qtyKg * existing.price; }
    else { cart.push({ id: idify(productObj.name) + '_' + Math.random().toString(36).slice(2,8), name: productObj.name, price: productObj.price, qtyKg: productObj.qtyKg, total: productObj.qtyKg * productObj.price, components: productObj.components || null }); }
    renderCart();
  }
  function removeFromCart(id){ cart = cart.filter(i => i.id !== id); renderCart(); }
  function clearCart(){ cart = []; renderCart(); }

  function renderCart(){
    if(!cartItemsEl) return; cartItemsEl.innerHTML = ''; let sum = 0;
    cart.forEach(item => {
      sum += item.total;
      const row = document.createElement('div'); row.className = 'cart-row';
      row.innerHTML = `
        <div class="left"><div style="font-weight:700">${item.name}${item.components ? ' (Custom)' : ''}</div><div class="small" style="color:var(--muted)">${displayQty(item.qtyKg)} • ${formatRub(item.total)}</div></div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><button style="background:transparent;border:0;cursor:pointer;color:${'#e74c3c'}" data-remove="${item.id}">✕</button><div style="font-weight:700">${formatRub(item.total)}</div></div>
      `;
      cartItemsEl.appendChild(row);
    });

    if(cartSumEl) cartSumEl.textContent = formatRub(sum);
    if(cartCountSmall) cartCountSmall.textContent = cart.length;
    if(fcCountEl) fcCountEl.textContent = cart.length + ' поз.';
    if(fcTotalEl) fcTotalEl.textContent = formatRub(sum);

    if(cart.length > 0) showFloatingCart(); else hideFloatingCart();

    cartItemsEl.querySelectorAll('[data-remove]').forEach(btn => { btn.onclick = ()=> removeFromCart(btn.dataset.remove); });
  }

  /* floating cart */
  function showFloatingCart(){ if(!floatingCart) return; floatingCart.classList.add('visible'); }
  function hideFloatingCart(){ if(!floatingCart) return; floatingCart.classList.remove('visible'); }

  /* delegation: add to cart from catalog */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart'); if(!btn) return;
    const idxVisible = +btn.dataset.idx; const idxGlobal = btn.dataset.globalIdx !== undefined ? +btn.dataset.globalIdx : null;
    const card = btn.closest('.card'); const qtyInput = card.querySelector('.qty-input'); const unitSelect = card.querySelector('.unit-select');
    const qty = parseFloat(qtyInput.value) || 0; const unit = unitSelect.value; let qtyKg = unit === 'g' ? qty/1000 : qty; if(qtyKg <= 0) return;
    const source = (visibleProducts && visibleProducts[idxVisible]) || products[idxGlobal] || products[idxVisible]; const name = getName(source); const price = getPrice(source);
    addToCart({ name, price, qtyKg });

    // small check animation
    const ck = document.createElement('div'); ck.className = 'checkmark'; ck.textContent = '✓'; const c = card; c.style.position = 'relative'; c.appendChild(ck);
    setTimeout(()=>{ ck.style.opacity = '1'; ck.style.transform = 'scale(1)'; }, 10);
    setTimeout(()=>{ ck.style.opacity = '0'; ck.style.transform = 'scale(.6)'; }, 900);
    setTimeout(()=>{ ck.remove(); }, 1200);
  });

  /* floating cart <-> panel */
  let cartOpen = false;
  function showCartPanel(){ cartPanel.classList.add('show'); cartPanel.setAttribute('aria-hidden','false'); cartOpen = true; hideFloatingCart(); }
  function hideCartPanel(){ cartPanel.classList.remove('show'); cartPanel.setAttribute('aria-hidden','true'); cartOpen = false; setTimeout(()=> showFloatingCart(), 120); }
  if(floatingCart) floatingCart.addEventListener('click', ()=> { if(!cartOpen) showCartPanel(); else hideCartPanel(); });
  if(cartCloseBtn) cartCloseBtn.addEventListener('click', ()=> hideCartPanel());
  document.addEventListener('click', (e)=> { if(!cartPanel.classList.contains('show')) return; if(e.target.closest('#cart-panel') || e.target.closest('#floating-cart')) return; hideCartPanel(); });
  if(clearCartBtn) clearCartBtn.addEventListener('click', ()=> { clearCart(); hideCartPanel(); });

  /* filters / search / sort */
  function applySearchAndSort(){ const q = (searchInput && searchInput.value || '').trim().toLowerCase(); let list = (currentFilter === 'all' || !currentFilter) ? products.slice() : products.filter(p => String(getCategory(p)) === String(currentFilter)); if(q){ list = list.filter(p => (((getLabel(p) || '') + ' ' + (getName(p) || '')).toLowerCase().indexOf(q) !== -1)); } const s = (sortSelect && sortSelect.value) || 'default'; if(s === 'price_asc') list.sort((a,b)=> getPrice(a) - getPrice(b)); else if(s === 'price_desc') list.sort((a,b)=> getPrice(b) - getPrice(a)); else if(s === 'name_asc') list.sort((a,b)=> String(getName(a)).localeCompare(String(getName(b)),'ru')); else if(s === 'name_desc') list.sort((a,b)=> String(getName(b)).localeCompare(String(getName(a)),'ru')); visibleProducts = list; renderCatalog(visibleProducts); }

  if(filtersWrap){ filtersWrap.addEventListener('click', (e)=> { const b = e.target.closest('.filter-btn'); if(!b) return; const f = b.dataset.filter || 'all'; currentFilter = f; document.querySelectorAll('#filters .filter-btn').forEach(x=> x.classList.toggle('active', x === b)); applySearchAndSort(); }); }
  if(searchInput) searchInput.addEventListener('input', ()=> applySearchAndSort());
  if(sortSelect) sortSelect.addEventListener('change', ()=> applySearchAndSort());

  if(fabOpen){ fabOpen.addEventListener('click', ()=> { if(searchPanel) { searchPanel.classList.toggle('open'); mobileSearchInput && mobileSearchInput.focus(); } }); }
  const closeSearchPanelBtn = document.getElementById('close-search-panel'); if(closeSearchPanelBtn){ closeSearchPanelBtn.addEventListener('click', ()=> { if(searchPanel) searchPanel.classList.remove('open'); }); }
  if(mobileSearchInput){ mobileSearchInput.addEventListener('input', ()=> { if(searchInput) searchInput.value = mobileSearchInput.value; applySearchAndSort(); }); }
  if(mobileSort){ mobileSort.addEventListener('change', ()=> { if(sortSelect) sortSelect.value = mobileSort.value; applySearchAndSort(); }); }

  /* checkout button (opens checkout modal existing in page with id 'modal') */
  const gotoCheckout = document.getElementById('goto-checkout'); if(gotoCheckout){ gotoCheckout.addEventListener('click', ()=> {
    if(cart.length === 0){ alert('Корзина пуста — добавьте товары.'); return; }
    const modal = document.getElementById('modal'); const modalOrderList = document.getElementById('modal-order-list'); const modalTotal = document.getElementById('modal-total');
    if(modal && modalOrderList && modalTotal){ modalOrderList.innerHTML = ''; let sum = 0; cart.forEach(i => { const el = document.createElement('div'); el.style.padding='6px 4px'; el.innerHTML = `<div style="font-weight:700">${i.name}</div><div style="color:var(--muted)">${displayQty(i.qtyKg)} • ${formatRub(i.total)}</div>`; modalOrderList.appendChild(el); sum += i.total; }); modalTotal.textContent = formatRub(sum); hideCartPanel(); modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); }
  }); }

  /* order form submit handled in page script already; keep compatibility */

  /* hero buttons */
  const heroOrderBtn = document.getElementById('hero-order'); const viewCatalogBtn = document.getElementById('view-catalog'); if(heroOrderBtn) heroOrderBtn.addEventListener('click', ()=> window.scrollTo({top: document.querySelector('.main').offsetTop - 20, behavior:'smooth'})); if(viewCatalogBtn) viewCatalogBtn.addEventListener('click', ()=> window.scrollTo({top: document.querySelector('.main').offsetTop - 20, behavior:'smooth'}));

  /* init */
  function init(){ visibleProducts = products.slice(); renderCatalog(visibleProducts); renderCart(); if(tg && typeof tg.expand === 'function') tg.expand(); hideFloatingCart(); }
  init();

});
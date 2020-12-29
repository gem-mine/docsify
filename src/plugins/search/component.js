import {search} from './search'

let NO_DATA_TEXT = ''

function style() {
  const code = `
.sidebar {
  padding-top: 0;
}

.search {
  margin-bottom: 20px;
  padding: 6px;
  border-bottom: 1px solid #eee;
}

.search .input-wrap {
  display: flex;
  align-items: center;
}

.search-results-panel {
  display: none;
  position: absolute;
  height: calc(100vh - 100px);
  overflow-y: auto;
  width: calc(100% - 90px);
  background: #fff;
  z-index: 9999999;
}

.search-results-panel.show ~ * {
  display: none;
}

.search-results-panel h2, .search-results-panel p {
  color: #000;
}

.search-results-panel h2 {
  margin: 0;
  padding: 5px;
}

.search-results-panel .empty {
  padding: 50px 25px;
  text-align: center;
  font-size: 24px;
  color: var(--notice-important-border-color, var(--notice-border-color));
}

.search-results-panel p {
  margin: 0;
}

.search-results-panel .matching-post {
  padding: 10px 15px;
  margin: 0;
}

.search-results-panel .matching-post:hover {
  background: #e6f7ff;
}

.search-results-panel em {
  color: var(--theme-color, #4a97ec);
  font-weight: bold;
}

.search-results-panel.show {
  display: block;
}

@media (max-width: 47.99em) {
  .search-results-panel {
    left: 0;
    top: 128px;
    max-width: 100%;
  }
}

.search input {
  outline: none;
  border: none;
  width: 100%;
  padding: 0 7px;
  line-height: 36px;
  font-size: 14px;
}

.search input::-webkit-search-decoration,
.search input::-webkit-search-cancel-button,
.search input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.search .clear-button {
  width: 36px;
  text-align: right;
  display: none;
}

.search .clear-button.show {
  display: block;
}

.search .clear-button svg {
  transform: scale(.5);
}

.search h2 {
  font-size: 17px;
  margin: 10px 0;
}

.search a {
  text-decoration: none;
  color: inherit;
}

.search .matching-post {
  border-bottom: 1px solid #eee;
}

.search .matching-post:last-child {
  border-bottom: 0;
}

.search p {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.app-name.hide, .sidebar-nav.hide {
  display: none;
}`

  Docsify.dom.style(code)
}

function tpl(defaultValue = '') {
  const html =
    `<div class="input-wrap">
      <input type="search" value="${defaultValue}" />
      <div class="clear-button">
        <svg width="26" height="24">
          <circle cx="12" cy="12" r="11" fill="#ccc" />
          <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75" />
          <path stroke="white" stroke-width="2"d="M8.25,15.75,15.75,8.25" />
        </svg>
      </div>
    </div>
    </div>`
  const el = Docsify.dom.create('div', html)
  const searchContainer = Docsify.dom.find('.docsify-search-container')
  Docsify.dom.toggleClass(el, 'search')
  Docsify.dom.appendTo(searchContainer, el)
}

function createSearchPanel() {
  const main = Docsify.dom.find('article#main')
  let searchPanel = Docsify.dom.find(main, '.search-results-panel')

  if (searchPanel) {
    return searchPanel
  }

  searchPanel = Docsify.dom.create('div')
  Docsify.dom.toggleClass(searchPanel, 'search-results-panel')
  Docsify.dom.before(main, searchPanel)

  return searchPanel
}

function doSearch(value) {
  const $search = Docsify.dom.find('div.search')
  const $panel = createSearchPanel()
  const $clearBtn = Docsify.dom.find($search, '.clear-button')

  const pageToc = Docsify.dom.find('main .toc-nav')

  if (!value) {
    $panel.classList.remove('show')
    $clearBtn.classList.remove('show')
    $panel.innerHTML = ''
    if (pageToc) {
      pageToc.classList.remove('hide')
    }

    return
  }

  const matchs = search(value)

  let html = ''
  matchs.forEach(post => {
    html += `<div class="matching-post">
<a href="${post.url}">
<h2>${post.title}</h2>
<p>${post.content}</p>
</a>
</div>`
  })

  $panel.classList.add('show')
  $clearBtn.classList.add('show')
  $panel.innerHTML = html || `<p class="empty">${NO_DATA_TEXT}</p>`
  if (pageToc) {
    pageToc.classList.add('hide')
  }
}

function bindEvents() {
  const $search = Docsify.dom.find('div.search')
  const $input = Docsify.dom.find($search, 'input')
  const $inputWrap = Docsify.dom.find($search, '.input-wrap')

  let timeId
  // Prevent to Fold sidebar
  Docsify.dom.on(
    $search,
    'click',
    e => e.target.tagName !== 'A' && e.stopPropagation()
  )
  Docsify.dom.on($input, 'input', e => {
    clearTimeout(timeId)
    timeId = setTimeout(_ => doSearch(e.target.value.trim()), 100)
  })
  Docsify.dom.on($inputWrap, 'click', e => {
    // Click input outside
    if (e.target.tagName !== 'INPUT') {
      $input.value = ''
      doSearch()
    }
  })

  var $body = Docsify.dom.find('body')
  Docsify.dom.on($body, 'click', function () {
    // Click input outside result panel
    if ($input.value !== '') {
      $input.value = ''
      doSearch()
    }
  })
}

function updatePlaceholder(text, path) {
  const $input = Docsify.dom.getNode('.search input[type="search"]')

  if (!$input) {
    return
  }

  if (typeof text === 'string') {
    $input.placeholder = text
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0]
    $input.placeholder = text[match]
  }
}

function updateNoData(text, path) {
  if (typeof text === 'string') {
    NO_DATA_TEXT = text
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0]
    NO_DATA_TEXT = text[match]
  }
}

function updateOptions(opts) {
  options = opts
}

export function init(opts, vm) {
  const keywords = vm.router.parse().query.s

  updateOptions(opts)
  style()
  tpl(keywords)
  bindEvents()
  keywords && setTimeout(_ => doSearch(keywords), 500)
}

export function update(opts, vm) {
  updateOptions(opts)
  updatePlaceholder(opts.placeholder, vm.route.path)
  updateNoData(opts.noData, vm.route.path)
}

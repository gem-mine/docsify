import {isMobile} from '../util/env'

/**
 * Render main content
 */
export function main() {
  const aside =
    '<button class="sidebar-toggle">' +
    '<div class="sidebar-toggle-button">' +
    '<span></span><span></span><span></span>' +
    '</div>' +
    '</button>' +
    '<aside class="sidebar">' +
    '<div class="sidebar-nav"><!--sidebar--></div>' +
    '</aside>'

  return (
    (isMobile ? `${aside}<main>` : `<main>${aside}`) +
    '<section class="content">' +
    '<article class="markdown-section" id="main"><!--main--></article>' +
    '</section>' +
    '</main>'
  )
}

/**
 * Cover Page
 */
export function cover() {
  const SL = ', 100%, 85%'
  const bgc =
    'linear-gradient(to left bottom, ' +
    `hsl(${Math.floor(Math.random() * 255) + SL}) 0%,` +
    `hsl(${Math.floor(Math.random() * 255) + SL}) 100%)`

  return (
    `<section class="cover show" style="background: ${bgc}">` +
    '<div class="cover-main"><!--cover--></div>' +
    '<div class="mask"></div>' +
    '</section>'
  )
}

/**
 * Render tree
 * @param  {Array} tree
 * @param  {String} tpl
 * @return {String}
 */
export function tree(toc, tpl = '<ul class="app-sub-sidebar">{inner}</ul>') {
  if (!toc || !toc.length) {
    return ''
  }

  let innerHTML = ''
  toc.forEach(node => {
    innerHTML += `<li><a class="section-link" href="${node.slug}">${node.title}</a></li>`
    if (node.children) {
      innerHTML += tree(node.children, tpl)
    }
  })
  return tpl.replace('{inner}', innerHTML)
}

export function helper(className, content) {
  return `<p class="${className}">${content.slice(5).trim()}</p>`
}

export function theme(color) {
  return `<style>:root{--theme-color: ${color};}</style>`
}

export function nav(title, titleImgURL, repo) {
  if (!repo) {
    return ''
  }

  if (!/\/\//.test(repo)) {
    repo = 'https://github.com/' + repo
  }

  repo = repo.replace(/^git\+/, '')

  const repoHTML =
    '<span id="github-btn" class="github-btn">' +
    `<a class="gh-btn" href="${repo}" target="_blank">` +
    '<span class="gh-ico" aria-hidden="true">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="12 12 40 40"><path fill="#333" d="M32 13.4c-10.5 0-19 8.5-19 19 0 8.4 5.5 15.5 13 18 1 .2 1.3-.4 1.3-.9v-3.2c-5.3 1.1-6.4-2.6-6.4-2.6-.9-2.1-2.1-2.7-2.1-2.7-1.7-1.2.1-1.1.1-1.1 1.9.1 2.9 2 2.9 2 1.7 2.9 4.5 2.1 5.5 1.6.2-1.2.7-2.1 1.2-2.6-4.2-.5-8.7-2.1-8.7-9.4 0-2.1.7-3.7 2-5.1-.2-.5-.8-2.4.2-5 0 0 1.6-.5 5.2 2 1.5-.4 3.1-.7 4.8-.7 1.6 0 3.3.2 4.7.7 3.6-2.4 5.2-2 5.2-2 1 2.6.4 4.6.2 5 1.2 1.3 2 3 2 5.1 0 7.3-4.5 8.9-8.7 9.4.7.6 1.3 1.7 1.3 3.5v5.2c0 .5.4 1.1 1.3.9 7.5-2.6 13-9.7 13-18.1 0-10.5-8.5-19-19-19z"/></svg>' +
    '</span>' +
    '</a>' +
    '</span>'

  return `<div class="title">
    <a href="#/">
      ${titleImgURL ? `<img src=${titleImgURL}/>` : ''}
      <span>${title}</span>
    </a>
    ${isMobile ? '<div class="show-nav-content">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896" focusable="false" data-icon="unordered-list" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0z"></path></svg>' +
    '</div>' : ''}
  </div>` +
  (isMobile ? '<div class="nav-menu">' : '') +
  '<div class="docsify-search-container"></div>' +
  '<div class="nav-content"></div>' +
  repoHTML +
  (isMobile ? '</div>' : '')
}

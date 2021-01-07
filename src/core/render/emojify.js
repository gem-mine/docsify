import {inBrowser} from '../util/env'

function replace(m, $1) {
  return '<img class="emoji" src="https://github.githubassets.com/images/icons/emoji/' + $1 + '.png" alt="' + $1 + '" />'
}

function replaceFontAwesome(m, $1) {
  return '<i class="' + $1 + '"></i>'
}

export function emojify(text) {
  return text
    .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, m => m.replace(/:/g, '__colon__'))
    .replace(/:(\w+?):/ig, (inBrowser && window.emojify) || replace)
    .replace(/:(fa[srldb](\s[\w-]+)\s[\w-]+?):/ig, replaceFontAwesome)
    .replace(/__colon__/g, ':')
}

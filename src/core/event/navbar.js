import * as dom from '../util/dom'
import {isMobile} from '../util/env'

export function toggle() {
  if (!isMobile) {
    return
  }

  const el = dom.getNode('.show-nav-content')
  const body = dom.getNode('body')
  if (el === null) {
    return
  }

  dom.on(el, 'click', () => {
    dom.toggleClass(body, 'show-nav-mobile')
  })
}

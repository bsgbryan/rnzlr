import { type Fiber } from "./types"

export const build = (uow: Fiber) => {
	const dom = document.createElement(uow.tag as keyof HTMLElementTagNameMap)

  for (const [k, v] of Object.entries(uow.attributes ?? {})) {
    if (k === 'text') dom.appendChild(document.createTextNode(v as string))
    else {
      const n = document.createAttribute(k === 'clazz' ? 'class' : k)
      if (k.startsWith('on') && typeof v === 'function')
       	dom.addEventListener(
			   	k.substring(2).toLocaleLowerCase() as keyof HTMLElementEventMap,
			   	v as EventListenerOrEventListenerObject,
			  )
      else if (typeof v === 'string') {
        n.value = v
			  dom.attributes.setNamedItem(n)
      }
    }
  }

  return dom
}

export const update = (
	container: Element,
	previous?: Record<string, string | Function>,
	current?: Record<string, string | Function>,
) => {
	if (previous && current) {
		Object.keys(previous)
			.filter(attr => !(attr in current))
			.filter(attr => !attr.startsWith('on'))
			.forEach(attr => {
				if (attr === "text") container.textContent = ""
				else container.setAttribute(attr, "")
			})

		Object.keys(previous)
			.filter(attr => !(attr in current))
			.filter(attr => attr.startsWith('on'))
			.forEach(attr => {
				container.removeEventListener(
					attr.toLocaleLowerCase().substring(2) as keyof ElementEventMap,
					previous[attr] as (this: Element, ev: Event) => any,
				)
			})

		Object.keys(current)
			.filter(attr => previous[attr] !== current[attr])
			.forEach(attr => {
				if (attr === "text") container.textContent = String(current[attr])
				else container.setAttribute(attr, String(current[attr]))
			})

		Object.keys(current)
			.filter(attr => previous[attr] !== current[attr] && typeof current[attr] === "function")
			.forEach(attr => {
				container.addEventListener(
					attr.toLocaleLowerCase().substring(2) as keyof ElementEventMap,
					current[attr] as (this: Element, ev: Event) => any,
				)
			})
	}
}

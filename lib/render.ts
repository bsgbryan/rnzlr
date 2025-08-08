const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const context: JSX.Element = typeof element.tagName === 'string' ?
		element
		:
		// @ts-expect-error tagName is the function that produces the JSX.Element
		element.tagName()

	const dom = document.createElement(context.tagName)

  for (const [k, v] of Object.entries(context.attribs ?? {})) {
    if (k === 'text') dom.appendChild(document.createTextNode(v as string))
    else {
      const n = document.createAttribute(k === 'clazz' ? 'class' : k)
      n.value = v
      dom.attributes.setNamedItem(n)
    }
  }

  for (const c of context.children ?? []) fun(c, dom)

  container.appendChild(dom)
}

export default fun

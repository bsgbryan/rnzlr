const fun = (
  element: JSX.Element,
  container: Element,
) => {
  const dom = document.createElement(element.tagName)

  for (const [k, v] of Object.entries(element.attribs ?? {})) {
    if (k === 'text') dom.appendChild(document.createTextNode(v as string))
    else {
      const n = document.createAttribute(k === 'clazz' ? 'class' : k)
      n.value = v
      dom.attributes.setNamedItem(n)
    }
  }

  for (const c of element.children ?? []) fun(c, dom)

  container.appendChild(dom)
}

export default fun

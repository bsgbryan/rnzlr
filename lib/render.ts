import { DOMTree, JSX } from "./types"

const dom = (uow: Fiber) => {
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

type Fiber = {
	attributes: Record<string, string | Function>
	container?: Element | undefined
	children?: DOMTree[] | undefined
	child?: Fiber | undefined
	effect?: "CREATE" | "DELETE" | "UPDATE"
	parent?: Fiber | undefined
	previous?: Fiber | undefined
	sibling?: Fiber | undefined
	tag?: string | Function | keyof HTMLElementTagNameMap | undefined
}

let next_uow: Fiber | undefined
let wip_root: Fiber | undefined
let current: Fiber | undefined

const to_delete: Fiber[] = []

const generate = (input: JSX.Element, container: Element) => {
	wip_root = {
		container,
		attributes: input.attributes,
		children: [input],
		previous: current,
		tag: input.tag,
	}

	next_uow = wip_root
}

const updateDom = (
	container: Element,
	previous?: Record<string, string | Function>,
	current?: Record<string, string | Function>,
) => {
	if (previous && current) {
		Object.keys(previous)
			.filter(attr => !(attr in current))
			.filter(attr => !attr.startsWith('on'))
			.forEach(attr => { container.setAttribute(attr, "") })

		Object.keys(previous)
			.filter(attr => !(attr in current))
			.filter(attr => attr.startsWith('on'))
			.forEach(attr => {
				container.removeEventListener(
					attr.toLocaleLowerCase().substring(2) as keyof ElementEventMap,
					previous[attr]  as (this: Element, ev: Event) => any,
				)
			})

		Object.keys(current)
			.filter(attr => previous[attr] !== current[attr] && typeof current[attr] === "string")
			.forEach(attr => { container.setAttribute(attr, current[attr] as string) })

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

const commit = {
	root: () => {
		for (const d of to_delete) commit.work(d)
		if (wip_root && wip_root.child) {
			commit.work(wip_root.child)
			current = wip_root
			wip_root = undefined
		}
	},
	work: (fiber: Fiber) => {
		if (fiber.effect === "CREATE" && fiber.parent?.container && fiber.container)
			fiber.parent.container.appendChild(fiber.container)
		else if (fiber.effect === "DELETE" && fiber.parent?.container && fiber.container)
			fiber.parent.container.removeChild(fiber.container)
		else if (fiber.effect === "UPDATE" && fiber.parent?.container && fiber.container)
			updateDom(fiber.container, fiber.previous?.attributes, fiber.attributes)

		if (fiber.child) commit.work(fiber.child)
		if (fiber.sibling) commit.work(fiber.sibling)
	}
}

const doWork = (deadline: IdleDeadline) => {
	let should_yield = false

	while (next_uow && !should_yield) {
		next_uow = perform_unit_of_work(next_uow)
		should_yield = deadline.timeRemaining() < 1
	}

	if (!next_uow && wip_root) commit.root()

	requestIdleCallback(doWork)
}

requestIdleCallback(doWork)

const reconcile = (uow: Fiber, children?: JSX.Element[]) => {
	let previous: Fiber = {} as Fiber

	for (const [i, e] of (children ?? []).entries()) {
		const same = uow.previous?.child?.tag === e.tag
		let fiber: Fiber | undefined

		if (same)
			fiber = {
				attributes: e.attributes,
				children: e.children,
				container: uow.container,
				effect: 'UPDATE',
				parent: uow,
				previous: uow.previous?.child,
				tag: e.tag,
			}

		if (e && !same)
			fiber = {
				attributes: e.attributes,
				children: e.children,
				effect: 'CREATE',
				parent: uow,
				tag: e.tag,
			}

		if (uow.previous?.child && !same) {
			uow.previous.effect = "DELETE"
			to_delete.push(uow.previous)
		}


		if (i === 0) uow.child = fiber
		else previous.sibling = fiber

		if (fiber) previous = fiber
	}
}

const perform_unit_of_work = (uow: Fiber): Fiber | undefined => {
	if (!uow.container) uow.container = dom(uow)

	reconcile(uow, uow.children)

	if (uow.child) return uow.child

	let next: Fiber | undefined = uow
	while (next) {
		if (next.sibling) return next.sibling

		next = next.parent
	}
}

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	if (typeof element.context === 'function') {
		const callback = (markup: JSX.Element) => {
			fun(markup, container)
		}

		const initial = element.context({ callbacks: { render: callback }})

		generate(initial, container)
	}
	else if (typeof element.tag === 'string') generate(element, container)
}

export default fun

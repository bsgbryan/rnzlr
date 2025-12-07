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
	context?: CallableFunction | undefined
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
		context: input.context,
		previous: current,
		tag: input.tag,
	}

	to_delete.length = 0;

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
					previous[attr]  as (this: Element, ev: Event) => any,
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
		// console.log({fiber})
		// let parent = fiber.parent
		// while (!parent?.container) parent = parent?.parent

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

const doDelete = (fiber: Fiber, parent: Element) => {
	if (fiber.container) parent.removeChild(fiber.container)
	else if (fiber.child) doDelete(fiber.child, parent)
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
	let previous: Fiber | undefined
	let old = uow.previous?.child

	for (const [i, e] of (children ?? []).entries()) {
		const elem = typeof e.context === "function" ?
			e.context({ callbacks: { render: callback(uow.container!) }})
			:
			e;

		const same = old?.tag === elem.tag
		let fiber: Fiber | undefined

		if (same) {
			fiber = {
				attributes: elem.attributes,
				children: elem.children,
				container: old?.container,
				context: uow.context,
				effect: 'UPDATE',
				parent: uow,
				previous: old,
				tag: old?.tag,
			}
			// console.log('UPDATE', fiber)
		}
		else if (elem && !same) {
			fiber = {
				attributes: elem.attributes,
				children: elem.children,
				context: elem.context,
				effect: 'CREATE',
				parent: uow,
				tag: elem.tag,
			}
			// console.log('CREATE', fiber)
		}
		else if (uow.previous && old && !same) {
			old.effect = 'DELETE'
			to_delete.push(uow.previous)
			// console.log('DELETE', uow, old)
		}

		if (old) old = old.sibling

		if (i === 0) uow.child = fiber
		else if (previous) previous.sibling = fiber

		previous = fiber
	}
}

const update = {
	fn: (fiber: Fiber) => {
		if (fiber.context) reconcile(fiber, [fiber.context(fiber.attributes)])
	},
	host: (fiber: Fiber) => {
		if (!fiber.container) fiber.container = dom(fiber)

		reconcile(fiber, fiber.children)
	}
}

const perform_unit_of_work = (uow: Fiber): Fiber | undefined => {
	if (typeof uow.context === 'function') update.fn(uow)
	else update.host(uow)

	if (uow.child) return uow.child

	let next: Fiber | undefined = uow
	while (next) {
		if (next.sibling) return next.sibling

		next = next.parent
	}
}

const callback = (container: Element) =>
	(component: CallableFunction) =>
		(props: object) =>
			fun(component(props), container)

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const elem = typeof element.context === "function" ?
		element.context({ callbacks: { render: callback(container) }})
		:
		element

	generate(elem, container)
}

export default fun

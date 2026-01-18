import callback from './callback'

import { add as mark_for_deletion } from './deletion'

import {
	type Fiber,
	type JSX,
} from './types'

const determineEffect = (
	elem: JSX.Element,
	uow: Fiber,
	old: Fiber | undefined,
) => {
	const same = old?.tag === elem.tag
	let fiber: Fiber | undefined

	if (same) {
		fiber = {
			attributes: elem.attributes,
			children: elem.children,
			container: old?.container,
			context: uow?.context,
			effect: 'UPDATE',
			parent: uow,
			previous: old,
			tag: old?.tag,
		}
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
	}
	else if (old && !same) mark_for_deletion(old)

	return fiber
}

const reconcile = (uow: Fiber) => {
	// On the first iteration of the loop below, this gets
	// initialized.
	// The second iteration of the loop sets uow.child.sibling to fiber
	// (because the first iteration assigns uow.child to fiber *and also*
	// assigns previous to fiber; meaning uow.child and previous are synonymous).
	// Every subsequent iteration assigns sets fiber as the sibling of the
	// current uow.child sibling, and updates previous - so it is the new uow.child
	// being processed.
	// This is an extrmely difficult-to-follow way to setup the sibling chain,
	// but I can' think of a more straightforward way right now...
	let previous: Fiber | undefined
	let old = uow.previous?.child

	for (const [i, e] of (uow.children ?? []).entries()) {
		const elem = typeof e.context === "function" ?
			e.context({ render: callback(uow.container!) })
			:
			e;

		if (elem.tag === 'fragment') {
			for (const [idx, c] of (elem.children ?? []).entries()) {
				const fiber = determineEffect(c, uow, old)

				if (old) old = old.sibling

				if (i === 0 && idx === 0) uow.child = fiber
				else if (previous) previous.sibling = fiber

				previous = fiber
			}
		}
		else {
			const fiber = determineEffect(elem, uow, old)

			if (old) old = old.sibling

			if (i === 0) uow.child = fiber
			// This is, effectively, chaining uow.child.sibling
			else if (previous) previous.sibling = fiber

			// This is setting up uow.child for the next iteration
			// of the loop.
			// uow.child is set to fiber above on line 75, so doing
			// this means that on the next iteration of the loop
			// previous === uow.child; which means
			// previous.sibling === uow.child.sibling
			previous = fiber
		}
	}

	while (old) {
		mark_for_deletion(old)

		if (old) old = old.sibling
	}
}

export default reconcile

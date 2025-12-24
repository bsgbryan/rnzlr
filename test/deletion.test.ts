import {
	beforeEach,
	describe,
	expect,
	it,
	jest,
} from 'bun:test'

import {
	add,
	execute,
	get,
} from '../lib/deletion'

import { Fiber } from '../lib/types'

// This is necessary so execute can complete successfully
const params = {
	attributes: {},
	container: {},
	parent: Object.assign({}, {
		attributes: {},
		container: {
			contains: () => true,
			removeChild: () => {}
		} as unknown as Element
	} as Fiber),
} as Fiber

describe("add", () => {
	beforeEach(execute)

	it("adds the specified fiber to the list", () => {
		const pre = get()

		add(Object.assign({}, params))

		const post = get()

		expect(pre.length).toBe(0)
		expect(post.length).toBe(1)
	})
})

describe("execute", () => {
	beforeEach(execute)

	it("deletes all fibers marked for deletion", () => {
		const stub = jest.fn()
		
		params.parent!.container!.removeChild = stub

		add(Object.assign({}, params))
		add(Object.assign({}, params))
		add(Object.assign({}, params))

		const pre = get()

		execute()

		const post = get()

		expect(pre.length).toBe(3)
		expect(stub).toHaveBeenCalledTimes(3)
		expect(post.length).toBe(0)
	})
})

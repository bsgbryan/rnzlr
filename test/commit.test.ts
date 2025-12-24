import {
	describe,
	expect,
	it,
	jest,
	mock,
} from 'bun:test'

import { work } from '../lib/commit'

import { Fiber } from '../lib/types'

describe("work", () => {
	it("builds the fiber's container if it doesn't already exist", () => {
		const stub = jest.fn()
		mock.module("../lib/dom", () => ({ build: stub }))

		// This Fiber does not have a container,
		// so one needs to be created when commit
		// is invoked
		const fiber: Fiber = { attributes: {} }

		work(fiber)

		expect(stub).toHaveBeenCalledWith(fiber)
	})

	describe("when fiber.effect is 'CREATE', and the fiber and its parent both have containers", () => {
		it("invokes appendChild on the parent's contains, passing the fiber's container", () => {
			const stub = jest.fn()
			const fiberContainer = {
				textContent: "The fiber's container"
			} as Element

			const fiber: Fiber = {
				attributes: {},
				container: fiberContainer,
				effect: "CREATE",
				parent: {
					attributes: {},
					container: { appendChild: stub } as unknown as Element,
				}
			}

			work(fiber)

			expect(stub).toHaveBeenCalledWith(fiberContainer)
		})
	})

	describe("when fiber.effect is 'UPDATE', and the fiber has a container", () => {
		it("invokes dom.update; passing the fiber's container as well as its previous and current attributes", () => {
			const current = { foo: "bar" }
			const previous = { bang: "boom" }
			const container = {
				textContent: "The fiber's container"
			} as Element

			const fiber: Fiber = {
				attributes: current,
				container,
				effect: "UPDATE",
				previous: { attributes: previous },
			}

			const stub = jest.fn()
			mock.module("../lib/dom", () => ({ update: stub }))

			work(fiber)

			expect(stub).toHaveBeenCalledWith(container, previous, current)
		})
	})
})

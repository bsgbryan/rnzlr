import {
	commit,
	next,
	perform,
} from './unit_of_work'

export const idle = (deadline: IdleDeadline) => {
	let should_yield = false

	while (next() && !should_yield) {
		perform()
		should_yield = deadline.timeRemaining() < 1
	}

	commit()

	requestIdleCallback(idle)
}

const work_time = 16.666667;

export const animation = (last_render: number) => {
	let should_yield = false

	while (next() && !should_yield) {
		perform()
		should_yield = performance.now() - last_render < work_time
	}

	commit()

	requestAnimationFrame(animation)
}

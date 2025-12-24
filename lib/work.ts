import {
	commit,
	next,
	perform,
} from './unit_of_work'

const fun = (deadline: IdleDeadline) => {
	let should_yield = false

	while (next() && !should_yield) {
		perform()
		should_yield = deadline.timeRemaining() < 1
	}

	commit()

	requestIdleCallback(fun)
}

export default fun

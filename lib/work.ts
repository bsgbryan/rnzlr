import * as unit_of_work from "./unit_of_work"

const fun = (deadline: IdleDeadline) => {
	let should_yield = false

	while (unit_of_work.next() && !should_yield) {
		unit_of_work.perform()
		should_yield = deadline.timeRemaining() < 1
	}

	unit_of_work.commit()

	requestIdleCallback(fun)
}

export default fun

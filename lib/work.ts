import {
	next,
	perform,
} from './unit_of_work'

const work_time = 16; // ms available for each work iteration

const fun = (last_render: number) => {
	let time_remaining = true

	while (next() && time_remaining) {
		perform()
		time_remaining = (performance.now() - last_render) < work_time
	}

	requestAnimationFrame(fun)
}

export default fun

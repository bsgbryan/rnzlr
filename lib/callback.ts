import { render } from "./index"

const callback = (container: Element) =>
	(component: CallableFunction) =>
		(props: object) =>
			render(component(props), container)

export default callback

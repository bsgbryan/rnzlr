import objectify from './objectify'

export const Fragment = 'fragment'

export const jsx 		= objectify
export const jsxs		= objectify
export const jsxDEV = objectify

export type RenderCallback = (component: CallableFunction, props: object) => void
export type IDCallback = (selector: string, content: string) => void

export type Callbacks = {
	after: (component: JSX.Element) => {
		render: CallableFunction
	}
	id: IDCallback
	render: RenderCallback
}

export declare interface DOMTree {
	tag?: string | Function
	attributes: Record<string, string | Function>
	children?: DOMTree[]
	context?: (callbacks: Callbacks) => JSX.Element
}

export declare namespace JSX {
	export interface Element extends DOMTree {
		callbacks: {
			after: {
				render?: CallableFunction
			}
		}
	}

	interface IntrinsicElements {
		[elem: string]: any
	}

	export interface Props {
		[name: string]: unknown
		children?: object | string
	}
}

export type Fiber = {
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
	callbacks: {
		after: {
			render?: CallableFunction
		}
	}
}

import {
	DOMTree,
	JSX,
} from "./types"

const fun = (
  type: string | Function,
  props: JSX.Props,
): DOMTree => {
  if (typeof type === 'function' && (
    // The component function name for dev builds
    type.name === '__WEBPACK_DEFAULT_EXPORT__'
    ||
    // The component function name is a single letter
    // for production builds
    type.name.length === 1
  )) {
    return type(props)
  }

  const output = {
    attributes: Object.
      entries(props).
      reduce((obj, [k, v]) => {
        if (k !== 'children') obj[k] = String(v)
        return obj
      }, {} as Record<string, string>),
    tag: typeof type === 'string' ?
	    type
     	:
      undefined,
    context: typeof type === 'function' ?
    	type
	    :
			undefined,
  } as DOMTree

  const c = props.children;
  const isa = Array.isArray(c);

  if (c &&  isa                         ) output.children        = c
  if (c && !isa && typeof c !== 'object') output.attributes.text = c

  return output
}

export default fun

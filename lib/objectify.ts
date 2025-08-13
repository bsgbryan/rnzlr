import {
	DOMTree,
	JSX,
} from "./types"

const fun = (
  type: string | Function,
  props: JSX.Props,
): DOMTree => {
  if (typeof type === 'function' && type.name === '__WEBPACK_DEFAULT_EXPORT__') {
    return type(props)
  }

  const output = {
    attribs: Object.
      entries(props).
      reduce((obj, [k, v]) => {
        if (k !== 'children') obj[k] = String(v)
        return obj
      }, {} as Record<string, string>),
    tagName: typeof type === 'string' ?
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

  if (c &&  isa                         ) output.children     = c
  if (c && !isa && typeof c !== 'object') output.attribs.text = c

  return output
}

export default fun

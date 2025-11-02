import {
	DOMTree,
	JSX,
} from "./types"

const fun = (
  tag: string | Function,
  props: JSX.Props,
): DOMTree => {
  if (typeof tag === 'function' && (
    // The component function name for dev builds
    tag.name === '__WEBPACK_DEFAULT_EXPORT__'
    ||
    // The component function name is a single letter
    // for production builds
    tag.name.length === 1
  )) {
    return tag(props)
  }

  const output = {
    attributes: Object.
      entries(props).
      reduce((obj, [k, v]) => {
      	if (typeof v === 'function') obj[k] = v
      	else if (k !== 'children') obj[k] = String(v)
        return obj
      }, {} as DOMTree['attributes']),
    tag: typeof tag === 'string' ?
	    tag
     	:
      undefined,
    context: typeof tag === 'function' ?
    	tag
	    :
			undefined,
  } as DOMTree

  const c = props.children;
  const isa = Array.isArray(c);

  if (c &&  isa                         ) output.children        =  c
  if (c && !isa && typeof c !== 'object') output.attributes.text =  c
  if (c && !isa && typeof c === 'object') output.children        = [c as DOMTree]

  return output
}

export default fun

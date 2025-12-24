import {
	type DOMTree,
	type JSX,
} from './types'

export default (
  tag: string | Function,
  props: JSX.Props,
): DOMTree => {
  if (typeof tag === 'function') return tag(props)
  else if (typeof tag === 'string') {
	  const output = {
	    attributes: Object.
	      entries(props).
	      reduce((obj, [k, v]) => {
	      	if (typeof v === 'function') obj[k] = v
	      	else if (k !== 'children') obj[k] = String(v)
	        return obj
	      }, {} as DOMTree['attributes']),
	    tag
	  } as unknown as DOMTree

	  const c = props.children;
	  const isa = Array.isArray(c);

	  if (c &&  isa                         ) output.children        =  c
	  if (c && !isa && typeof c !== 'object') output.attributes.text =  c
	  if (c && !isa && typeof c === 'object') output.children        = [c as DOMTree]

	  return output
  }
  else return {} as unknown as DOMTree
}

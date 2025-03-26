const fun = (
  type: string,
  props: JSX.Props,
): DOMTree => {
  const output = {
    attribs: Object.
      entries(props).
      reduce((obj, [k, v]) => {
        if (k !== 'children') obj[k] = String(v);
        return obj;
      }, {} as Record<string, string>),
    tagName: type,
  } as DOMTree;

  const c = props.children;
  const isa = Array.isArray(c);

  if (c &&  isa                         ) output.children     = c
  if (c && !isa && typeof c !== 'object') output.attribs.text = c

  return output
}

export default fun

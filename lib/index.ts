enum Elem {
  div = 'div',
}

function createElement(
  type: Elem,
  props: object,
  ...children: object[]
) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
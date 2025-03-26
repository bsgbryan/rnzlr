declare interface DOMTree {
  tagName:  string;
  attribs:  Record<string, string>;
  children: DOMTree[];
}

declare namespace JSX {
  interface Element extends DOMTree {}

  interface IntrinsicElements {
    [elem: string]: any;
  }

  interface Props {
    [name: string]: unknown;
    children?: object | string;
  }
}
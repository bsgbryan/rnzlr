import objectify from "./objectify"

export const fragment = 'fragment'

export const jsx = objectify

export declare interface DOMTree {
  tagName:  string;
  attribs:  Record<string, string>;
  children: DOMTree[];
}

export declare namespace JSX {
  export interface Element extends DOMTree {}

  interface IntrinsicElements {
    [elem: string]: any;
  }

  export interface Props {
    [name: string]: unknown;
    children?: object | string;
  }
}

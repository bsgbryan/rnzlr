import objectify from "./objectify"

export const fragment = 'fragment'

export const jsx 		= objectify
export const jsxDEV = objectify

export type RenderCallback = (markup: JSX.Element) => void;

export declare interface DOMTree {
  tagName?:  string | Function;
  attribs:  Record<string, string>;
  children: DOMTree[];
	context?: (render: RenderCallback) => void;
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

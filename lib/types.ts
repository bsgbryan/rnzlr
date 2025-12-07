import objectify from "./objectify"

export const Fragment = 'fragment'

export const jsx 		= objectify
export const jsxs		= objectify
export const jsxDEV = objectify

export type RenderCallback = (component: CallableFunction) => void;

export type Callbacks = {
  render: RenderCallback;
}

type Params = {
  callbacks: Callbacks;
}

export declare interface DOMTree {
  tag?:  string | Function;
  attributes:  Record<string, string | Function>;
  children?: DOMTree[];
	context?: (params: Params) => JSX.Element;
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

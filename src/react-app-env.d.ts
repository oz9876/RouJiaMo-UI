/// <reference types="react-scripts" />

declare module 'react-lifecycles-compat';

declare module 'css-animation';
declare module 'raf';
declare module 'extraNode';

declare module 'react';


declare module 'react-hot-loader';


type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;


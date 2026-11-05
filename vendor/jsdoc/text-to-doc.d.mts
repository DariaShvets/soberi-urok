export type DocRun = {text:string; b?:boolean; i?:boolean; size?:number; font?:string; color?:number};
export type DocParagraph = {kind:'p'; runs:DocRun[]; pp?:{spB?:number;spA?:number;line?:number;lineMult?:number;keepNext?:boolean;keepLines?:boolean}};
export type DocModel = {body:DocParagraph[]; page?:{width:number;height:number;top:number;bottom:number;left:number;right:number}};
declare function textToDoc(input:DocModel|string|DocParagraph[]):Uint8Array;
export default textToDoc;

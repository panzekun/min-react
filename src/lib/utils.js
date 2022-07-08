import { REACT_TEXT } from "./constants";

/**
 * 将普通文本转换成统一格式，方便后面domdiff
 * @param {*} element 
 * @returns 
 */
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}
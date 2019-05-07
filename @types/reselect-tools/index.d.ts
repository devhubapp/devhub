declare module 'reselect-tools' {
  export function checkSelector(selector: any): any
  export function createSelectorWithDependencies(...args: any[]): any
  export function getStateWith(stateGetter: any): void
  export function registerSelectors(selectors: any): void
  export function reset(): void
  export function selectorGraph(...args: any[]): any
}

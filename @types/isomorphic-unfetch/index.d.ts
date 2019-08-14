declare module 'isomorphic-unfetch' {
  const fetch: GlobalFetch['fetch']
  export default fetch
}

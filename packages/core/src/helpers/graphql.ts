export {
  EnumType,
  IJsonToGraphQLOptions,
  VariableType,
  jsonToGraphQLQuery,
} from 'json-to-graphql-query'

export function objToScapedJSONString(obj: object | undefined) {
  return obj ? `"${JSON.stringify(obj).replace(/"/g, '\\"')}"` : null
}

export function removeUndefinedFields(obj: Record<string, any>) {
  return Object.keys(obj).reduce(
    (result, key) =>
      typeof obj[key] === 'undefined' ? result : { ...result, [key]: obj[key] },
    {},
  )
}

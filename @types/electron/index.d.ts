interface Window {
  process?: {
    type?: string
  }
  require: NodeRequireFunction
}

declare namespace NodeJS {
  interface ProcessVersions {
    electron?: boolean
  }
}

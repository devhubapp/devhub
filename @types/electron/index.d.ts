interface Window {
  process?: {
    type?: string
  }
}

declare namespace NodeJS {
  interface ProcessVersions {
    electron?: boolean
  }
}

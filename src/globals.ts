interface GlobalOptions {
  nullableMode: 'nullish' | 'optional'
}

// default value
const globalState: GlobalOptions = {
  nullableMode: 'optional',
}

export function setGlobalOptions(options: Partial<GlobalOptions>) {
  Object.assign(globalState, options)
}

export function getGlobalOptions(): GlobalOptions {
  return globalState
}

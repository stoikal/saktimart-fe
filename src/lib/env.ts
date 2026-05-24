function requireEnv(name: string): string {
  const key = `VITE_${name}`
  const value = import.meta.env[key]
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  API_BASE_URL: requireEnv("API_BASE_URL"),
}

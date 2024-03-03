class Currency<const T> {
  private host = 'https://api.frankfurter.app'

  constructor(private currencies: T) {}

  private caches: Record<string, number> = {}
  async convert(amount: number, from: T[keyof T], to: T[keyof T]) {
    const key = `from=${from}&to=${to}`
    if (this.caches[key]) {
      console.log('cache')
      return this.caches[key]
    }
    const response = await fetch(`${this.host}/latest?amount=${amount}&from=${from}&to=${to}`)
    const data = (await response.json()) as any as CurrencyResult<T[keyof T] extends string ? T[keyof T] : never>

    const rate = data.rates[to as T[keyof T] extends string ? T[keyof T] : never]
    this.caches[key] = rate
    return rate
  }

  get latest() {
    return async () => {
      try {
        const response = await fetch(`${this.host}/latest`)
        const data = await response.json()
        return data
      } catch (error) {
        return {}
      }
    }
  }
}

interface CurrencyResult<T extends string> {
  amount: number
  base: string
  date: string
  rates: Record<T, number>
}


export default Currency
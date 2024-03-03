function cache(method: Function, context: unknown) {
  return function (amount: number, from: string, to: string) {
    return method.call(context, amount, from, to)
  }
}

class Currency<const T extends readonly string[]> {
  private host = 'https://api.frankfurter.app'

  constructor(private currencies: T) {}

  private caches: Record<string, number> = {}

  @cache
  async convert(amount: number, from: Extract<T[keyof T], string>, to: Extract<T[keyof T], string>) {
    const key = `${from}_${to}`
    if (this.caches[key]) {
      console.log('cache')
      return this.caches[key] * amount
    }
    const response = await fetch(`${this.host}/latest?amount=${amount}&from=${from}&to=${to}`)
    const data = (await response.json()) as any as CurrencyResult<Extract<T[keyof T], string>>

    const rate = data.rates[to as Extract<T[keyof T], string>]
    this.caches[key] = rate / data.amount
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

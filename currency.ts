function cache(method: Function, _context: any) {
  return async function (this: any, amount: number, from: string, to: string) {
    const key = `${from}_${to}`
    if (this.caches[key]) return this.caches[key] * amount

    // const result = await method.bind(this)(amount, from, to)
    const result = await method.call(this, amount, from, to)
    const rate = result.rates[to]
    this.caches[key] = rate / result.amount
    return rate
  }
}

class Currency<const T extends readonly string[] = [], Values extends string = Extract<T[keyof T], string>> {
  private host = 'https://api.frankfurter.app'

  constructor(private currencies: T) {}

  private caches: Record<string, number> = {}

  @cache
  async convert(amount: number, from: Values, to: Values) {
    const response = await fetch(`${this.host}/latest?amount=${amount}&from=${from}&to=${to}`)
    const data = await response.json()
    return data as unknown as CurrencyResult<Values>
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

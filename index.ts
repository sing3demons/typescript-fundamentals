class Currency<const T> {
  private host = 'https://api.frankfurter.app'

  constructor(private currencies: T) {}

  async convert(amount: number, from: T[keyof T], to: T[keyof T]) {
    const response = await fetch(`${this.host}/latest?amount=${amount}&from=${from}&to=${to}`)
    const data = await response.json()
    return data
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

const currencyType = ['USD', 'EUR', 'GBP', 'JPY', 'THB'] as const
const cur = new Currency(currencyType)
// cur.convert(100, 'THB', 'USD')
cur.latest().then(console.log)

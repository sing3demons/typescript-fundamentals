import Currency from "./currency"


async function main() {
  const currencyType = ['USD', 'EUR', 'GBP', 'JPY', 'THB'] as const
  const cur = new Currency(currencyType)
  await cur.convert(100, 'THB', 'USD').then(console.log)
  await cur.convert(100, 'THB', 'USD').then(console.log)
  // cur.latest().then(console.log)
}

main()

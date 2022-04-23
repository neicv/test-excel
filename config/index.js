// Схема парсинга Excel файла (без валидации)
export const shemaMap = {
  'Международное непатентованное наименование': 'internationalName',
  'Торговое наименование': 'tardeName',
  'Форма выпуска': 'releaseForm',
  Количество: 'quantity',
  Цена: 'price'
}

// Поля для вычисления затрат
export const expenses = {
  text: 'Затраты',
  value: 'expenses',
  fields: [
    'quantity',
    'price'
  ]
}

// export const shemaMap = {
//   'INTERNATIONAL NAME': 'internationalName',
//   'TRADE NAME': 'tardeName',
//   'RELEASE FORM': 'releaseForm',
//   QUANTITY: 'quantity',
//   PRICE: 'price'
// }

export default shemaMap

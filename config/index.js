// Схема парсинга Excel файла (без валидации)
export const shemaMap = {
  'Международное непатентованное наименование': 'internationalName',
  'Торговое наименование': 'tardeName',
  'Форма выпуска': 'releaseForm',
  Количество: 'quantity',
  Цена: 'price'
}

// export const shemaMap = {
//   'INTERNATIONAL NAME': 'internationalName',
//   'TRADE NAME': 'tardeName',
//   'RELEASE FORM': 'releaseForm',
//   QUANTITY: 'quantity',
//   PRICE: 'price'
// }

export default shemaMap

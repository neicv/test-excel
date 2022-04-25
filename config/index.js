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

// Поля для вычисления итогов
export const total = {
  fields: [
    'quantity',
    'price',
    'expenses'
  ]
}

export default shemaMap

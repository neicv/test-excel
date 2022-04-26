export const dbconfig = {
  name: 'base/test_base.db',
  type: 'aqlite'
}

// Оставлять знаков после запятой
export const DEFAULT_DECIMAL_PLACES = 2

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
  ],
  formula: {
    price: 'expenses / quantity'
  }
}

// Поля таблицы для Задачи #3
// Связывание с полями из запроса к БД
export const tableRelationsTask3 = [
  {
    title: 'МНН',
    value: 'mnn',
    field: 'mnn_title'
  },
  {
    title: 'ТН',
    value: 'tn',
    field: 'tn_list'
  },
  {
    title: 'ЖНВЛП',
    value: 'lsaem',
    field: 'mmn_ven'
  }
]

export default shemaMap

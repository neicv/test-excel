import readXlsxFile from 'read-excel-file'
import { shemaMap as map } from '../config'

async function importExcel (file) {
  try {
    const result = await readXlsxFile(file, { map })

    const { rows } = result
    // eslint-disable-next-line no-unused-expressions
    rows === [{
      internationalName: 'отсутствует',
      tardeName: 'отсутствует',
      releaseForm: '-',
      quantity: 0,
      price: 0
    }]

    return { data: rows, success: true, errorMsg: '' }
  } catch {
    const msg = 'Ошибка! Не удалось загрузить Excel файл'

    return { data: [], success: false, errorMsg: msg }
  }
}

export default importExcel

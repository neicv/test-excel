import path from 'path'
import SQLite from 'better-sqlite3'
import { dbconfig as config } from '../config'

const db = new SQLite(path.resolve(config.name), { fileMustExist: true })

function query (sql, params) {
  return db.prepare(sql).all(params)
}

export default query

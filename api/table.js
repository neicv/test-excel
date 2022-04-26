import db from '../services/db'
// const config = require('../config');

async function index () {
  // const offset = (page - 1) * config.listPerPage;
  // const data = db.query(`SELECT * FROM quote LIMIT ?,?`, [offset, config.listPerPage]);
  const data = await db(
  `SELECT a.id AS mnn_id, a.mnn AS mnn_title, group_concat(b.tn, '\n') as tn_list, MAX(a.ven='True') AS mmn_ven
  FROM spMNN a
  INNER JOIN spTN b
  WHERE a.id = b.mnn
  GROUP by a.mnn
  ORDER by mnn_title ASC`, []
  )

  return data
}

export { index }

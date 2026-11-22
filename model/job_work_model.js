const db = require('../config/db');

const calculateJobWorkFields = (data) => {
  const avakKg = parseFloat(data.avak_kg) || 0;
  const noOfPeti = parseInt(data.no_of_peti) || 0;
  const petiWt = parseFloat(data.peti_wt) || 0;
  const netKg = Math.round((avakKg - (noOfPeti * petiWt)) * 1000) / 1000;
  
  const ratePerKg = parseFloat(data.rate_per_kg) || 0;
  const totalRs = Math.round(netKg * ratePerKg * 100) / 100;

  let ghati = 0;
  let status = 'Pending';

  const hasReturnKg = data.return_kg !== undefined && data.return_kg !== null && data.return_kg !== '';
  if (hasReturnKg) {
    const returnKg = parseFloat(data.return_kg) || 0;
    ghati = Math.round((avakKg - returnKg) * 1000) / 1000;
    if (ghati === 0) {
      status = 'OK'; // right mark
    } else if (ghati > 0 && ghati <= 0.300) {
      status = 'Warning'; // up to 300g dash mark
    } else {
      status = 'Danger'; // more than 300g cross mark
    }
  } else {
    ghati = 0;
    status = 'Pending';
  }

  return {
    ...data,
    net_kg: netKg,
    total_rs: totalRs,
    ghati: ghati,
    status: status,
    return_kg: hasReturnKg ? parseFloat(data.return_kg) : null,
  };
};

const JobWork = {
  create: async (jobWorkData) => {
    const calculated = calculateJobWorkFields(jobWorkData);

    const fields = [
      'date', 'item_code', 'finish', 'avak_kg', 'no_of_peti',
      'peti_wt', 'net_kg', 'rate_per_kg', 'total_rs',
      'return_kg', 'ghati', 'status', 'created_by'
    ];
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => (calculated[field] !== undefined ? calculated[field] : null));

    const query = `INSERT INTO job_work (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...calculated };
  },

  findAll: async () => {
    const query = 'SELECT * FROM job_work ORDER BY id DESC';
    const [rows] = await db.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = 'SELECT * FROM job_work WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  findAllPaginated: async ({ page = 1, limit = 50, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim() !== '') {
      const searchTerms = search.trim().split(/\s+/).filter(Boolean);
      searchTerms.forEach(term => {
        const likeTerm = `%${term}%`;
        whereConditions.push(`(
          item_code LIKE ? OR
          finish LIKE ? OR
          date LIKE ? OR
          status LIKE ? OR
          CAST(avak_kg AS CHAR) LIKE ? OR
          CAST(net_kg AS CHAR) LIKE ? OR
          CAST(rate_per_kg AS CHAR) LIKE ? OR
          CAST(total_rs AS CHAR) LIKE ? OR
          CAST(return_kg AS CHAR) LIKE ? OR
          CAST(ghati AS CHAR) LIKE ?
        )`);
        queryParams.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
      });
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM job_work ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const totalRecords = countResult[0].total;

    const dataQuery = `
      SELECT * FROM job_work
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit) || 1,
        totalRecords,
        limit
      }
    };
  },

  update: async (id, jobWorkData) => {
    const existing = await JobWork.findById(id);
    if (!existing) return 0;

    const merged = { ...existing, ...jobWorkData };
    const calculated = calculateJobWorkFields(merged);

    const allowedFields = [
      'date', 'item_code', 'finish', 'avak_kg', 'no_of_peti',
      'peti_wt', 'net_kg', 'rate_per_kg', 'total_rs',
      'return_kg', 'ghati', 'status'
    ];

    const fieldsToUpdate = allowedFields.filter(field => calculated[field] !== undefined);
    if (fieldsToUpdate.length === 0) return 0;

    const setClauses = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
    const values = fieldsToUpdate.map(field => calculated[field]);

    const query = `UPDATE job_work SET ${setClauses} WHERE id = ?`;
    const [result] = await db.query(query, [...values, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM job_work WHERE id = ?', [id]);
    return result.affectedRows;
  },

  batchUpdate: async (items) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    let updatedCount = 0;
    for (const item of items) {
      if (item && item.id) {
        const { id, ...data } = item;
        const affected = await JobWork.update(id, data);
        if (affected > 0) updatedCount++;
      }
    }
    return updatedCount;
  },

  batchDelete: async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return 0;
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await db.query(`DELETE FROM job_work WHERE id IN (${placeholders})`, ids);
    return result.affectedRows;
  }
};

module.exports = JobWork;

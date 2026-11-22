const JobWork = require('../model/job_work_model');
const { logUserActivity } = require('../utils/activityLogger');

const jobWorkController = {
  createJobWork: async (req, res) => {
    try {
      const created_by = req.user?.id || null;
      const jobWorkData = {
        ...req.body,
        created_by
      };

      const newRecord = await JobWork.create(jobWorkData);

      try {
        await logUserActivity(req, {
          model_name: 'job_work',
          action_type: 'CREATE',
          record_id: newRecord.id,
          description: `Created Job Work record #${newRecord.id} for item ${newRecord.item_code || ''}`
        });
      } catch (logErr) {
        console.error('Activity logging failed for Job Work create:', logErr.message);
      }

      res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
      console.error('Error in createJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllJobWork: async (req, res) => {
    try {
      const { page = 1, limit = 50, search = '' } = req.body;

      const result = await JobWork.findAllPaginated({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
        search: search || ''
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error in getAllJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateJobWork: async (req, res) => {
    try {
      const { id, ...data } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID is required.' });
      }

      const affected = await JobWork.update(id, data);
      if (affected === 0) {
        return res.status(404).json({ success: false, message: 'Record not found or no changes made.' });
      }

      const updatedRecord = await JobWork.findById(id);

      try {
        await logUserActivity(req, {
          model_name: 'job_work',
          action_type: 'UPDATE',
          record_id: id,
          description: `Updated Job Work record #${id}`
        });
      } catch (logErr) {
        console.error('Activity logging failed for Job Work update:', logErr.message);
      }

      res.status(200).json({ success: true, data: updatedRecord });
    } catch (error) {
      console.error('Error in updateJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteJobWork: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'ID is required.' });
      }

      const affected = await JobWork.delete(id);
      if (affected === 0) {
        return res.status(404).json({ success: false, message: 'Record not found.' });
      }

      try {
        await logUserActivity(req, {
          model_name: 'job_work',
          action_type: 'DELETE',
          record_id: id,
          description: `Deleted Job Work record #${id}`
        });
      } catch (logErr) {
        console.error('Activity logging failed for Job Work delete:', logErr.message);
      }

      res.status(200).json({ success: true, message: 'Record deleted successfully.' });
    } catch (error) {
      console.error('Error in deleteJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  batchUpdateJobWork: async (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Items array is required.' });
      }

      const updatedCount = await JobWork.batchUpdate(items);

      res.status(200).json({
        success: true,
        message: `${updatedCount} records updated successfully.`,
        updatedCount
      });
    } catch (error) {
      console.error('Error in batchUpdateJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  batchDeleteJobWork: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'IDs array is required.' });
      }

      const deletedCount = await JobWork.batchDelete(ids);

      res.status(200).json({
        success: true,
        message: `${deletedCount} records deleted successfully.`,
        deletedCount
      });
    } catch (error) {
      console.error('Error in batchDeleteJobWork:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};

module.exports = jobWorkController;

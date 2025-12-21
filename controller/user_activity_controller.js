const UserActivity = require('../model/user_activity_model');

const userActivityController = {
  getHistory: async (req, res) => {
    try {
      const { user_id, model_name, action_type, start_date, end_date, limit, offset } = req.body;

      const filters = {
        user_id,
        model_name,
        action_type,
        start_date,
        end_date,
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await UserActivity.findAll(filters);

      res.status(200).json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      console.error('Get User Activity History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
   getHistoryPaginated: async (req, res) => {
    try {
      let { 
        page = 1, 
        page_limit = 20, 
        user_id, 
        model_name, 
        action_type, 
        start_date, 
        end_date 
      } = req.body;

      page = parseInt(page, 10);
      if (isNaN(page) || page < 1) page = 1;

      page_limit = parseInt(page_limit, 10);
      if (isNaN(page_limit) || page_limit <= 0) page_limit = 20;

      const filters = {
        user_id,
        model_name,
        action_type,
        start_date,
        end_date,
        limit: page_limit,
        offset: (page - 1) * page_limit
      };

      const [history, total] = await Promise.all([
        UserActivity.findAll(filters),
        UserActivity.countAll({ user_id, model_name, action_type, start_date, end_date })
      ]);

      const totalPages = Math.ceil(total / page_limit);

      return res.status(200).json({
        success: true,
        data: history,
        meta: {
          page,
          page_limit,
          total_records: total,
          total_pages: totalPages,
          filters_applied: {
            user_id,
            model_name,
            action_type,
            start_date,
            end_date
          }
        }
      });
    } catch (error) {
      console.error('Get User Activity History Paginated Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = userActivityController;


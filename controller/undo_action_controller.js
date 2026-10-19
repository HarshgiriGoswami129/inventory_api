const UndoAction = require('../model/undo_action_model');

const undoActionController = {
  /**
   * Get recent undoable actions
   * GET /undo-actions/recent
   */
  getRecentActions: async (req, res) => {
    try {
      const user = req.user;
      const limit = parseInt(req.query.limit, 10) || 10;
      const userId = user?.id || req.query.user_id || null;

      const actions = await UndoAction.getRecentActions({ user_id: userId, limit });
      res.status(200).json({
        success: true,
        data: actions,
      });
    } catch (err) {
      console.error('Error fetching recent undo actions:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent undo actions.',
        error: err.message,
      });
    }
  },

  /**
   * Execute undo for a specific action ID
   * POST /undo-actions/undo
   * Body: { id: 123 }
   */
  undoAction: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Action ID is required.',
        });
      }

      const result = await UndoAction.executeUndo(id, req.user);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      console.error('Error executing undo action:', err);
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to undo action.',
        error: err.message,
      });
    }
  },
};

module.exports = undoActionController;

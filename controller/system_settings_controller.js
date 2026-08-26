const SystemSettings = require('../model/system_settings_model');

const getFieldControls = async (req, res) => {
  try {
    const controls = await SystemSettings.getSetting('global_field_controls');
    return res.json({
      success: true,
      data: controls || null,
    });
  } catch (error) {
    console.error('Error fetching field controls:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const saveFieldControls = async (req, res) => {
  try {
    const { controls } = req.body;
    if (!controls) {
      return res.status(400).json({ success: false, message: 'Controls payload is required' });
    }
    await SystemSettings.saveSetting('global_field_controls', controls);
    return res.json({
      success: true,
      message: 'Field controls updated successfully',
      data: controls,
    });
  } catch (error) {
    console.error('Error saving field controls:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFieldControls,
  saveFieldControls,
};

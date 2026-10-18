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

const getColumnSettings = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const userId = req.user?.id || req.query?.userId || 'default';

    // 1. Try user-specific setting
    let settings = await SystemSettings.getSetting(`col_pref_${userId}_${pageKey}`);

    // 2. If not found, try global fallback for this page
    if (!settings && userId !== 'default') {
      settings = await SystemSettings.getSetting(`col_pref_global_${pageKey}`);
    }

    return res.json({
      success: true,
      data: settings || null,
    });
  } catch (error) {
    console.error('Error fetching column settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const saveColumnSettings = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const { settings } = req.body;
    const userId = req.user?.id || req.body?.userId || 'default';

    if (!settings) {
      return res.status(400).json({ success: false, message: 'Settings payload is required' });
    }

    // Save user-specific setting
    await SystemSettings.saveSetting(`col_pref_${userId}_${pageKey}`, settings);

    // If unauthenticated / default, also update global default fallback for this page
    if (userId === 'default') {
      await SystemSettings.saveSetting(`col_pref_global_${pageKey}`, settings);
    }

    return res.json({
      success: true,
      message: 'Column settings saved successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error saving column settings:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFieldControls,
  saveFieldControls,
  getColumnSettings,
  saveColumnSettings,
};

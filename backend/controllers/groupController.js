class GroupController {
  constructor(groupService) {
    this.groupService = groupService;
  }

  createGroup = async (req, res) => {
    try {
      await this.groupService.createGroup(
        req.body.groupTitle, 
        req.body.fonts
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getGroups = async (req, res) => {
    try {
      const groups = await this.groupService.getAllGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateGroup = async (req, res) => {
    try {
      await this.groupService.updateGroup(
        req.params.id,
        req.body.groupTitle,
        req.body.fonts
      );
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteGroup = async (req, res) => {
    try {
      await this.groupService.deleteGroup(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = GroupController;
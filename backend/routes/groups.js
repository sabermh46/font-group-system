const express = require('express');
const GroupRepository = require('../repositories/groupRepository');
const FontRepository = require('../repositories/fontRepository');
const GroupService = require('../services/groupService');
const GroupController = require('../controllers/groupController');

module.exports = (db) => {
  const router = express.Router();
  const groupRepository = new GroupRepository(db);
  const fontRepository = new FontRepository(db);
  const groupService = new GroupService(groupRepository, fontRepository);
  const groupController = new GroupController(groupService);

  router.post('/', groupController.createGroup);
  router.get('/', groupController.getGroups);
  router.put('/:id', groupController.updateGroup);
  router.delete('/:id', groupController.deleteGroup);

  return router;
};
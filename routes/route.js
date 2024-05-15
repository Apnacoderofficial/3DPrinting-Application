const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Role = require('../models/role');
const controller = require('../controllers/controller');
const upload = require('../controllers/fileUpload');

router.get('/', async (req, res) => { res.redirect('login'); });
router.get('/login',controller.login);
router.post('/login',controller.loginform);
router.get('/index',controller.dashboard);
router.get('/dashboard',controller.dashboard);
router.get('/logout',controller.logout);
router.get('/profile',controller.profile);

// admin
router.get('/adminlist',controller.adminlist);
router.get('/addadmin', controller.getAddAdminForm);
router.post('/addadmin', controller.addAdmin);
router.get('/editadmin', controller.getEditAdminForm);
router.post('/editadmin', controller.editAdmin);
router.get('/deleteadmin/:id', controller.deleteAdmin);

// Admin Role
router.get('/adminrole',controller.adminrole);
router.get('/addrole', controller.getAddRoleForm);
router.post('/addrole', controller.addRole);
router.get('/editrole', controller.getEditRoleForm);
router.post('/editrole', controller.editRole);
router.get('/deleterole/:id', controller.deleterole);


//Upload File
router.get('/stlFiles',controller.listStlFiles);
router.get('/addStlFile',controller.addStlFile);
router.get('/editStlFile',controller.editStlFile);
router.post('/saveStlFile',upload.uploadFile.single('stlFile'),controller.saveStlFile);
router.get('/deleteStlFile/:id', controller.deleteStlFile);
router.get('/getFileAuth', controller.getFileAuth);
router.post('/postFileAuth', controller.postFileAuth);



router.get('/api/users', async (req, res) => {
    try {
      // Find all users in the 'users' collection
      const allUsers = await User.find();

      // Send the list of users as JSON response
      res.json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
router.get('/api/role', async (req, res) => {
        try {
          // Find all users in the 'users' collection
          const allRole = await Role.find();
    
          // Send the list of users as JSON response
          res.json(allRole);
        } catch (error) {
          console.error('Error fetching role:', error);
          res.status(500).json({ error: 'Failed to fetch Role' });
        }
      });
  });


module.exports = router;
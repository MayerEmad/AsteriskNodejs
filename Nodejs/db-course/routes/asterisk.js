const path = require('path');

const express = require('express');

const asteriskController = require('../controllers/asterisk');

const router = express.Router();

// /asterisk/add-context => GET
router.get('/add-context', asteriskController.getAddContext);

router.post('/add-context', asteriskController.postAddContext);

router.get('/contexts', asteriskController.getContexts);

router.get('/edit-context/:contextId', asteriskController.getEditContext);

router.post('/edit-context', asteriskController.postEditContext);

router.post('/delete-context', asteriskController.postDeleteContext);



router.get('/add-extension', asteriskController.getAddExtension);

router.post('/add-extension', asteriskController.postAddExtension);

router.get('/extensions', asteriskController.getExtensions);

router.get('/edit-extension/:extensionId', asteriskController.getEditExtension);

router.post('/edit-extension', asteriskController.postEditExtension);

router.post('/delete-extension', asteriskController.postDeleteExtension);


router.get('/conf', asteriskController.getPrintConf);
module.exports = router;
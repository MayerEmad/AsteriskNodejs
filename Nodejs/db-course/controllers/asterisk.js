 const Context = require('../models/context');

exports.getAddContext = (req, res, next) => {
  res.render('asterisk/add-context', {
    pageTitle: 'Add Context',
    path: '/asterisk/add-context',
    editing: false
  });
};

exports.postAddContext = (req, res, next) => {
    const title = req.body.title;
    Context.create({
      title: title
    })
      .then(result => {
        // console.log(result);
        console.log('Created Context');
        res.redirect('/asterisk/contexts');
      })
      .catch(err => {
        console.log(err);
      });
   
};

exports.getContexts = (req, res, next) => {
    Context.findAll()
    .then(contexts => {
      res.render('asterisk/contexts', {
        conts: contexts,
        pageTitle: 'asterisk contexts',
        path: '/asterisk/contexts'
      });
    })
    .catch(err => console.log(err));
};

exports.getEditContext = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const contId = req.params.contextId;
    Context.findByPk(contId)
    .then(context => {
      if (!context) {
        return res.redirect('/');
      }
      res.render('asterisk/add-context', {
        pageTitle: 'Edit context',
        path: '/asterisk/edit-context',
        editing: editMode,
        context: context
      });
    });
};

exports.postEditContext = (req, res, next) => {
const contId = req.body.contextId;
const updatedTitle = req.body.title;
Context.findByPk(contId)
    .then(context => {
      context.title = updatedTitle;
      return context.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/asterisk/contexts');
    })
    .catch(err => console.log(err));
};

exports.postDeleteContext = (req, res, next) => {
    const contId = req.body.contextId;
    Context.findByPk(contId)
    .then(context => {
      return context.destroy();
    })
    .then(result => {
      console.log('DESTROYED Context');
      res.redirect('/asterisk/contexts');

    })
    .catch(err => console.log(err));
};







//Extensions

const Extension = require('../models/extension');

exports.getAddExtension = (req, res, next) => {
  res.render('asterisk/add-extension', {
    pageTitle: 'Add Extension',
    path: '/asterisk/add-extension',
    editing: false
  });
};

exports.postAddExtension = (req, res, next) => {
    const name = req.body.name;
    const action = req.body.action;
    const params = req.body.params;
    const context_id = req.body.context_id;
    // res.send(req.body);
    Extension.create({
        name,
        action,
        params,
        context_id
      }).then(result => {
        // console.log(result);
        console.log('Created Extension');
        res.redirect('/asterisk/extensions');

      })
      .catch(err => {
        console.log(err);
      });
};

exports.getExtensions = (req, res, next) => {
  Extension.findAll()
  .then(extensions => {
    res.render('asterisk/extensions', {
      extens: extensions,
      pageTitle: 'extensions',
      path: 'asterisk/extensions'
    });
  })
  .catch(err => console.log(err));
};

exports.getEditExtension = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const extenId = req.params.extensionId;
  Extension.findByPk(extenId)
    .then(extension => {
      if (!extension) {
        return res.redirect('/');
      }
      res.render('asterisk/add-extension', {
        pageTitle: 'Edit extension',
        path: '/asterisk/edit-extension',
        editing: editMode,
        extension: extension
      });
    })
    .catch(err => console.log(err));
};

exports.postEditExtension = (req, res, next) => {
const extenId = req.body.extensionId;
const updatedName = req.body.name;
const updatedAction = req.body.action;
const updatedParams = req.body.params;
const updatedContext = req.body.context_id;
Extension.findByPk(extenId)
    .then(extension => {
      extension.name = updatedName;
      extension.action = updatedAction;
      extension.params = updatedParams;
      extension.context_id = updatedContext;
      return extension.save();
    })
    .then(result => {
      console.log('UPDATED extension!');
      res.redirect('/asterisk/extensions');
    })
    .catch(err => console.log(err));
};

exports.postDeleteExtension = (req, res, next) => {
  const extenId = req.body.extensionId;
    Extension.findByPk(extenId)
    .then(extension => {
      return extension.destroy();
    })
    .then(result => {
      console.log('DESTROYED extension');
      res.redirect('/asterisk/extensions');

    })
    .catch(err => console.log(err));
};

//Printing

const fs = require('fs');
const path = require('path');
//const { extensions } = require('sequelize/types/utils/validator-extras');

const p = path.join(path.dirname(process.mainModule.filename),'data','conf.txt');


exports.getPrintConf = (req, res, next) => {
  let fileString='';
  let contextArr=[];
  let extensionArr=[];
  Context.findAll()
  .then(contexts => {
        contextArr=contexts;
        Extension.findAll()
        .then(extensions=>{
          extensionArr=extensions;
        })
        .then(result =>{
          for(let context of contextArr)
          {
            let cont_id=context.id;
          
              fileString+='['+context.title+']\r\n';
              fileString+='\r\n';
              for(let extension of extensionArr)
                {
                  if(extension.context_id==cont_id){
                    fileString+='exten => '+extension.name+',1,'+extension.action+'('+extension.params+')\r\n';
                    fileString+='same => n,Hangup\r\n\r\n';
                  }
                } 
          }
          //res.send(fileString);
          fs.writeFile(p, fileString, (err) => {
            if (err) console.log(err);
          });
          'use strict';

          var ari = require('ari-client');
          var util = require('util');

          ari.connect('http://localhost:8088', 'mayer', 'mayer', clientLoaded);        
        })
        .catch(err => console.log(err));
      });
    }

    // handler for client being loaded
function clientLoaded (err, client) {
  if (err) {
    throw err;
  }
  fs.readFile(p, 'utf8', function (err,data) {
    console.log( data);
      fs.writeFile("/etc/asterisk/extensions.conf", data, (err) => {
        if (err) console.log(err);
        else{
            client.asterisk.reloadModule({
              moduleName: 'pbx_config.so'
            })
            .then(function () {console.log('reload done');})
            .catch(function (err) {});
                console.log("failed to reload File.");
            }  
          });   
    });   
}
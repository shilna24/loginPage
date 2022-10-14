let express = require('express');
let router = express.Router();
const productHelper = require('../helpers/product-helper')
let userHelper = require('../helpers/user-helper');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    res.redirect('/admin/view-product');
  } else {
    res.render('admin/adminLogin', { adminLoggErr: req.session.adminLoggErr });
    req.session.adminLoggErr = false;
  }
});
router.get('/view-product', function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  productHelper.getAllProducts().then((products) => {
    if (req.session.adminLoggedIn) {
      res.render('admin/view-product', { products, admin: true });
    } else {
      res.redirect('/admin')
    }
  })
});
const admindb = {
  email: "admin@gmail.com",
  password: 12345
}
router.post('/adminLogin', function (req, res) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.body.email == admindb.email && req.body.password == admindb.password) {
    req.session.adminLoggedIn = true;
    res.redirect('/admin/view-product');
  } else {
    req.session.adminLoggErr = false;
    res.redirect('/admin');
  }
});

router.get('/add-product', function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    res.render('admin/add-product', { admin: true });
  } else {
    res.redirect('/admin');
  }
});
router.post('/add-product', (req, res) => {
  console.log(req);
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  });
});




router.get('/view-user', function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  userHelper.getAllUsers().then((userdetails) => {
    if (req.session.adminLoggedIn) {
      res.render('admin/view-user', { userdetails, admin: true });
    } else {
      res.redirect('/admin')
    }
  })

});
router.get('/add-user', function (req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    res.render('admin/add-user', { admin: true });
  } else {
    res.redirect('/admin');
  }
});

router.post('/add-users', (req, res) => {
  userHelper.addUser(req.body).then((response) => {
    res.redirect('/admin/view-user')
  });
});

router.get('/delete-user/:id', (req, res) => {
  let usrId = req.params.id;
  userHelper.deleteUser(usrId).then((response) => {
    res.redirect('/admin/view-user')
  })
})

router.get('/edit-user/:id', async (req, res) => {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if (req.session.adminLoggedIn) {
    let user = await userHelper.getUserDetails(req.params.id)
    res.render('admin/edit-user', { user, admin: true })
  } else {
    res.redirect('/admin');
  }
})

router.post('/edit-user/:id', (req, res) => {
  userHelper.updateUser(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-user')
  })
})


router.get('/adminLoggout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/admin');
});




module.exports = router;

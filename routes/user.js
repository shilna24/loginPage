const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelper=require('../helpers/product-helper')
const userHelper=require('../helpers/user-helper')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
// router.get('/', function(req, res, next) {
//   let user=req.session.user
//   productHelper.getAllProducts().then((products)=>{
//     res.render('user/view-products',{products,user,users:true});
//   })
  
// });
// router.get('/login',(req,res)=>{
//   res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
//   if(req.session.loggedIn)
//   res.redirect("/")
//   else

//   res.render('user/login',{loginErr:req.session.loginErr,users:true})
//   req.session.loginErr=false
// })
// router.get('/signup',(req,res)=>{
//   res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
//   if(req.session.loggedIn)
//   {
//   res.redirect('/')
//   }
//   else{
//     res.render('/user/signup',{users:true})
//   }

// })
// router.post('/signup',(req,res)=>{
//   userHelper.doSignup(req.body).then((response)=>{
//     // console.log(response)
//     res.redirect('/login')
//   })
// })
// router.post('/login',(req,res)=>{
//   userHelper.doLogin(req.body).then((response)=>{
//     if(response.status)
//     {
//       req.session.loggedIn=true
//       req.session.user=response.user
//       res.redirect('/')
//     }
//     else{
//       req.session.loginErr="Invalid Username Or Password"
//       res.redirect('/login')
//     }
//   })
// })
// router.get('/logout',(req,res,next)=>{
//   req.session.destroy()
//   res.redirect('/login')
// })
// router.get('/cart',verifyLogin,(req,res)=>{

// res.render('user/cart')
// })
router.get('/', function(req, res, next) {
  let user=req.session.user
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { products,user, users: true });
  })

});

router.get('/login', function(req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if(req.session.loggedIn){
     res.redirect('/')
  }else{
    res.render('user/login',{loginerr:req.session.loginerr,users:true});
    req.session.loginerr=false
  }

});
router.get('/signup', function(req, res, next) {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
  res.render('user/signup',{users:true});
  }
});

router.post('/signup', function(req,res){
    userHelper.doSignup(req.body).then((response)=>{
      res.redirect('/login')
    });
});

router.post('/login', function(req,res){
 
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true;
      req.session.user=response.user;
      res.redirect('/');
    }else{
      req.session.loginerr=true
      res.redirect('/login');
    }
  })
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/')
});
module.exports = router;

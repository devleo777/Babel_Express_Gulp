import express from 'express';
const router = express();
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Tasks by Jmfcool.com',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

export { router };

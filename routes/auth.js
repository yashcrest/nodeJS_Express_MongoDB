const express = require('express')
const router = express.Router()
const passport = require('passport')

//@desc   Auth with Google
// @route Get /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

//@desc   Google Auth Callback
// @route Get /auth/google/callback
router.get(
    '/google/callback',
     passport.authenticate('google', {failureRedirect: '/'}), 
     (req, res)=>{
        res.redirect('/dashboard')

    }
)


// @desc    Loutout user
// @route  /auth/logout
router.get('/logout' , (req ,res, next) => {
    req.logout((error) => {
        if(error) {return next(error)}
        res.redirect('/')
    })

})

module.exports = router
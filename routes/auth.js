const express = require('express');
const passport = require('passport');
// const router = express.Router();


module.exports = (app) => {

//Auth w Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile']}));


//Google auth callback
app.get(
    '/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/'}), (req,res) => {
    res.redirect('/dashboard')
});


//Logout User

app.get('/auth/logout', (req,res) => {
    req.logout((err) => {
        if(err){
            console.error(err)
        };
        res.redirect('/'); 
    });
    
})

    
}



// module.exports = router;
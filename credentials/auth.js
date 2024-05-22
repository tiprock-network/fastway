//we can add this to any route to protect it
module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()) return next();
        req.flash('error','It looks like we need to get you logged in.')
        res.redirect('/app/fastway/account/login')
    }
}
const isAuthenticated = async (req, res, next)  =>{
    if (req.session.userID)
    {
        return next();
    }
    else
    {
         return res.status(401).json({ error: 'Unauthorized access' });
    }
}

module.exports = isAuthenticated;
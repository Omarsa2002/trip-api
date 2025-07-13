
const requireAdminDummyAuth = (req, res, next)=>{
    req.user={role : 'admin'}
    return next()
}


module.exports = {
    requireAdminDummyAuth,
};
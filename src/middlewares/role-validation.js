export const isClientRole = (req, res, next) =>{
    if(!req.user){
        return res.status(500).json({
            msg: 'Cant validate user without validating token first'
        });
    }

    const { role, name} = req.user;

    if(role !== 'CLIENT_ROLE'){
        return res.status(401).json({
            msg: `${name} is not a user, cant use this endpoint`
        })
    }
    next()
}
export const isAdminRole = (req, res, next) =>{
    if(!req.user){
        return res.status(500).json({
            msg: 'Cant validate user without validating token first'
        });
    }

    const { role, name} = req.user;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} is not a user, cant use this endpoint`
        })
    }
    next()
}
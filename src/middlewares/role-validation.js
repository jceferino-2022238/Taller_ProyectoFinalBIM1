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
            msg: `${name} is not a client, cant use this endpoint`
        })
    }
    next()
}
export const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Cant validate user without validating token first'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Not auth user, you have a role ${req.user.role}, the auth roles are ${roles}`
            });
        }
        next();
    };
};
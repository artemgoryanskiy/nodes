import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '')
    if (!token) {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    } else {
        try {
            const decoded = jwt.verify(token, 'secret')
            req.user = decoded._id
            next()
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    }
}
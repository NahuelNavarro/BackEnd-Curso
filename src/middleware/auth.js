export const auth = (req, res, next) => {
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'No existen usuarios autenticados' });
    }
    next(); // Continuar si el usuario está autenticado
};
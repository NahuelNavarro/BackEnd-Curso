export const authDelete = (req, res, next) => {

    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'No existen usuarios autenticados' });
    }

  

    const { rol } = req.session.usuario; // Asegurarse de que el rol está en la sesión

    if (rol === 'user') {
        return res.status(403).json({ error: 'No tienes permiso para borrar productos.' });
    }


    next(); // Continuar si el usuario tiene permisos
};
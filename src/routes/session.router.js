import { Router } from "express";
import { logOut, loginUsuario, registrarUsuario, error } from "../controllers/usuarios.js";
import passport from "passport";

export const router = Router();

router.post('/registro', passport.authenticate("registro", { failureRedirect: "/api/session/error" }), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ payload: "registro exitoso", usuario: req.user });
});

router.get('/error', error);

router.get('/logout', logOut);

router.post('/login', passport.authenticate("login", { failureRedirect: "/api/session/error" }), (req, res) => {
    if (!req.user) {
        return res.status(400).json({ error: "User not authenticated" });
    }

    req.session.usuario = req.user;

    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "login successful", usuario: req.user });
});

router.get('/github', passport.authenticate("github", {}), (req, res) => { });

router.get('/callbackGithub', passport.authenticate("github", { failureRedirect: "/api/session/error" }), (req, res) => {

    req.session.usuario = req.user;
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: "login successful", usuario: req.user });

});


import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { UsuarioMongoManager } from "../dao/UsuarioMongoManager.js";
import { generaHash, validaPassword } from "../utils.js";
import { cartManagerMongo } from "../dao/CartMongoManager.js";

const usuariosManager = new UsuarioMongoManager();
const cartmanager = new cartManagerMongo();


export const initPassport = () => {

    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {
                try {
                    let { nombre } = req.body;
                    if (!nombre) {
                        return done(null, false, { message: "Nombre es requerido" });
                    }
                    let existe = await usuariosManager.getBy({ email: username });
                    if (existe) {
                        return done(null, false, { message: "El usuario ya existe" });
                    }
                    password = generaHash(password);
                    let nuevoCarrito = await cartmanager.create()
                    console.log(nuevoCarrito)
                    let usuario = await usuariosManager.create({ nombre, email: username, password, carrito: nuevoCarrito._id });
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    let usuario = await usuariosManager.getBy({ email: username });
                    if (!usuario) {
                        return done(null, false, { message: "Usuario no encontrado" });
                    }

                    if (!validaPassword(password, usuario.password)) {
                        return done(null, false, { message: "Contraseña incorrecta" });
                    }

                    usuario = { ...usuario };
                    delete usuario.password; // Eliminar el password y otros datos sensibles

                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: "Iv23libxVoqvqDrFUCtq",
                clientSecret: "b9330741740c058326045043ad1f0c8104ba9bc3",
                callbackURL: "http://localhost:8080/api/session/callbackGithub",
            },

            async (accessToken, refreshToken, profile, done) => {
                try {
                    // GitHub profile's display name and emails array
                    let nombre = profile.displayName || profile.username;
                    let email = null;

                    // Attempt to get the primary email from the emails array
                    if (profile.emails && profile.emails.length > 0) {
                        email = profile.emails.find((email) => email.primary).value;
                    }

                    // If email is still null, fetch the user's emails using the access token
                    if (!email) {
                        const response = await fetch('https://api.github.com/user/emails', {
                            headers: {
                                Authorization: `token ${accessToken}`
                            }
                        });
                        const emails = await response.json();
                        const primaryEmailObj = emails.find((emailObj) => emailObj.primary);
                        if (primaryEmailObj) {
                            email = primaryEmailObj.email;
                        }
                    }

                    console.log(email);
                    console.log(nombre);

                    if (!email) {
                        return done(null, false, { message: 'Email not found' });
                    }

                    let usuario = await usuariosManager.getBy({ email });
                    if (!usuario) {
                        usuario = await usuariosManager.create({
                            nombre, email, profile
                        });
                    }
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        ))

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let usuario = await usuariosManager.getBy({ _id: id });
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    });
};
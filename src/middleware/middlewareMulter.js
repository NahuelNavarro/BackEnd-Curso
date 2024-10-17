import multer from "multer";
import path from "path";

// Configuración del almacenamiento con multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = './src/uploads'; // Carpeta por defecto

        // Determinar la carpeta según el tipo de archivo o ruta
        if (file.fieldname === "profile") {
            folder = path.join(folder, 'profile');
        } else if (file.fieldname === "product") {
            folder = path.join(folder, 'products');
        } else if (file.fieldname === "document") {
            folder = path.join(folder, 'documents');
        }

        // Crear la carpeta si no existe (opcional)
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        // Verificar que sea una imagen o documento
        let tipo = file.mimetype.split("/")[0];
        if (file.fieldname === "profile" || file.fieldname === "product") {
            if (tipo !== "image") {
                return cb(new Error("Solo se admiten imágenes para perfil o productos"));
            }
        }

        // Generar un nombre de archivo único
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Exportar la configuración de multer
export const upload = multer({ storage: storage });
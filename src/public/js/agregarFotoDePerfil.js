const recuperar = async () => {
    // Obtén el valor del input de email
    let inputMail = document.getElementById("email").value;
    console.log(`El mail: ${inputMail}`);
    
    // Asegúrate de que el valor del email esté correctamente codificado
    let encodedEmail = encodeURIComponent(inputMail);
    
    try {
        // Realiza la solicitud al servidor
        let res = await fetch(`/api/user/email/${encodedEmail}`, { method: "GET" });

        // Verifica el estado de la respuesta
        if (res.ok) {
            let datos = await res.json();
            alert(`Se ha enviado un mail a ${inputMail}, ingrese la clave token`);

            
            console.log(datos);
        } else {
            console.error(`Error: ${res.status} ${res.statusText}`);
            alert(`no existe el mail ${inputMail} en nuestra base de datos`);

        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante la solicitud
        console.error('Error en la solicitud:', error);
    }
};

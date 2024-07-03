const finalizarCompra = async (cid) => {
    
    alert("Compra finalizada");
    try {
        let res = await fetch(`/api/carts/${cid}/purchase`, { method: "POST" });

        if (res.status === 200) {
            let datos = await res.json();
            console.log(datos);
            alert("Compra realizada con éxito");
        } else {
            let error = await res.json();
            console.error(error);
            alert(`Error: ${error.msg}`);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al realizar la compra. Intente nuevamente.');
    }
}
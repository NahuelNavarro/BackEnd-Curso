const comprar = async (pid) => {
    let inPutCarrito = document.getElementById("carrito")
    let cid = inPutCarrito.value
    console.log(`codigo producto ${pid}, codigo carrito ${cid}`)
    alert("producto agregado al carrito")
    let res = await fetch (`/api/carts/${cid}/product/${pid}`,{method:"post"})
    if(res.status == 200 ){
        let datos = await res.json()
        console.log(datos)
    }
}

const socket = io();


socket.on('productos', productos => {
    const tbody = document.getElementById('productos-body')
    tbody.innerHTML = '';
    productos.forEach(element => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${element._id}</td>
            <td>${element.title}</td>
            <td>${element.price}</td>
            `
    });
});

const formulario = document.getElementById('product-form')
formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const titulo = document.getElementById('title').value;
    const descripcion = document.getElementById('description').value;
    const precio = document.getElementById('price').value;
    const codigo = document.getElementById('code').value;
    const status = document.getElementById('status').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('category').value;

    const nuevoProducto = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        status: status,
        stock: stock,
        category: categoria
    }

    socket.emit('agregarProducto',nuevoProducto)
}
)


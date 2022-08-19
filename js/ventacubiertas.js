
// Array de stock de cubiertas
const stockCubiertas = [
    {
        'id': 1,
        'precio': 32000,
        'descripcion': 'BRIDGESTONE-POTENZA-RE050A-RFT',
        'medida': '225/65/17'
    },
    {
        'id': 2,
        'precio': 33000,
        'descripcion': 'BRIDGESTONE-TURANZA-T001',
        'medida': '225/70/15'
    },
    {
        'id': 3,
        'precio': 31000,
        'descripcion': 'DUNLOP-DIREZZA-DZ102',
        'medida': '265/10/16'
    },
    {
        'id': 4,
        'precio': 36000,
        'descripcion': 'DUNLOP-DIREZZA-Z3_265-35R18',
        'medida': '195/70/15'
    },
    {
        'id': 5,
        'precio': 42000,
        'descripcion': 'MICHELIN-AGILIS3',
        'medida': '205/65/16'
    },
    {
        'id': 6,
        'precio': 34000,
        'descripcion': 'MICHELIN-LATITUDECROSS',
        'medida': '225/70/17'
    }
]

// Selectores DOM
const contenedorProductos = document.querySelector(".grillaProductos")
const grillaWrapper = document.querySelector(".grillaWrapper")
const btnContinuarCompra = document.querySelector(".btnContinuarCompra")
const alertaCompra = document.querySelector(".alertaCompra")
const btnAgregar = document.getElementsByClassName("btnAgregarProducto")
const DOMCarrito = document.querySelector(".mostrarCarrito")
// Si hay datos en carrito localStorage los trae, sino declara el carrito vacío
let carrito = JSON.parse(localStorage .getItem('carrito')) || []

let nombreUsuario = ''
let email = ''
let html=''
let precioTotal = []

// Generando la grilla de productos con el array
for (cubierta of stockCubiertas) {
    html = `<div class="cajaProducto" id="${cubierta.id}">
                <img class="imgProducto" src="../img/catalogos/cubiertas/${cubierta.descripcion}.png" alt="imagen-cubierta-${cubierta.descripcion}">
                <p class="precioCubierta"><strong>$ ${cubierta.precio}</strong></p>
                <p class="descripcionCubierta">${cubierta.descripcion}</p>
                <p class="medidaCubierta">${cubierta.medida}</p>
                <button class="btnAgregarProducto">Agregar</button>
            </div>`
    contenedorProductos.innerHTML += html
}

// Evento click para continuar la compra una vez ingresados los datos
btnContinuarCompra.addEventListener("click", (e) => {
    e.preventDefault()
    validarDatos()
})

// Function para validar datos, si los campos no son vacíos habilita las cards de productos para comprar con animaciones opacity (y deshabilita el botón de "continuar compra". Si los campos están vacíos manda msj pidiendo completarlos)
const validarDatos = () => {
    nombreUsuario = document.querySelector(".nombreApellido").value
    email = document.querySelector(".email").value
    if (nombreUsuario.length == 0 || email.length == 0) {
        alertaCompra.style.aligntext = 'center'
        alertaCompra.innerText = 'Por favor ingrese su nombre, apellido y email'
    } else {
        alertaCompra.innerText = ''
        btnContinuarCompra.style.opacity = '0'
        btnContinuarCompra.disabled = 'true'
        grillaWrapper.style.opacity = '1'
        // Guardando datos personales comprador en storage
        localStorage.setItem('nombreApellido', JSON.stringify(nombreUsuario))
        localStorage.setItem('email', JSON.stringify(email))
    }
}

// Bucle event click botones "agregar" de las cards asociados al id de cada objeto del array
for (let i=0; i<btnAgregar.length; i++){
    btnAgregar[i].addEventListener("click", function (){
        idProductoAgregado = this.parentElement.id
        carrito.push(idProductoAgregado)
        console.log(carrito)
        mostrarCarrito()
    }, false)
}

function mostrarCarrito (){
    // Limpiar DOM carrito
    DOMCarrito.innerHTML = ''
    // Obtener datos usuario local storage para encabezado del carrito
    nombreApellidoLocalStorage = JSON.parse(localStorage.getItem('nombreApellido'))
    tituloCarrito = document.createElement('H4')
    tituloCarrito.innerText = `Estimado/a ${nombreApellidoLocalStorage}`
    DOMCarrito.append(tituloCarrito)
    // Quitando los repetidos para no mostrar un producto adicional igual en el carrito cada vez que se hace click en agregar
    const productosRepetidos = [...new Set(carrito)]
    for (idProducto of productosRepetidos){
        // Obtener producto del array que coincida con el id
        const productoPorId = stockCubiertas.filter(idStockCubiertas => idStockCubiertas.id == idProducto)
        // Ver en el array del carrito cuántos repetidos hay
        const unidadesProducto = carrito.reduce((total, id) => {
            // Si coinciden los id, los sumo al total
            return id === idProducto ? total += 1 : total;
        }, 0)
        // Volcando carrito al DOM
        li = document.createElement('LI')
        li.innerHTML = `Su compra:  ${productoPorId[0].descripcion} - $${productoPorId[0].precio} x ${unidadesProducto}`
        DOMCarrito.append(li)
        // Volcando a un array la sumatoria de los precios
        precioTotal.push(productoPorId[0].precio)
    }

    // Función precio total carrito
    sumaTotal()

    // Btn finalizar compra
    btnFinalizarCompra = document.createElement('BUTTON')
    btnFinalizarCompra.classList.add('btnFinalizarCompra')
    btnFinalizarCompra.innerText = 'Finalizar compra'
    DOMCarrito.append(btnFinalizarCompra)

    // Evento click btn finalizar compra
    finalizarCompra = document.querySelector('.btnFinalizarCompra')
    finalizarCompra.addEventListener ("click", () => {
            // Obtener datos email para msj final pie de carrito
            emailLocalStorage = JSON.parse(localStorage.getItem('email'))
            pieCarrito = document.createElement('H6')
            pieCarrito.innerText = `Muchas gracias, hemos enviado un mail a su casilla ${emailLocalStorage} con los datos para el pago`
            DOMCarrito.append(pieCarrito)
            // Sweetalert compra terminada
            swal({
                title: "¡Muchas gracias!",
                text: `Hemos enviado un mail a su casilla ${emailLocalStorage} con los datos para el pago`,
                icon: "success",
                button: "Cerrar",
            });
            // Vaciar localStorage
            localStorage.clear()
            // Limpiar DOM carrito
            DOMCarrito.innerHTML = ''
            // Vaciar carrito
            carrito = []
            // Limpiar datos usuario
            document.querySelector(".nombreApellido").value = ''
            document.querySelector(".email").value = ''
        }
    )
}

function sumaTotal (){
    // Sumando total
    const precioAcumulado = precioTotal.reduce((acumulado, valorActual) => {
        return acumulado + valorActual;
    }, 0)
    // Volcando resultado al DOM carrito
    liPrecioAcumulado = document.createElement('LI')
    liPrecioAcumulado.innerHTML = `Total de su compra: <strong>$${precioAcumulado}</strong>`
    DOMCarrito.append(liPrecioAcumulado)
}
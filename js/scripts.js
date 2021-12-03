//variables globales
let dataProductos;
let dataProductosFiltrado = dataProductos;
//let carritoSinDuplicados;
let carrito = [];
let total = 0;
//DOM
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;





const URL_JSON = './js/data.json'

$.getJSON(URL_JSON, function (respuesta, estado) {

    if (estado !== 'success') {
        throw new Error('error')
    }

    dataProductos = respuesta;
    dataProductosFiltrado = respuesta;

    // Inicio
    cargarCarritoDeLocalStorage();
    mostrarProductos(dataProductosFiltrado);
    mostrarCarrito();
    calcularTotal();
});






// Funciones
//filtros
function eliminarFiltros() {
    mostrarProductos(dataProductos);
}

function filtroMujer() {
    dataProductosFiltrado = dataProductos.filter(info => info.tipo == "Mujer");
    mostrarProductos(dataProductosFiltrado);
}
function filtroHombre() {
    dataProductosFiltrado = dataProductos.filter(info => info.tipo == "Hombre");
    mostrarProductos(dataProductosFiltrado);
}
function filtroAccesorios() {
    dataProductosFiltrado = dataProductos.filter(info => info.tipo == "Accesorios");
    mostrarProductos(dataProductosFiltrado);

}




//mostrar productos en html
function mostrarProductos(evento) {
    DOMitems.textContent = '';
    evento.forEach((info) => {
        $('#items').append(
            `
                <div class = "card col-sm-4">
                    <div class = "card-body">
                        <img class = "img-fluid" src = "./img/${info.imagen} ">                        

                        <h5 class = "card-title">
                            ${info.nombre}
                        </h5>

                        <p class = "card-text">
                            $ ${info.precio}
                        </p>

                        <button class = "btn btn-primary botonAgregar" marcador = ${info.id}>Agregar</button>
                    </div>
                </div>
                `
        )
    });

    //agrego al carrito directamente
    $(".botonAgregar").click(function (evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
        calcularTotal();
    });

    //Animacion carrito IN
    $(".botonAgregar").click(() => {
        $('.resumen').fadeIn(); 
    });
}



//mostrar productos del carrito
function mostrarCarrito() {

    DOMcarrito.textContent = '';
    //duplicados
    let carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach((item) => {
        let miItem = dataProductos.filter((itemBaseDatos) => {            
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        let numeroUnidadesItem = carrito.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const nodo = document.createElement('li');
        nodo.classList.add('listaProductos', 'list-group-item', 'text-right', 'mx-2');
        nodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].precio}`;

        // Boton de borrar
        const botonBorrar = document.createElement('button');
        botonBorrar.classList.add('btn', 'btn-secondary', 'mx-5');
        botonBorrar.textContent = '-';
        botonBorrar.style.marginLeft = '1rem';
        botonBorrar.dataset.item = item;
        botonBorrar.addEventListener('click', borrarItemCarrito);

        // Mezclamos nodos
        nodo.appendChild(botonBorrar);
        DOMcarrito.appendChild(nodo);
    });
}

//borrar item carrito
function borrarItemCarrito(evento) {
    const id = evento.target.dataset.item;
    //borrar de a uno
    const index = carrito.indexOf(id)
    carrito.splice(index, 1)
    /* carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    }); */

    mostrarCarrito();
    calcularTotal();
    guardarCarritoEnLocalStorage();
}

//funciones para ordenar
function ordenarPrecioBajo() {
    dataProductosFiltrado.sort(function (a, b) {
        if (a.precio > b.precio) {
            return 1;
        }
        if (a.precio < b.precio) {
            return -1;
        }
        //
        return 0;
    });

    mostrarProductos(dataProductosFiltrado);
    //return dataProductosFiltrado;
}

function ordenarPrecioAlto() {
    dataProductosFiltrado.sort(function (a, b) {
        if (a.precio < b.precio) {
            return 1;
        }
        if (a.precio > b.precio) {
            return -1;
        }
        //
        return 0;
    });

    mostrarProductos(dataProductosFiltrado);
    //return dataProductosFiltrado;
}

function ordenarNombre() {
    dataProductosFiltrado.sort(function (a, b) {
        if (a.nombre > b.nombre) {
            return 1;
        }
        if (a.nombre < b.nombre) {
            return -1;
        }
        //
        return 0;
    });

    mostrarProductos(dataProductosFiltrado);
    //return dataProductosFiltrado;
}


//suma
function calcularTotal() {
    total = 0;
    carrito.forEach((item) => {
        // De cada elemento obtenemos su precio
        const miItem = dataProductosFiltrado.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        total = total + miItem[0].precio;
    });

    DOMtotal.textContent = total;
}

//eliminar carrito
function vaciarCarrito() {
    carrito = [];

    mostrarCarrito();
    calcularTotal();
    // Borra LocalStorage
    localStorage.clear();

}

//storage
function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    if (miLocalStorage.getItem('carrito') !== null) {
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

//Eventos de ordenar
$("#boton-ordenarPrecioBajo").click(() => { ordenarPrecioBajo() });
$("#boton-ordenarPrecioAlto").click(() => { ordenarPrecioAlto() });
$("#boton-ordenarNombre").click(() => { ordenarNombre() });


//Evento filtrado productos
$("#ordenarHombre").click(() => { filtroHombre() });
$("#ordenarMujer").click(() => { filtroMujer() });
$("#ordenarAccesorios").click(() => { filtroAccesorios() });
$("#ordenarTodos").click(() => { eliminarFiltros() });




//animaciones
$(document).ready(function () { 
    //animacion out
    $("#boton-vaciar").click(() => {
        $('.resumen').fadeOut(500, () => {
            $("#AlertaVacio").show();

        });
    });

    $("#boton-continuar").click(() => {
        $('.resumen').fadeOut(500, () => {
            $("#AlertaSucces").show();

        });
    });

    $(".close").click(() => {
        $('#AlertaVacio').hide();
        $('#AlertaSucces').hide();
    });
    
});

window.onscroll = function() {funcionStiky()};

var resumen = document.getElementById("resumen");
var sticky = resumen.offsetTop;
function funcionStiky() {
  if (window.pageYOffset >= sticky) {
    resumen.classList.add("sticky")
  } else {
    resumen.classList.remove("sticky");
  }
}








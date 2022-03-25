
//Variables
// No se va reasignar, se usa mucho en contenido HTML
const carrito = document.querySelector('#carrito');
//Lista de cursos
const listaCursos = document.querySelector('#lista-cursos');

//Seleccionamos el tbody que es donde queremos guardar los productos
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
//Vaciar carrito
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
//Carrito de compras
let articulosCarrito = [];

cargarEventListeners();

function cargarEventListeners(){
    //Cuando agregas un curso presionando agregar al carrito.
    listaCursos.addEventListener("click", agregarCurso);

    //eliminar cursos
    carrito.addEventListener('click', eliminarCurso);
    
     document.addEventListener("DOMContentLoaded", ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener("click", ()=>{
        articulosCarrito = []; // Resetear el carrito
        limparHTML();
    });
}


// ****************** FUNCIONES *************************

function agregarCurso(e){
    e.preventDefault();

    //Verificamos que se hizo click en el boton agregar al carrito
    if (e.target.classList.contains('agregar-carrito')){
        //Usamos parent Element para movernos hacia arriba
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);

        // console.log(cursoSeleccionado);    
    }

    
}

//Eliminar curso de carrito
function eliminarCurso(e){

    if (e.target.classList.contains("borrar-curso")){
        const cursoId = e.target.getAttribute('data-id');

        //Eliminar del arreglo articulosCarrito con .filter
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        
        //Iteramos sobre el carrito de nuevo y mostrar su HTML
        carritoHTML();
    }
    
    console.log(e.target.classList);
}

// Lee el contenido HTML y extrae la informacion del curso al que se hizo click
function leerDatosCurso(curso){

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        //Obtener path de la imagen
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('.info-card h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1,
    };

    //Revisa si un elemento ya existe en el carrito con .some,va retornar un TRUE OR FALSE.
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if( existe ){
        //Actualizar cantidad
        const cursos = articulosCarrito.map( curso => {

            if (curso.id === infoCurso.id){
                curso.cantidad++;

                return curso; // Retorna el objeto actualizado
            }else{
                return curso; //Retorna los objetos no duplicados
            }
            
        } );

        articulosCarrito = [...cursos];

    } else{
        //Agregamos curso al carrito
        //Agregar elementos al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    


    carritoHTML();

}

//Mostrar el carrito en el HTML
function carritoHTML(){

    // Limpiar el HTML
    limparHTML();


    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td> <img src= ${imagen} width=120> </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td> <a href="#" class="borrar-curso" data-id="${id}"> X </a> </td>
        `

        //Agregar HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    
    //Agregar carrito al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito))
}


//Elimina los cursos del TBODY
function limparHTML(){
    //Forma lenta
    // contenedorCarrito.innerHTML = '';

    //Forma rapida de limpiar HTML, borra el primer hijo de contenedorCarrito mientras sea true la condicion
    while ( contenedorCarrito.firstChild ){

        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

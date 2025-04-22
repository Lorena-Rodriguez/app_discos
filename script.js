let discos = []; //variable donde almaceno todos los discos (será un array de objetos)

//Create or Update (CRUD)

/*
Creo una función para crear o actualizar un objeto, con prevent default para que no recargue la página
Hago una variable por cada campo del formulario para recoger el valor de las mismas
*/
function createOrUpdate (event) {
const nombre = document.querySelector("#nameDisc").value;
const anio = document.querySelector("#yearDisc").value;
const descripcion = document.querySelector("#descriptionDisc").value;
const url = document.querySelector("#imageUrl").value;

//método preventDefault para prevenir acciones por defecto
event.preventDefault();

//el botón "agregar disco" accede al atributo data-index, ahí es donde se guarda el índice del disco, o se recoge y se modifica este valor (al pulsar el botón)
const index = document.querySelector("#submitBtn").dataset.index;

// Si existe un disco, el usuario editará la card
if (index !== undefined) {
    // Actualizar el disco existente
    discos[index] = { 
        nombre: nombre, 
        anio: anio, 
        descripcion: descripcion, 
        url: url
    };
      // Esto elimina el data-index del botón, para que se resetee el estado del formulario y no se quede en estado de edición
      document.querySelector("#submitBtn").removeAttribute("data-index");
      document.querySelector("#submitBtn").textContent = "Agregar disco"; // Resetea el texto del botón para que vuelva 
 } else {
        // Si no hay un "data-index", directamente se crea un nuevo objeto con los datos del formulario y se añade al final del array con el método .push 
        discos.push({
            nombre: nombre,
            anio: anio,
            descripcion: descripcion,
            url: url
        });
    }

//método para limpiar el formulario tras enviar los datos
    document.querySelector("#nameDisc").value = "";
    document.querySelector("#yearDisc").value = "";
    document.querySelector("#descriptionDisc").value = "";
    document.querySelector("#imageUrl").value = "";


    showDisc(); // se llama a la función showDisc para pintar el objeto en pantalla

//añado un alert con un operador ternario para que el usuario sepa qué está pasando en la app
    alert(index !== undefined ? "¡Disco actualizado exitosamente!" : "¡Disco agregado exitosamente!");
    }

// al botón del formulario se le añade un escuchador para que al hacer clic en el botón se ejecute la función "createOrUpdate", esta función hace dos cosas dependiendo del contexto:
// 1. si el usuario está creando un disco: 
// recoger el valor ingresado en el formulario, meterlo en un objeto y almacenarlo, limpiar el formulario tras enviarlo y enviar la alerta.
// 2. si el usuario está editando un disco:
//  carga los valores del objeto a los campos desde su index, los actualiza en su lugar original, los valores vuelven a guardarse en el mismo lugar gracias al index 
// (asi el disco se actualiza sin cambiar de lugar), se limpia el formulario y se envía la alerta.
    document.querySelector("#formulario").addEventListener("submit", createOrUpdate);   

//Read (CRUD)

//creo la función showDisc para que se muestren los discos creados debajo del formulario
function showDisc() {
    const discContainer = document.querySelector("#discContainer"); // selecciono el div del html

        discContainer.innerHTML = ""; //se borran los elementos del div antes de volver a mostrar los discos, para evitar duplicaciones

        discos.forEach(function(disco, index) { // vuelve a renderizar todos los discos actualizados
            //contenedor de la tarjeta, creo la lista para las cards
            const li = document.createElement("li");
            li.classList.add("card"); //creo una clase para la card




             // creo y agrego el nombre del disco
            const nombre = document.createElement("h5");
            nombre.textContent = disco.nombre;
            li.appendChild(nombre);

            //creo y agrego la imagen del disco
            const img = document.createElement("img"); 
            img.src = disco.url;
            img.alt = `${disco.nombre}`;
            img.title = "Imagen del disco"
            img.classList.add("img-disc"); //clase para la imagen de la card
            li.appendChild(img);

            // creo y agrego el año del disco
            const anio = document.createElement("p");
            anio.textContent = `${disco.anio}`;
            anio.classList.add("anio");
            li.appendChild(anio);

            // creo y agrego la descripción del disco
            const descripcion = document.createElement("p");
            descripcion.textContent = `${disco.descripcion}`;
            descripcion.classList.add("descripcion");
            li.appendChild(descripcion);

            // creo y agrego el div para meter botones de editar y eliminar
            const divButtons = document.createElement("div");
            divButtons.classList.add("card-buttons");
            li.appendChild(divButtons);

            // creo el botón editar de la card
            const editButton = document.createElement("button");
            editButton.textContent = "Editar"; //añado el texto del botón
            editButton.classList.add("edit-btn"); // le añado una clase
            //accesibilidad para que el lector de pantalla ayude a saber qué hace el botón editar
            editButton.setAttribute("aria-label", `Editar el disco ${disco.nombre}`); 


            // se añade un escuchador a cada botón de editar (de cada card, gracias al forEach anterior)
            //para que al hacer click, el botón "Agregar disco" cambie su texto a "Actualizar disco"
            editButton.addEventListener("click", () => {
            // cambio el texto del botón de envío
            document.querySelector("#submitBtn").textContent = "Actualizar disco";

            //recojo los datos de la card que quiero editar, entro en los elementos del objeto disco
            document.querySelector("#nameDisc").value = disco.nombre;
            document.querySelector("#yearDisc").value = disco.anio;
            document.querySelector("#descriptionDisc").value = disco.descripcion;
            document.querySelector("#imageUrl").value = disco.url;

            //se asigna un valor al atributo data-index (del botón del formulario)
            //este valor será el índice (index) que se asigna al disco que se quiera editar dentro del array discos
            //así se podrá recuperar ese índice, reemplazar ese objeto actualizado en vez de crear uno nuevo
            document.querySelector("#submitBtn").dataset.index = index;
            
            //al terminar de editar se hace scroll suave hasta el formulario
            document.querySelector("#formulario").scrollIntoView({ behavior: "smooth" });

            //se pone el foco en el formulario otra vez, en el campo Nombre
            document.querySelector("#nameDisc").focus();

            });

            //Crear botón eliminar
            const deleteButton = document.createElement("button"); //creo el elemento
            deleteButton.textContent = "Eliminar"; //añado el texto al botón
            deleteButton.classList.add("delete-btn"); //añado una clase al botón
            //accesibilidad para que el lector de pantalla ayude a saber qué hace el botón eliminar
            deleteButton.setAttribute("aria-label", `Eliminar el disco ${disco.nombre}`);

            //Delete (CRUD)
            //al hacer clic en el botón elimnar
            deleteButton.addEventListener("click", () => { 
                //se muestra una ventana de confirmación
                if (confirm("¿Estás segura de que quieres eliminar este disco?")) { 
                    //si se confirma, se elimina el disco del array en la posición correspondiente
                    discos.splice(index, 1); //se aplica el método splice (elimina 1 elemento desde la posición index)
                    showDisc(); //a continuación se muestra la lista de discos actualizada
                }

            //al terminar de eliminar un elemento, hace scroll suave hasta el formulario
            document.querySelector("#formulario").scrollIntoView({ behavior: "smooth" });

            //se pone el foco en el formulario otra vez
                document.querySelector("#nameDisc").focus();
            });
            

            //Agregar botones al div
            divButtons.appendChild(editButton);
            divButtons.appendChild(deleteButton);
            
            // Agregar la card al contenedor de discos
            discContainer.appendChild(li);

        });

}

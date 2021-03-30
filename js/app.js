//Campos del Usuario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas{
  constructor(){
      this.citas = [];
  }

  agregarCita(cita){
      this.citas = [...this.citas, cita];
  }
  eliminarCita(id){
     this.citas = this.citas.filter(cita => cita.id !==id);
  }
  editarCitas(citaActualizada){
   this.citas = this.citas.map(cita =>cita.id === citaActualizada.id ? citaActualizada : cita)
  }
}

class UI{
  imprimirAlerta(mensaje,tipo){
      //Crear div
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center','alert','d-block','col-12');

      //Agregar clase en base al tipo de error
      if(tipo === 'error'){
          divMensaje.classList.add('alert-danger');
      }else{
          divMensaje.classList.add('alert-success');
      }

      //Mensaje de error
      divMensaje.textContent = mensaje;

      //Agregar al DOM
      document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

      //Quitar la alerta
      setTimeout(()=>{
      divMensaje.remove();
      },3000);
  }
  imprimirCitas({citas}){
      
      this.limpiarHTML();

      citas.forEach(cita => {
        const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;  
        
        const divCita = document.createElement('div');
        divCita.classList.add('cita','p-3');
        divCita.dataset.id = id;

        //scripting de los elementos
        const mascotaParrafo = document.createElement('h2');
        mascotaParrafo.classList.add('card-title','font-weight-bolder');
        mascotaParrafo.textContent = mascota;

        const propietarioParrafo = document.createElement('p');
        propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span>${propietario}
        `;

        const telefonoParrafo = document.createElement('p');
        telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span>${telefono}
        `;

        const fechaParrafo = document.createElement('p');
        fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span>${fecha}
        `;

        const horaParrafo = document.createElement('p');
        horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span>${hora}
        `;
        const sintomasParrafo = document.createElement('p');
        sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span>${sintomas}
        `;

        //Boton para eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger','mr-2');
        btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        btnEliminar.onclick = () =>eliminarCita(id);

        //Añande un boton para editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn','btn-info');
        btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>';
        btnEditar.onclick = () => cargarEdicion(cita);

        //Agregar los parrafos al dicCita
        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnEliminar);
        divCita.appendChild(btnEditar);

        //Agregar las citas al HTML
        contenedorCitas.appendChild(divCita);
      });
  };
  limpiarHTML(){
      while(contenedorCitas.firstChild){
          contenedorCitas.removeChild(contenedorCitas.firstChild)
      }
  }
}

const ui = new UI();
const administrarCitas = new Citas();


//Registrar Eventos

eventListeners();

function eventListeners(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit',nuevaCita);
}

//Objeto con la informacion de la cita

const citaObj = {
    mascota:'',
    propietario:'',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al obj

function datosCita(e){
   citaObj[e.target.name] = e.target.value;

}
//Valida y agrega una nueva cita
function nuevaCita(e){
    e.preventDefault();
   
    //Extraer la informacion del objeto de cita
    const {mascota,propietario,telefono,fecha,hora,sintomas} = citaObj;

    //Validar
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios','error');
        return;
    }
   
    if(editando){
        ui.imprimirAlerta('Editado correctamente');
        //Pasar  a modo edicion
        
       administrarCitas.editarCitas({...citaObj})

        //texto de botoon
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        //Quitar modo edicion
        editando = false; 
    }else{
           //Generar un id unico
         citaObj.id = Date.now();

         //Creando una nueva cita
         administrarCitas.agregarCita({...citaObj});

         //Mensaje agregagado
         ui.imprimirAlerta('Se agrego correctamente');
    }




 
    
    //Reiniciar el objeto para la validacion
    reiniciarObjeto();

    //Reiniciar formulario
    formulario.reset();

    //Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);


}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    //Elimina la cita
    administrarCitas.eliminarCita(id);

    //muestre un mesaje
  ui.imprimirAlerta('La cita se elimino correctamente');
    //Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas,id} = cita;

    //Llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambio';
    editando = true;
}
//variables
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda = {
        moneda: "",
        criptomoneda: "",
}
//eventos

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
         
    formulario.addEventListener('submit', submitFormulario);
       
     criptomonedasSelect.addEventListener('change', leerValor);
     monedaSelect.addEventListener('change', leerValor);
})

const obtenerCriptomonedas = criptomonedas => new Promise(resolve=>{
        resolve(criptomonedas);
});


//funciones

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    
    // fetch(url)
    //     .then(respuesta=> respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await  obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
        
}

function selectCriptomonedas(criptomonedas) {

        criptomonedas.forEach(cripto => {
                const{ FullName , Name} = cripto.CoinInfo;
        
                //crear la opcion
                const option = document.createElement('option');
                option.textContent = FullName;
                option.value = Name;

                criptomonedasSelect.appendChild(option);
            
        });
}



function leerValor(e) {
        objBusqueda[e.target.name] = e.target.value;
        console.log(objBusqueda);
}

function submitFormulario(e) {
        e.preventDefault();
  // validar
  const {moneda,criptomoneda}= objBusqueda;

  if(moneda==="" || criptomoneda ===""){
          mostrarAlerta('Ambos campos son obligatorios');
          return;
  }

  //Consultar la APi
        consultarApi();
}

function mostrarAlerta(mensaje) {

        const existeAlerta = document.querySelector('.error');
      
        if(!existeAlerta){
                
                const alerta = document.createElement('div');
                alerta.textContent = mensaje;
                alerta.classList.add('error');

                formulario.appendChild(alerta);

                setTimeout(() => {
                        alerta.remove(); 
                 }, 3000);
        }
}

async function consultarApi() {
        const{moneda,criptomoneda}=objBusqueda;
        
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

        mostrarSpinner();
        
         fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion =>{
                imprimirCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
        try {
            const respuesta = await fetch(url);
            const cotizacion = await respuesta.json();
            imprimirCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);

        } catch (error) {
            console.log(error);
        }
}

function imprimirCotizacion(cotizacion) {
        limpiarHTML();
        
        const{ PRICE, HIGHDAY, LOWDAY , CHANGEPCT24HOUR , LASTUPDATE}= cotizacion;
        
        
                const precio = document.createElement('p');
                precio.classList.add('precio');
                precio.innerHTML= `El precio es <span>${PRICE}</span>`;
        
                const  precioAlto = document.createElement('p'); 
                precioAlto.innerHTML= `El precio más alto del día es  <span>${HIGHDAY}</span>`;
             
                const  precioBajo = document.createElement('p');
                precioBajo.innerHTML= `El precio más bajo del día es  <span>${LOWDAY}</span>`;
        
                const  ultimasHoras = document.createElement('p');
                ultimasHoras.innerHTML= `Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}% </span>`;
        
                const  ultimaActualizacion = document.createElement('p');
                ultimaActualizacion.innerHTML= `Ultimas actualizacion <span>${LASTUPDATE}</span>`;
        
                resultado.appendChild(precio);
                resultado.appendChild(precioAlto);
                resultado.appendChild(precioBajo);
                resultado.appendChild(ultimasHoras);
                resultado.appendChild(ultimaActualizacion);

}

function limpiarHTML(){
        while (resultado.firstChild) {
                resultado.removeChild(resultado.firstChild);
        }
}

function mostrarSpinner() {
        limpiarHTML();

        const spinner = document.createElement('div');
        spinner.classList.add('spinner');

        spinner.innerHTML = `

        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
 
        `;

        resultado.appendChild(spinner);
}
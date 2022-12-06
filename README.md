## Iniciar proyecto

Para iniciar el proyecto primero debemos instalar Node y así poder ejecutar los comandos que nos permiten instalar las dependencias y levantar la aplicación.

Node: https://nodejs.org/es/ versión LTS.

Segundo paso, instalamos las dependencias:

<code>npm install</code>

Tercer paso, podemos levantar el proyecto: 

<code>npm start</code>

Eso nos iniciará un servidor local en el puerto 3000 y podremos acceder a la web con la siguiente URL:

http://localhost:3000


## Construcción del Proyecto.

He decidido hacer uso de los hooks de React como useEffect y useState para manipular información que irá cambiando con las acciones que hagamos en la aplicación.
También he ido un poco más allá y he agregado spinner de carga para indicar que algo se está tomando desde la API y también he deshabilitado/habilitado botones cuando realizamos una acción para esperar a la información que llegue desde el Servicio.

En cuanto al Edit que se me ha pedido lo único que he hecho fue simular un PUT al servicio, actualizar ese item en concreto de la lista y visualizar un mensaje de éxito o error según la respuesta del Servicio. El servicio fue mockeado para que edite solo 5 registros, la nueva Sala que sea creada no se tomará en cuenta en el servicio.

No he hecho uso de REDUX o Local Storage para almacenar información porque no lo vi necesario, creo que el challengue cumple con lo requerido.

He decidido usar flexbox para no instalar ninguna dependencia como Material Design o Bootstrap, quise hacerlo a mano con mis conocimientos en diseño.

He hecho uso de la página que me han proporcionado la cual simula ser una API y he agregado un delay de 3 segundos para poder mostrar un mensaje con un spinner de carga así es más amigable para el usuario.

## Dificultades.

No he encontrado dificultades, fue todo bastante sencillo e incluso he mejorado la estructura del challengue con, por ejemplo, el spinner de carga cuando se están haciendo consultas al servicio.

## Function numPages:

-   Funcion que permite calcular el numero de paginas en las que debera ser divida la plataforma, al dividir el tamaño del arreglo entre los datos permitidor por pagina.


## Function changePage:

-   Params: {page (int)}
-   Funcion que permite la paginacion dentro de la plataforma:
+  Paso 1: Accesar a los botones de prev y next para poder detectar cuando hay un evento de click en ellos, tambien se accesa a la referencia del label de paginas para poder imprimir sobre el.
+  Pas 2: Se valido el valor de la pagina recibida, para saber que numero se imprimira en la vista, se hace la llamada a la funcion de numPages, para validar el numero de paginas que se deben retornar.
+ Paso 3: Validar que el api retorne informacion, para imprimir un mensaje en caso de ser necesario.
+ Paso 4: Recorrer mediante un forEach el arreglo que retorne el api, el cual crea un nuevo arreglo temporal para dividir el arreglo principal en secciones y asi poder enviar
 dicha informacion a la funcion de listProducts.
 Paso 5: Validar El valor de page, para saber en que momento mostrar los botones de prev y next.

## Function fetchData:

-   variables:Permite agrupar 1 o mas variables en un objeto.
-   Fetch: Llamada al api, se debe indicar la url de donde se obtendran los tados, una vez recibida una promesa, 
    se trabaja con la respuesta.

## Function fetchCategory:

+ Permite la llamada al api que retornara la lista de categorias existente.

## Function changeFilterAlphIcon:

+ Validacion que permite saber el valor que tiene  el sorter alfabetico, para retorana un icono diferente en el boton de filtro, segun sea el caso.

## Function changeFilterPriceIcon:

+ Validacion que permite saber el valor que tiene  el sorter del precio, para retorana un icono diferente en el boton de filtro, segun sea el caso.

## Function listProducts:

+ Params: {products (array)}
+ Permite imprimir la lista de productos, segun lo que retorne el api, mediante un forEach recorre los producto recibidos, y se accesa al template que contiene la estructura 
de los cards.

## Function listCategories:

+ Params: {data (array)}
+ Permite imprimir la lista de categorias, segun lo que retorne el api, mediante un forEach recorre las categorias recibidas, y crea un nueva opcion dentro del componente de select.

## Function search:

+ Permite modificar el valor de la variable global de filterName, obteniendo el valor que contenga el componeten de searchInput, haciendo a su vez nuevamente la llamada a la funcion de fetchData para imprimir nuevamente la informacion.

## Function filterCategory:

+ Permite modificar el valor de filterCat, el cual tomara el valor de la opcion seleccionada en el componente select de categorias, a su vez hace una nueva llamada a la funcion de fetchData para imprimir de nuevo la informacion.

## Function prevPage y nextPage:

+ Permite modificar el valor de la pagina en la que se encuentra el usuario, actualizando el valor de la variable global de current_page.

## Function addProduct:

+ Params: {evento}
+ Permite agregar un nuevo elemento al carrito de compras, mediante el evento obtenido se puede accesar a los elementos del componente seleccionado, de esta manera se puede
modificar la variable global de productos para añadir uno nuevo.

## Function showProducts:

+ Permite mostrar lo elementos que se han añadido al carrito, mediante el recorrido del arreglo de productos, se iran modificando los valores de la tabla de carrito.

## Function showOrder:

+ Permite mostrar el card de finalizar orden, primero valida que existan elementos en el carrito, despues calcula los valores de cantidad y precio, segun los elementos del carrito, para poder imprimir en el card, a su vez permite limpiar el carrito finalizando la compra.

## Function modificarProducts:

+ Permite validar si se selecciono el boton de aumentar,disminuir o bien borrar un producto del carrito, posicionandose el id del item seleccionado, para asi poder editar su informacion.

## Function limpiarFiltros:

+ Funcion que permite regresar las variables globales de filtros a su estado original, para mostrar la informacion del api sin ningun filtro.














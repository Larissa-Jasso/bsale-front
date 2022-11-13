document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  fetchCategory();
});

// Seccion de variables
const productCard = document.getElementById("product-card").content;
const products = document.getElementById("products");
const carProducts = document.getElementById("car-products");
const footer = document.getElementById("footer");
const orden = document.getElementById("orden").content;
const templateCarPrd = document.getElementById("template-car-products").content;
const categories = document.getElementById("category");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const sorterAlf = document.getElementById("filter-alfabetico");
const sorterPrice = document.getElementById("filter-precio");
const sorterDesc = document.getElementById("filter-descuento");
const cleanFilters = document.getElementById("limpiar");
const fragment = document.createDocumentFragment();
let data = {};
let car_products = {};
var current_page = 1;
var records_per_page = 5;
var num_pages = 0;

var filterName = null;
var filterCat = null;
var filterAlph = false;
var filterPrice = false;
var filterDesc = false;

let dropdown = document.getElementById("category");
dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "Todos";
defaultOption.value = "All";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

// Seccion de listeners
searchButton.addEventListener("click", (e) => {
  search();
});

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    search();
  }
});

searchInput.addEventListener("input", (e) => {
  if (searchInput.value == "") {
    filterName = searchInput.value;
    fetchData();
  }
});

dropdown.addEventListener(
  "input",
  function (event) {
    filterCategory(event);
  },
  false
);

sorterAlf.addEventListener("click", (e) => {
  filterAlph = !filterAlph;
  changeFilterAlphIcon();
  fetchData();
});

sorterPrice.addEventListener("click", (e) => {
  filterPrice = !filterPrice;
  changeFilterPriceIcon();
  fetchData();
});
cleanFilters.addEventListener("click", (e) => {
  limpiarFiltros();
});

sorterDesc.addEventListener("change", function () {
  filterDesc = !filterDesc;
  fetchData();
});

products.addEventListener("click", (e) => {
  addProduct(e);
});

carProducts.addEventListener("click", (e) => {
  modificarProducts(e);
});

// Seccion de funciones
const fetchData = async () => {
  variables = {
    name: filterName,
    category: filterCat,
    alphabetic: filterAlph,
    price: filterPrice,
    discount: filterDesc,
  };

  fetch("http://127.0.0.1:8000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(variables),
  })
    .then((response) => response.json())
    .then((prod) => {
      data = { ...prod };
      changePage(current_page);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const fetchCategory = async () => {
  const categories = await fetch("http://127.0.0.1:8000/api/categories");
  const cat = await categories.json();
  listCategories(cat);
};

function changeFilterAlphIcon() {
  if (filterAlph) {
    sorterAlf.innerHTML = `
        A-Z <i class="fa fa-caret-up"></i>
            `;
  } else {
    sorterAlf.innerHTML = `
        A-Z <i class="fa fa-caret-down"></i>
            `;
  }
}
function changeFilterPriceIcon() {
  if (filterPrice) {
    sorterPrice.innerHTML = `
        Price <i class="fa fa-caret-up"></i>
            `;
  } else {
    sorterPrice.innerHTML = `
        Price <i class="fa fa-caret-down"></i>
            `;
  }
}

const listProducts = (product) => {
  product.forEach((item) => {
    productCard.querySelector("h5").textContent = item.name;
    productCard.querySelector("p").textContent = item.price;
    productCard.querySelector("label").textContent =
      "Descuento $" + item.discount;
    const image = productCard.querySelector("img");
    image.src = item.url_image;
    image.alt = item.name;
    productCard.querySelector("button").dataset.id = item.id;
    const clone = productCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  fragment.lastChild
    ? products.replaceChildren(fragment, fragment.lastChild)
    : products.appendChild(fragment);
};

const listCategories = (data) => {
  let option;

  data.forEach((item) => {
    option = document.createElement("option");
    option.text = item.name;
    option.value = item.id;
    dropdown.add(option);
  });
};

const search = () => {
  filterName = searchInput.value;
  fetchData();
};

const filterCategory = (event) => {
  if (event.target.value == "All") {
    filterCat = null;
  } else {
    filterCat = event.target.value;
  }
  fetchData();
};

function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
  }
}

function changePage(page) {
  var next = document.getElementById("btn_next");
  var prev = document.getElementById("btn_prev");
  var actual_page = document.getElementById("page");
  var pages = document.getElementById("pages");

  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();
  let new_data = [];
  
  if (Object.values(data).length == 0) {
    products.innerHTML = `
    <label class="mt-5 mb-5" ><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> No hay conincidencias para esta busqueda</label>
    
    `;
  } else {
    for (
      var i = (page - 1) * records_per_page;
      i < page * records_per_page && i < Object.values(data).length;
      i++
    ) {
      new_data.push(data[i]);
    }
    listProducts(new_data);

    actual_page.innerHTML = page;
    pages.innerHTML = num_pages;

    if (page == 1) {
      prev.style.visibility = "hidden";
    } else {
      prev.style.visibility = "visible";
    }

    if (page == numPages()) {
      next.style.visibility = "hidden";
    } else {
      next.style.visibility = "visible";
    }
  }
}

function numPages() {
  num_pages = Math.ceil(Object.values(data).length / records_per_page);
  return num_pages;
}

const addProduct = (e) => {
  if (e.target.classList.contains("btn-warning")) {
    prod = e.target.parentElement;
    const producto = {
      title: prod.querySelector("h5").textContent,
      precio: prod.querySelector("p").textContent,
      id: prod.querySelector("button").dataset.id,
      cantidad: 1,
    };
    if (car_products.hasOwnProperty(producto.id)) {
      producto.cantidad = car_products[producto.id].cantidad + 1;
    }

    car_products[producto.id] = { ...producto };

    showProducts();
  }
  e.stopPropagation();
};

const showProducts = () => {
  carProducts.innerHTML = "";

  Object.values(car_products).forEach((producto) => {
    templateCarPrd.querySelector("th").textContent = producto.id;
    templateCarPrd.querySelectorAll("td")[0].textContent = producto.title;
    templateCarPrd.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarPrd.querySelectorAll("td")[2].textContent =
      producto.precio * producto.cantidad;

    templateCarPrd.querySelector(".btn-success").dataset.id = producto.id;
    templateCarPrd.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarPrd.querySelector(".btn-outline-danger").dataset.id =
      producto.id;

    const clone = templateCarPrd.cloneNode(true);
    fragment.appendChild(clone);
  });
  carProducts.appendChild(fragment);

  showOrder();
};

const showOrder = () => {
  footer.innerHTML = "";
  if (Object.keys(car_products).length === 0) {
    footer.innerHTML = `
        <label>No hay productos añadidos</label>
        `;
    return;
  }
  const nCantidad = Object.values(car_products).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(car_products).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  orden.querySelectorAll("label")[1].textContent = nCantidad;
  orden.querySelectorAll("label")[3].textContent = "$" + nPrecio;

  const clone = orden.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);

  const boton = document.querySelector("#pagar");
  boton.addEventListener("click", () => {
    car_products = {};
    showProducts();
    alert("Gracias por su compra, total: $" + nPrecio);
  });
};

const modificarProducts = (e) => {
  if (e.target.classList.contains("btn-success")) {
    const producto = car_products[e.target.dataset.id];
    producto.cantidad++;
    car_products[e.target.dataset.id] = { ...producto };
    showProducts();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = car_products[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete car_products[e.target.dataset.id];
    } else {
      car_products[e.target.dataset.id] = { ...producto };
    }
    showProducts();
  }

  if (e.target.classList.contains("btn-outline-danger")) {
    delete car_products[e.target.dataset.id];

    showProducts();
  }
  e.stopPropagation();
};

function limpiarFiltros() {
  sorterDesc.checked = false;
  searchInput.value = "";
  categories.value = "All";

  (filterCat = null), 
  (filterAlph = false);
  filterCat = null;
  filterPrice = false;
  filterName = null;

  changeFilterAlphIcon();
  changeFilterPriceIcon();

  fetchData();
}

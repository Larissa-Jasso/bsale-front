document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();
  fetchCategory();
});

const productCard = document.getElementById("product-card").content;
const products = document.getElementById("products");
const categories = document.getElementById("category");
const hcList = document.getElementById("hclist");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const sorterAlf = document.getElementById("filter-alfabetico");
const sorterPrice = document.getElementById("filter-precio");
const sorterDesc = document.getElementById("filter-descuento");
const fragment = document.createDocumentFragment();
let data = {};
var current_page = 1;
var records_per_page = 10;
var num_pages = 0;
let dropdown = document.getElementById("category");
dropdown.length = 0;

let defaultOption = document.createElement("option");
defaultOption.text = "Todos";
defaultOption.value = "All";

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;

searchButton.addEventListener("click", (e) => {
  search();
});

searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    search();
  }
});
searchInput.addEventListener("input", (e) => {
  console.log(searchInput.value);
  if (searchInput.value == "") {
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
  sorter(1);
});

sorterPrice.addEventListener("click", (e) => {
  sorter(2);
});

sorterDesc.addEventListener("change", function () {
  if (this.checked) {
    sorter(3);
  } else {
    fetchData();
  }
});

const fetchData = async () => {
  const product = await fetch("http://127.0.0.1:8000/api/products");
  const res = await product.json();
  data = { ...res };
  changePage(1);
};
const fetchCategory = async () => {
  const categories = await fetch("http://127.0.0.1:8000/api/categories");
  const cat = await categories.json();
  listCategories(cat);
};

const listProducts = (product) => {
  product.forEach((item) => {
    productCard.querySelector("h5").textContent = item.name;
    productCard.querySelector("p").textContent = "Precio $" + item.price;
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
  const inputValue = searchInput.value;

  if (inputValue == "") {
    fetchData();
  }

  fetch(`http://127.0.0.1:8000/api/search_product/${inputValue}`).then(
    (response) =>
      response
        .json()
        .then((data) => ({ data }))
        .then((productData) => {
          data = { ...productData.data };
          changePage(current_page);
        })
  );
};

const filterCategory = (event) => {
  if (event.target.value == "All") {
    fetchData();
  } else {
    fetch(
      `http://127.0.0.1:8000/api/produts_by_category/${event.target.value}`
    ).then((response) =>
      response
        .json()
        .then((data) => ({ data }))
        .then((productData) => {
          data = { ...productData.data };
          changePage(current_page);
        })
    );
  }
};

const sorter = (option) => {
  fetch(`http://127.0.0.1:8000/api/sorter_product/${option}`).then((response) =>
    response
      .json()
      .then((data) => ({ data }))
      .then((productData) => {
        data = { ...productData.data };
        changePage(current_page);
      })
  );
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

function numPages() {
  num_pages = Math.ceil(Object.values(data).length / records_per_page);
  return num_pages;
}

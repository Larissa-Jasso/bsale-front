document.addEventListener("DOMContentLoaded", (e) => {
  fetchData();

});

const productCard = document.getElementById("product-card").content;
const products = document.getElementById("products");


const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");



searchButton.addEventListener("click", (e) => {
  search();
});

searchInput.addEventListener("input", (e) => {
  search();
});

searchInput.onkeyup = function () {
  search();
};


const fragment = document.createDocumentFragment();

const fetchData = async () => {
  const product = await fetch("http://127.0.0.1:8000/api/products");
  const data = await product.json();
  listProducts(data);
};

const listProducts = (data) => {
  data.forEach((item) => {
    productCard.querySelector("h5").textContent = item.name;
    productCard.querySelector("p").textContent = "$" + item.price;
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
          listProducts(productData.data);
        })
  );
};


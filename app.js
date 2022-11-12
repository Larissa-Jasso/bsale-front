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

const fragment = document.createDocumentFragment();

const fetchData = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/products");
  const data = await res.json(); 
  listProducts(data);
};


const listProducts = (data) => {

  data.forEach((item) => {
    console.log(item.url_image);
    productCard.querySelector("h5").textContent = item.name;
    productCard.querySelector("p").textContent = "$" + item.price;
    const image = productCard.querySelector("img");
    image.src = item.url_image;
    image.alt = item.name;
    productCard.querySelector("button").dataset.id = item.id;
    const clone = productCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  products.appendChild(fragment);
};

const search = () => {
  const inputValue = searchInput.value;

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

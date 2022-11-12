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
  
  searchInput.addEventListener("keypress", function(event) {
  
    if (event.key === "Enter") {
        search();
    }
  });
  searchInput.addEventListener("input", (e) => {
    console.log(searchInput.value);
    if(searchInput.value == ""){
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
  
  sorterDesc.addEventListener('change', function() {
    if (this.checked) {
        sorter(3);
    } else {
     fetchData();
    }
  });
  
  const fetchData = async () => {
    const product = await fetch("http://127.0.0.1:8000/api/products");
    const data = await product.json();
    listProducts(data);
  };
  const fetchCategory = async () => {
    const categories = await fetch("http://127.0.0.1:8000/api/categories");
    const cat = await categories.json();
    listCategories(cat);
  };
  
  const listProducts = (data) => {
    data.forEach((item) => {
      productCard.querySelector("h5").textContent = item.name;
      productCard.querySelector("p").textContent = "Precio $" + item.price;
      productCard.querySelector("label").textContent = "Descuento $" + item.discount;
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
            listProducts(productData.data);
          })
    );
  };

  const filterCategory = (event) => {
    if (event.target.value == "All") {
      fetchData();
    } else {
      fetch(`http://127.0.0.1:8000/api/produts_by_category/${event.target.value}`).then(
        (response) =>
          response
            .json()
            .then((data) => ({ data }))
            .then((productData) => {
              listProducts(productData.data);
            })
      );
    }
  };
  
  const sorter = (option) => {
   
      fetch(`http://127.0.0.1:8000/api/sorter_product/${option}`).then(
        (response) =>
          response
            .json()
            .then((data) => ({ data }))
            .then((productData) => {
              listProducts(productData.data);
            })
      );
  };
  
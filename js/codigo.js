const shopContent = document.querySelector(".shopContent");
const seeCart = document.getElementById("cart__icon");
const modalContainer = document.querySelector(".modal__invisible");
const cartValue = document.querySelector(".quantity");
const searchBar = document.querySelector(".searchBar");
const filter = document.getElementById("filter");
const selectElement = document.getElementById("select");
const cart = [];

// Función para crear publicaciones
const createPublications = (img, nombre, precio, id, cantidad) => {
    const container = document.createElement("DIV");
    const imagen = document.createElement("IMG");
    const name = document.createElement("H2");
    const price = document.createElement("P");
    const button = document.createElement("BUTTON");

    container.classList.add("container");
    imagen.classList.add("img");
    name.classList.add("name");
    price.classList.add("price");
    button.classList.add("button");

    imagen.src = img;
    name.textContent = nombre;
    price.textContent = `$${precio}`;
    button.textContent = "Comprar";

    button.addEventListener("click", () => {
        const productExist = cart.find(item => item.id === id);
        if (productExist) {
            productExist.cantidad++;
        } else {
            cart.push({
                id: id,
                img: img,
                name: nombre,
                price: parseFloat(precio),
                cantidad: cantidad
            });
        };
        showCart();
        modalContainer.classList.replace("modal__visible", "modal__invisible");
        Toastify({
            text: `Agregó ${nombre} al carrito`,
            duration: 1500,
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "green",
            },
        }).showToast();
    });

    container.appendChild(imagen);
    container.appendChild(name);
    container.appendChild(price);
    container.appendChild(button);

    return container;
};

// Mostrar publicaciones desde el JSON

const createPublication = async () => {
    const request = await fetch("./data.json");
    const content = await request.json();
    const arr = content.content;
    const documentFragment = document.createDocumentFragment();

    for (let i = 0; i < arr.length; i++) {
        const newPublication = createPublications(arr[i].img, arr[i].nombre, arr[i].precio, arr[i].id, arr[i].cantidad);
        documentFragment.appendChild(newPublication);
    }
    shopContent.appendChild(documentFragment);
};

// SearchBar

const handleSearch = async () => {
    const request = await fetch("./data.json");
    const content = await request.json();
    const arr = content.content;

    const searchTerm = searchBar.value.toLowerCase();
    const filteredObjects = arr.filter((product) => product.nombre.toLowerCase().startsWith(searchTerm));

    shopContent.innerHTML = "";

    filteredObjects.forEach((product) => {
        const newPublication = createPublications(
            product.img,
            product.nombre,
            product.precio,
            product.id,
            product.cantidad
        );
        shopContent.appendChild(newPublication);
    });
};

searchBar.addEventListener("input", handleSearch);

// Filter

const filterProducts = async (category) => {
    const request = await fetch("./data.json");
    const content = await request.json();
    const arr = content.content;

    shopContent.innerHTML = "";

    let filterProducts;
    if (category === "all") {
        filterProducts = arr;
    } else {
        filterProducts = arr.filter(product => product.category === category);
    };

    const documentFragment = document.createDocumentFragment();

    for (const product of filterProducts) {
        const newPublication = createPublications(
            product.img,
            product.nombre,
            product.precio,
            product.id,
            product.cantidad
        );
        documentFragment.appendChild(newPublication);
    };
    shopContent.appendChild(documentFragment);
};

createPublication();

selectElement.addEventListener("change", (e) => {
    const selectedCategory = e.target.value;
    filterProducts(selectedCategory);
});

filter.addEventListener("click", () => {
    selectElement.classList.toggle("visible");
});

// Funcion para mostrar el carrito

const showCart = () => {
    modalContainer.innerHTML = "";

    const modalHeader = document.createElement("DIV");
    const modalButton = document.createElement("P");
    const modalTitle = document.createElement("H2");

    modalHeader.classList.add("modal__header");
    modalButton.classList.add("modal__button");
    modalTitle.classList.add("modal__title");

    modalTitle.textContent = "Cart";
    modalButton.textContent = "X";

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalButton);
    modalContainer.appendChild(modalHeader);

    // Mostrar productos en el carrito

    if (cart.length === 0) {
        const vacio = document.createElement("P");
        vacio.classList.add("vacio");
        vacio.textContent = "¡El carrito está vacío!";
        modalContainer.appendChild(vacio);
    } else {
        const modalBodyContainer = document.createElement("DIV");
        modalBodyContainer.classList.add("modal__bodyContainer");

        cart.forEach(item => {
            const modalBody = document.createElement("DIV");
            const imgModal = document.createElement("IMG");
            const modalName = document.createElement("H2");
            const restar = document.createElement("P");
            const modalQuantity = document.createElement("P");
            const sumar = document.createElement("P");
            const modalPrice = document.createElement("P");
            const deleteProduct = document.createElement("P");

            modalBody.classList.add("modal__body");
            imgModal.classList.add("img__modal");
            modalName.classList.add("name__modal");
            restar.classList.add("restar");
            modalQuantity.classList.add("modal__quantity");
            sumar.classList.add("sumar");
            modalPrice.classList.add("price__modal");
            deleteProduct.classList.add("deleteProduct");

            imgModal.src = item.img;
            modalName.textContent = item.name;
            restar.textContent = "-";
            modalQuantity.textContent = item.cantidad;
            sumar.textContent = "+";
            modalPrice.textContent = "$" + (item.price * item.cantidad).toFixed(2);
            deleteProduct.textContent = "X";

            restar.addEventListener("click", () => {
                if (item.cantidad > 1) {
                    item.cantidad--;
                } else {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                    Toastify({
                        text: `Eliminó ${item.name} del carrito`,
                        duration: 1500,
                        newWindow: true,
                        close: true,
                        gravity: "bottom",
                        position: "left",
                        stopOnFocus: true,
                        style: {
                            background: "red",
                        },
                    }).showToast();
                }
                showCart();
            });

            sumar.addEventListener("click", () => {
                if (item.cantidad < 50) {
                    item.cantidad++;
                    showCart();
                };
            });

            deleteProduct.addEventListener("click", () => {
                const index = cart.indexOf(item);
                cart.splice(index, 1);
                showCart();
                Toastify({
                    text: `Eliminó ${item.name} del carrito`,
                    duration: 1500,
                    newWindow: true,
                    close: true,
                    gravity: "bottom",
                    position: "left",
                    stopOnFocus: true,
                    style: {
                        background: "red",
                    },
                }).showToast();
            });

            modalBody.appendChild(imgModal);
            modalBody.appendChild(modalName);
            modalBody.appendChild(restar);
            modalBody.appendChild(modalQuantity);
            modalBody.appendChild(sumar);
            modalBody.appendChild(modalPrice);
            modalBody.appendChild(deleteProduct);
            modalBodyContainer.appendChild(modalBody);
        });

        modalContainer.appendChild(modalBodyContainer);

        const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.cantidad), 0);

        const modalFooter = document.createElement("DIV");
        const checkout = document.createElement("P");
        const modalTotal = document.createElement("P");
        const pDelete = document.createElement("P");

        modalFooter.classList.add("modal__footer");
        checkout.classList.add("checkout");
        modalTotal.classList.add("modal__total");
        pDelete.classList.add("pDelete");

        modalTotal.textContent = "Total: $" + total.toFixed(2);
        checkout.textContent = "Checkout";
        pDelete.innerHTML = `Delete All: <span class="material-symbols-outlined" id="pDelete">
        delete
        </span>`

        modalFooter.appendChild(pDelete);
        modalFooter.appendChild(checkout);
        modalFooter.appendChild(modalTotal);
        modalContainer.appendChild(modalFooter);

        pDelete.addEventListener("click", () => {
            cart.length = 0;
            showCart();
        });
    }

    if (cart.length === 0) {
        cartValue.textContent = "0";
    } else {
        cartValue.textContent = cart.length;
    }

    modalContainer.classList.replace("modal__invisible", "modal__visible");

    modalButton.addEventListener("click", () => {
        modalContainer.classList.replace("modal__visible", "modal__invisible");
    });
};

seeCart.addEventListener("click", () => {
    if (modalContainer.classList.contains("modal__invisible")) {
        modalContainer.classList.replace("modal__invisible", "modal__visible");
        showCart();
    } else {
        modalContainer.classList.replace("modal__visible", "modal__invisible");
    };
});

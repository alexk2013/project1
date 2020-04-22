'use strict'
let products = [
  {id: '1', title: 'Notebook', price: 20000},
  {id: '2', title: 'Mouse', price: 1500},
  {id: '3', title: 'Keyboard', price: 5000},
  {id: '4', title: 'Gamepad', price: 4500},
];

var id = 0;
const renderProduct = (title, price) => {
    
    id++
  return `<div class="prdct">
            <h3 class="name">${title}</h3>
            <img src="https://placeimg.com/640/480/animals" alt="" class="pict">
            <p class="price">${price} RUB</p>
            <button class="buy" data-id=${id} data-price=${price} data-name="Товар ${id}">В корзину</button>
          </div>`;
};

const renderProducts = (list) => {
  const productList = [];
  list.forEach(good => {
    productList.push(renderProduct(good.title, good.price));
  });
  console.log(productList);
  document.querySelector('.catalog').innerHTML = productList;
};

renderProducts(products);


const cart = document.querySelector('.cart');
const opncart = document.querySelector('.open__cart');
const clscart = document.querySelector('.close__cart');

cart.addEventListener('click', function() {
        opncart.classList.remove('hidden');
        });
clscart.addEventListener('click', function() {
        opncart.classList.add('hidden');
        });


let buy = document.querySelectorAll('.buy');
buy.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
        let id = event.target.dataset.id;
        let price = event.target.dataset.price;
        let name = event.target.dataset.name;
        basket.addProduct({ id: id, price: price, name: name })
    })
});

let basket = {
    products: {},
    
    addProduct(product) {
        this.addProductToObject(product);
        this.renderProductInBasket(product);
        this.renderTotalSum();
        this.addRemoveBtnsListeners();
    },
    removeProductListener(event) {
        basket.removeProduct(event);
        basket.renderTotalSum();
    },
    addRemoveBtnsListeners() {
        let btns = document.querySelectorAll('.productRemoveBtn');
        for (let i = 0; i < btns.length; i++) {
             btns[i].addEventListener('click', this.removeProductListener);
        }
    },
    renderTotalSum() {
        document.querySelector('.total').textContent = this.getTotalSum();
    },
    addProductToObject(product) {
        if (this.products[product.id] == undefined) {
            this.products[product.id] = {
                price: product.price,
                name: product.name,
                count: 1
            }
        } else {
            this.products[product.id].count++;
        }
    },
    renderProductInBasket(product) {
        let productExist = document.querySelector(`.productCount[data-id="${product.id}"]`);
        if (productExist) {
            productExist.textContent++;
            return;
        }
        let productRow = `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td class="productCount" data-id="${product.id}">1</td>
                <td><i class="fas fa-trash-alt productRemoveBtn" data-id="${product.id}"></i></td>
            </tr>
        `;
        let tbody = document.querySelector('tbody');
        tbody.insertAdjacentHTML("beforeend", productRow);
    },
    getTotalSum() {
        let sum = 0;
        for (let key in this.products) {
            sum += this.products[key].price * this.products[key].count;
        }
        return sum;
    },
    removeProduct(event) {
        let id = event.srcElement.dataset.id;
        this.removeProductFromObject(id);
        this.removeProductFromBasket(id);
    },
    removeProductFromBasket(id) {
        let countTd = document.querySelector(`.productCount[data-id="${id}"]`);
        if (countTd.textContent == 1) {
            countTd.parentNode.remove();
        } else {
            countTd.textContent--;
        }
    },
     removeProductFromObject(id) {
        if (this.products[id].count == 1) {
            delete this.products[id];
        } else {
            this.products[id].count--;
        }
    }
}
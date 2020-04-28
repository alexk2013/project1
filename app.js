'use strict'
class ProductList {
  constructor(container = '.catalog') {
    this.container = container;
    this.goods = [];
    this.allProducts = [];
    this._fetchProducts();
    this._render();
  }

  _fetchProducts() {
    this.goods = [
      {id: 1, title: 'Notebook', img: 'notebook.jpg', price: 20000},
      {id: 2, title: 'Mouse', img: 'Mouse.jpg', price: 1500},
      {id: 3, title: 'Keyboard', img: 'Keyboard.jpg', price: 5000},
      {id: 4, title: 'Gamepad', img: 'Gamepad.jpg', price: 4500},
    ]
  }

  _render() {
    const block = document.querySelector(this.container);

    for (let product of this.goods) {
      const productObject = new ProductItem(product);
      this.allProducts.push(productObject);
      block.insertAdjacentHTML('beforeend', productObject.render());
    }
  }
}

//Lesson_3_01_Работа промиса
function makeGETRequest(url, callback) {
    return new Promise((resolve, reject) => {
        console.log('Promise работает');
        let xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject;
        xhr.open("GET", url, true);
        xhr.onload = () => resolve(callback(xhr.responseText));
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
      });
}

class ProductItem {
  constructor(product) {
    this.title = product.title;
    this.price = product.price;
    this.id = product.id;
    this.img = product.img;
  }

  render() {
    return `<div class="prdct">
            <h3 class="name">${this.title}</h3>
            <img src="${this.img}" alt="" class="pict">
            <p class="price">${this.price} RUB</p>
            <button class="buy" data-id=${this.id} data-price=${this.price} data-name=${this.title}>Купить</button>
          </div>`;
  }
}
new ProductList();

    
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
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url, cb) => {
  return new Promise((resolve, reject)=>{
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status !== 200) {
          reject(console.log('Error'));
        } else {
          resolve(cb(xhr.responseText));
        }
      }
    };
    xhr.send();
 
  });
};


// –--------------------------------

class ProductList {
  #goods;

  constructor(container = '.products') {
    this.container = container;
    this.#goods = [];
    this._allProducts = [];

    // this._fetchGoods();
    this.#getProducts().then((data) => {
      this.#goods = [...data];
      // this.#goods = Array.from(data);
      this.#render();
    });

    console.log(this.sum());
  }

  // _fetchGoods() {
  //   getRequest(`${API}/catalogData.json`, (data) => {
  //     console.log(data);
  //     this.#goods = JSON.parse(data);
  //     this.#render();
  //     console.log(this.#goods);
  //   });
  // }

  async #getProducts() {
    try {
      const response = await fetch(`${API}/catalogData.json`);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  sum() {
    return this.#goods.reduce((sum, { price }) => sum + price, 0);
  }

  #render() {
    const block = document.querySelector(this.container);

    for (let product of this.#goods) {
      const productObject = new ProductItem(product);

      this._allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://placehold.it/200x150') {
    this.product_name = product.product_name;
    this.price = product.price;
    this.id_product = product.id_product;
    this.img = img;
  }

  getGoodHTML() {
    return `<div class="product-item">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.product_name}</h3>
                  <p>${this.price} \u20bd</p>
                  <button class="buy-btn" data-id="${this.id_product}">Купить</button>
              </div>
            </div>`;
  }
}
// Создаем класс корзина Cart
class CartList {
  constructor() {
    this.countGoods = 0; //Общая стоимость товаров
    this.amount = 0; //Общая стоимость товаров
    this.basketItems = []; //Массив для хранения товаров
    this.container = '.cart-content'; // контейнер для корзины
    this.allProducts = [];
    this._getBasket()
      .then(() => {
        this.basketItems.contents
        this.allProducts = this.basketItems.contents;
        this.renderBasket();
      });

  }

  //метод получения товаров в корзине
  _getBasket() {
    return fetch(`${API}/getBasket.json`)
      .then(result => result.json())
      .then(data => {
        this.basketItems = data;
        this.countGoods = data.countGoods;
        this.amount = data.amount;
      })
      .catch(error => {
        console.log(`Ошибка получения данных: ${error}`);
      })
  }
  //////////////////////TODO//////////////////////
  addToCart(id) {
    const existedItem = this.allProducts.find(product => product.id_product === +id);
    if (existedItem) {
      existedItem.quantity += 1;
    } else {
      const notExistedItem = list._allProducts.filter(product => product.id_product == +id)[0];
      notExistedItem.quantity = 1;
      this.allProducts.push(new CartItem(notExistedItem));
    }
  };
  /////////////////////////////////////////////////////
  //Обрабатывает событие кнопки удаления добавления

  productAddListener(event) {
    cart.addToCart(event.srcElement.dataset.id);
    cart.renderBasket();
  }
  //Добавляет слушателей события на кнопки добавления

  productAddAddListeners() {
    let addBtns = document.querySelectorAll('.buy-btn');
    for (let i = 0; i < addBtns.length; i++) {
      addBtns[i].addEventListener('click', this.productAddListener);
    }
  }
  //Обрабатывает событие кнопки удаления товара

  productDeleteListener(event) {
    cart.deleteFromCart(event.srcElement.dataset.id);
    cart.renderBasket();
  }
  //Добавляет слушателей события на кнопки удаления

  productAddDeleteListeners() {
    let delBtns = document.querySelectorAll('.delete');
    for (let i = 0; i < delBtns.length; i++) {
      delBtns[i].addEventListener('click', this.productDeleteListener);
    }
  }

  // удаление товара из корзины 
  deleteFromCart(id) {
    const existedItem = this.allProducts.find(product => product.id_product === +id);
    if (existedItem && existedItem.quantity != 1) {
      existedItem.quantity -= 1;
    }
    else {
      this.allProducts = this.allProducts.filter((nextItem) => (nextItem.id_product != id));
    }

  }
  //отрисовка корзины
  renderBasket() {
    const block = document.querySelector(this.container);
    block.innerHTML = "";
    for (let product of this.allProducts) {
      const prod = new CartItem(product);
      block.insertAdjacentHTML('beforeend', prod.renderItem());
    }
    let out = `<div class="out">Всего товаров в корзине: ${this.countGoods}<br> На сумму: ${this.amount} рублей</div> `;
    block.insertAdjacentHTML('beforeend', out);
    cart.productAddAddListeners();
    cart.productAddDeleteListeners();
  }
}

class CartItem {
  constructor(product) {
    this.product_name = product.product_name;
    this.id_product = product.id_product;
    this.price = product.price;
    this.quantity = product.quantity;
  }

  renderItem() {
    return `<div class="cart-item">
                    <div class="cart-desc">
                        <h3 class="cart-name">${this.product_name}</h3>
                        <button class="delete" data-id="${this.id_product}">x</button>  
                        <p>Количество: ${this.quantity} шт.</p>
                        <p class="cart-price">Цена: ${this.price} руб.</><br>
                        <p class="cart-price">Итого: ${this.price * this.quantity} руб.</p><br>
                         
                  </div>
              </div>`
  }

}




const list = new ProductList();
let cart = new CartList();

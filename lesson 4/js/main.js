const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url, cb) => {
  return new Promise((resolve, reject) => {
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

  #getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      });
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
  constructor(product, img = 'https://placehold.it/400x400') {
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
  //Добавить в корзину
  async addToCart(id) {
    try {
      const result1 = await fetch(`${API}/addToBasket.json`);
      const data = await result1.json();
      this.dataOk = data.result;
      if (this.dataOk == 1) {
        const existedItem = this.allProducts.find(product => product.id_product === +id);
        if (existedItem) {
          existedItem.quantity += 1;
        } else {
          const notExistedItem = list._allProducts.filter(product_1 => product_1.id_product == +id)[0];
          notExistedItem.quantity = 1;
          this.allProducts.push(new CartItem(notExistedItem));

        }
        cart.renderBasket();
      }
    } catch (error) {
      console.log(`Ошибка получения данных при добавлении товара: ${error}`);
    }

  };
  //Обрабатывает событие кнопки удаления добавления

  productAddListener(event) {
    cart.addToCart(event.srcElement.dataset.id);

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

  }
  //Добавляет слушателей события на кнопки удаления

  productAddDeleteListeners() {
    let delBtns = document.querySelectorAll('.delete');
    for (let i = 0; i < delBtns.length; i++) {
      delBtns[i].addEventListener('click', this.productDeleteListener);
    }
  }

  // удаление товара из корзины 
  async deleteFromCart(id) {
    try {
      const result = await fetch(`${API}/deleteFromBasket.json`);
      const data = await result.json();
      if (data.result == 1) {
        const existedItem = this.allProducts.find(product => product.id_product === +id);
        if (existedItem && existedItem.quantity != 1) {
          existedItem.quantity -= 1;
        }
        else {
          this.allProducts = this.allProducts.filter((nextItem) => (nextItem.id_product != id));
        }
        cart.renderBasket();
      }
    } catch (error) {
      console.log(`Ошибка получения данных при удалении товара: ${error}`);
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
    let out = `<div class="out">Всего товаров в корзине: ${this.countBaketGoods()}<br> На сумму: ${this.sumBasket()} рублей</div> `;
    block.insertAdjacentHTML('beforeend', out);
    cart.productAddAddListeners();
    cart.productAddDeleteListeners();
  }
  //Сумма товаров в корзине
  sumBasket() {
    let total = 0;
    for (let i = 0; i < this.allProducts.length; i++) {
      total += this.allProducts[i]["price"] * this.allProducts[i]["quantity"]
    }
    return total
  }
  //Количество товаров в корзине
  countBaketGoods() {
    let total = 0;
    for (let i = 0; i < this.allProducts.length; i++) {
      total += this.allProducts[i]["quantity"]
    }
    return total
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
class EmailForm {
  constructor(container = '.emailForm') {
    this.container = container;
    this.renderForm();
    this.name = document.querySelector('#name');
    this.phone = document.querySelector('#phone');
    this.email = document.querySelector('#email');
    this.submitBtn = document.querySelector('#submit');
    this.successMsgOrErrorMsg = document.querySelector('.successMsgOrErrorMsg');
    this.submitAddEventListener();
       }
  renderForm() {
    const block = document.querySelector(this.container);
    block.innerHTML = `<form>
                        <input type="text" name="name" id="name" placeholder="Имя">
                        <input type="tel" name="phone" id="phone" placeholder="Телефон">
                        <input type="email" name="email" id="email" placeholder="Email">
                        <textarea name="text" id="text" cols="30" rows="10" placeholder="Сообщение"></textarea>
                        <button id="submit">Отправить</button>
                        <div class="successMsgOrErrorMsg"></div>
                      </form>`;
    
  }
  nameValidation() {
    return /[а-яА-ЯёЁa-zA-Z]/i.test(this.name.value);
  }
  phoneValidation() {
    return /\+7\(\d{3}\)\d{3}\-\d{4}/i.test(this.phone.value);
  }
  emailValidation() {
    return /[a-z.-]+\@[a-z]+\.[a-z]{2,3}/i.test(this.email.value);
  }
  submitAddEventListener() {
    this.submitBtn.addEventListener('click', this.submitEventListener)
  }
  submitEventListener(event) {
    event.preventDefault();
    let name = form.nameValidation();
    let phone = form.phoneValidation();
    let email = form.emailValidation();
    form.name.classList.remove('error');
    form.phone.classList.remove('error');
    form.email.classList.remove('error');
    if (name && phone && email) {
      form.successMsgOrErrorMsg.innerHTML="<p>Ваше сообщение успешно отправлено!</p>"
    } else {
      form.successMsgOrErrorMsg.innerHTML="<p>Пожалуйста, исправьте поля:</p>"
      form.errorReport(name, phone, email);
    }
  }
  errorReport(name, phone, email) {
    if (name === false) {
      this.name.classList.add('error');
      this.successMsgOrErrorMsg.insertAdjacentHTML("beforeend", `<p>Имя</p>`)
    }
    if (phone === false) {
      this.phone.classList.add('error');
      this.successMsgOrErrorMsg.insertAdjacentHTML("beforeend", `<p>Телефон</p>`)
    }
    if (email === false) {
      this.email.classList.add('error');
      this.successMsgOrErrorMsg.insertAdjacentHTML("beforeend", `<p>Email</p>`)
    }
  }
}
const list = new ProductList();
let cart = new CartList();
let form = new EmailForm();
let text = `One: 'Hi Mary.' 
Two: 'Oh, hi.'
One: 'How are you doing?'
Two: 'I'm doing alright. How about you?'
One: 'Not too bad. The weather is great isn't it?'
Two: 'Yes. It's absolutely beautiful today.'
One: 'I wish it was like this more frequently.'
Two: 'Me too.'
One: 'So where are you going now?'
Two: 'I'm going to meet a friend of mine at the department store'
One: 'Going to do a little shopping?'
Two: 'Yeah, I have to buy some presents for my parents.'
One: 'What's the occasion?'
Two: 'It's their anniversary.'
One: 'That's great. Well, you better get going. You don't want to be late.'
Two: 'I'll see you next time.'
One: 'Sure.' Bye.'`
console.log(text.replace(/\'/g, '"')); //задание 1
console.log(text.replace(/\B'|'\B/g, '"')); //задание 2
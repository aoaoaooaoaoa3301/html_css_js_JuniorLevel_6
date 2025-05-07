fetch('data.json')
    .then(response => response.json())
    .then(data =>{
        crateItems(data);

        main(data);
    });
    
    
function main(data){
    const but_confirmOrder = document.querySelector(".confirmOrder");
    const but_createNewOrder = document.querySelector(".createNewOrder");

    add_toCart(data);
    addOrDeleteItem(data);

    but_confirmOrder.addEventListener('click', function(){
        createMessage(data);
    });
    but_createNewOrder.addEventListener('click', function(){
        location.reload();
    });
}

var cartItems = [];
var lastOrder = 0;
var flagNotification = true;

function crateItems(data){
    const items = document.getElementById('items');
    var n = 0;

    data.forEach(item =>{
        const container = document.createElement('div');
        container.classList.add("container");
        container.id = n;

        container.innerHTML = `
            <img class="img-item" src=${item.image.desktop} alt="">
            <div class="buts" >
                <button class="but-addToCard" data-visible="show">
                    <img src="assets/images/icon-add-to-cart.svg" alt="">
                    <p>Add to Cart</p>
                </button>
           
                <div class="buts-addOrDelete" data-visible="hide">
                    <button class="plus_minus" id="minus"><img src="assets/images/icon-decrement-quantity.svg" alt=""></button>
                    <p>1</p>
                    <button class="plus_minus" id="plus"><img src="assets/images/icon-increment-quantity.svg" alt=""></button>
                </div>
            </div>    
            <p class="category-item">${item.category}</p>
            <p class="name-item">${item.name}</p>
            <p class="price-item">$${item.price.toFixed(2)}</p>
        `;
        items.appendChild(container);
        /* console.log(item.name, n, data[n]); */
        cartItems.push({"id" : n, "count" : 0, "price" : item.price});
        n++;
    });

}

function add_toCart(data){
    const buts_addToCart = document.querySelectorAll(".but-addToCard");
    const products_inCart = document.getElementById("products-inCart");

    buts_addToCart.forEach(but => {
        but.addEventListener('click', function(){

            const id_item = but.parentElement.parentElement.id;
            const item_inCart = document.createElement('div');

            item_inCart.classList.add("item-inCart");
            item_inCart.id = `nom_${id_item}`;
            cartItems[id_item].count = 1;

            item_inCart.innerHTML = `
            <div class="info-item">
                <p class="name-inCart">${data[id_item].name}</p>
                <div class="infoPrice-inCart">
                    <p class="count-inCart">1x</p>
                    <p class="price-inCart">@$${data[id_item].price.toFixed(2)}</p>
                    <p class="priceSum-inCart">$${data[id_item].price.toFixed(2)}</p>
                </div>
            </div>
            
            <button class="but-remove" id="but-remove-inCart"><img src="assets/images/icon-remove-item.svg" alt=""></button>
            `;
            products_inCart.appendChild(item_inCart);
            

            but.dataset.visible = "hide";
            but.parentElement.querySelector(".buts-addOrDelete").dataset.visible = "show";

            updateOrder();
        });
    });
}

function addOrDeleteItem(data){
    const buts_plus_minus = document.querySelectorAll(".plus_minus");
    
    buts_plus_minus.forEach(but =>{
        but.addEventListener('click', function(){
            const products_inCart = document.getElementById("products-inCart");
            const id_item = but.parentElement.parentElement.parentElement.id;
            const item = products_inCart.querySelector(`#nom_${id_item}`);
            
            if(but.id == "minus"){
                if(cartItems[id_item].count == 1){
                    cartItems[id_item].count--;

                    item.remove();
                    but.parentElement.dataset.visible = "hide";
                    but.parentElement.parentElement.querySelector(".but-addToCard").dataset.visible = "show";
                }
                else {
                    cartItems[id_item].count--;
                    but.parentElement.querySelector("p").textContent = cartItems[id_item].count;

                    item.innerHTML = `
                        <div class="info-item">
                            <p class="name-inCart">${data[id_item].name}</p>
                            <div class="infoPrice-inCart">
                                <p class="count-inCart">${cartItems[id_item].count}x</p>
                                <p class="price-inCart">@$${data[id_item].price.toFixed(2)}</p>
                                <p class="priceSum-inCart">$${(data[id_item].price * cartItems[id_item].count).toFixed(2)}</p>
                            </div>
                        </div>
                    
                        <button class="but-remove" id="but-remove-inCart"><img src="assets/images/icon-remove-item.svg" alt=""></button>
                    `;
                }
            }
            else if(but.id == "plus"){
                cartItems[id_item].count++;
                but.parentElement.querySelector("p").textContent = cartItems[id_item].count;

                item.innerHTML = `
                    <div class="info-item">
                        <p class="name-inCart">${data[id_item].name}</p>
                        <div class="infoPrice-inCart">
                            <p class="count-inCart">${cartItems[id_item].count}x</p>
                            <p class="price-inCart">@$${data[id_item].price.toFixed(2)}</p>
                            <p class="priceSum-inCart">$${(data[id_item].price * cartItems[id_item].count).toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <button class="but-remove" id="but-remove-inCart"><img src="assets/images/icon-remove-item.svg" alt=""></button>
                `;
                console.log(item, cartItems);
                
            }
            
            updateOrder();
        });
    });
}

function updateOrder(){
    const order = document.querySelector(".order");
    var summ = 0;
        cartItems.forEach(el => {
            summ += el.count * el.price;
        });
    if(summ == 0){
        order.id = "non-order";
        order.innerHTML = `
            <img src="assets/images/illustration-empty-cart.svg" alt="">
            <p>Your added items will appear here</p>
        `;
        deleteConfirmOrder();
        flagNotification = true;
    }
    else {
        order.id = "have-order";
        order.innerHTML = `
            <p class="textOrder">Order</p>
            <p class="numOrder"></p>
        `;
        order.querySelector(".numOrder").textContent = `$${summ.toFixed(2)}`;
        lastOrder = summ;

        if(flagNotification){
            addConfirmOrder();
            flagNotification = false;
        };
    }
    updateH2()

}

function updateH2(){
    const yourCart = document.querySelector("h2");
    var count = 0;
    cartItems.forEach(el =>{
        count += el.count;
    });
    console.log(cartItems, count);

    if(count == 0){yourCart.textContent = `Your Cart`;}

    else {yourCart.textContent = `Your Cart (${count})`;}
}

function createMessage(data){
    const products_inCart = document.getElementById("products-inCart");
    const message_parrent = document.getElementById("products-inMessage");
    const message = document.querySelector(".message");

    const products_order = document.querySelector(".products-order");
    const order = document.createElement("div");
    order.classList.add("order-inMessage");

    cartItems.forEach(el => {
        if(el.count != 0){
            const item_message = document.createElement("div");
            item_message.classList.add("item-inMessage");
            item_message.id = `nom_${el.id}`;
            item_message.innerHTML = `
                  <div class="info-inMessage">
                    <img class="img-inMessage" src="${data[el.id].image.desktop}" alt="">
                    <div>
                      <p class="name-inMessage">${data[el.id].name}</p>
                      <div class="info-inMessage">
                        <p class="count-inMessage">${el.count}x</p>
                        <p class="price-inMessage">@$${data[el.id].price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <p class="price_inMessage">$${(data[el.id].price * el.count).toFixed(2)}</p>  
            `;
            message_parrent.appendChild(item_message);
        }
    });
    message.dataset.visible = "show";

    order.innerHTML = `
        <p class="textOrder">Order total</p>
        <p class="numOrder">$${lastOrder.toFixed(2)}</p>
    `;
    products_order.appendChild(order);
}

function addConfirmOrder(){
    const div = document.getElementById("but-notification");
    div.dataset.visible = "show";
    console.log(div);
}
function deleteConfirmOrder(){
    const div = document.getElementById("but-notification");
    div.dataset.visible = "hide";
}

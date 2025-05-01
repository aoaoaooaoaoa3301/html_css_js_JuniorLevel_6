fetch('data.json')
    .then(response => response.json())
    .then(data =>{
        crateItems(data);
    });

function crateItems(data){
    
    const items = document.getElementById('items');
    console.log(items);
    data.forEach(item =>{
        const container = document.createElement('div');
        container.classList.add("container");

        container.innerHTML = `
            <img class="img-item" src=${item.image.desktop} alt="">
            <div>
                <button class="but-add-tocard">
                    <img src="assets/images/icon-add-to-cart.svg" alt="">
                    <p>Add to Cart</p>
                </button>
            </div>
            <p class="category-item">${item.category}</p>
            <p class="name-item">${item.name}</p>
            <p class="price-item">$${item.price.toFixed(2)}</p>
        `;
        items.appendChild(container);
    });
}
import { menuArray } from "./order.js";

let orderArr = [];
let countOrderArr = [];


document.addEventListener("click", function (e) {
  if (e.target.id === "add-btn") {
    document.getElementById("checkout").style.display = "block";
    const orderArr = handleOrder(Number(e.target.dataset.itemid));
    countOrderArr = getCountOrderArr(orderArr);
    renderOrderCheckout(countOrderArr);
  } else if (e.target.id === "remove-btn") {
    removeItem(e.target.dataset.itemname, countOrderArr);
  }
});

document.getElementById("order-btn").addEventListener("click", function (e) {
  e.preventDefault();
  let total = getTotal(countOrderArr);
  if(total>0){
    document.getElementById("payment-modal").style.display = "block";
  }else{
    alert("Please add atleast 1 item!")
  }
});


document
  .getElementById("cardNumber")
  .addEventListener("input", function (event) {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 12) {
      this.value = this.value.slice(0, 10);
    }
  });

document.querySelector("form").addEventListener("submit", function (event) {
  if (document.getElementById('cardNumber').value.length < 10) {
    event.preventDefault();
    alert("Card number must be 10 digits long.");
  }
});

document
  .getElementById("cvvNumber")
  .addEventListener("input", function (event) {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 3) {
      this.value = this.value.slice(0, 3);
    }
  });

document.querySelector("form").addEventListener("submit", function (event) {
  if (document.getElementById('cardNumber').value.length < 3) {
    event.preventDefault();
    alert("CVV number must be 3 digits long.");
  }
});

document.getElementById("pay-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const cvvNumber = document.getElementById("cvvNumber").value;
  if(name.length>0 && cardNumber.length >0 && cvvNumber.length ===3){
    document.getElementById("payment-modal").style.display = "none";
    renderOrderStatus(name);
  }else{
    alert("Please Enter the details correctly");
  } 
});

function handleOrder(itemId) {
  const targetDish = menuArray.filter(function (dish) {
    return dish.id === itemId;
  })[0];
  orderArr.push({ name: targetDish.name, price: targetDish.price });
  return orderArr;
}

function getCountOrderArr(orderArr) {
  let countOrderObj = {};

  orderArr.forEach((item) => {
    let key = `${item.name}:${item.price}`;
    countOrderObj[key] = (countOrderObj[key] || 0) + 1;
  });

  let countOrderArr = Object.keys(countOrderObj).map((key) => {
    let [name, price] = key.split(":");
    return {
      name: name,
      price: price,
      count: countOrderObj[key],
    };
  });
  return countOrderArr;
}

function renderOrderCheckout(countOrderArr) {
  let checkoutRenderString = "";

  checkoutRenderString += countOrderArr
    .map((element) => {
      return `<div class="checkout-item-summary">
        <div class="checkout-item-summary-partA">
          <p>${element.name} × ${element.count}</p>
          <p class="remove" id="remove-btn" data-itemname=${
            element.name
          }>remove</p>
        </div>
        <p>$${element.price * element.count}</p>
      </div>`;
    })
    .join("");

  document.getElementById("checkout-items").innerHTML = checkoutRenderString;

  let total = getTotal(countOrderArr);
  document.getElementById("order-total").textContent = `$` + total;
}

function getTotal(countOrderArr) {
  let total = 0;
  countOrderArr.forEach((item) => {
    const { price, count } = item;
    total += price * count;
  });
  return total;
}

function removeItem(itemName, countOrderArr) {
  const targetOrderItem = countOrderArr.find((item) => {
    return item.name === itemName;
  });

  if (targetOrderItem && targetOrderItem.count > 1) {
    targetOrderItem.count--;
  } else if (targetOrderItem && targetOrderItem.count === 1) {
    const index = countOrderArr.indexOf(targetOrderItem);
    if (index !== -1) {
      countOrderArr.splice(index, 1);
    }
  }

  renderOrderCheckout(countOrderArr);
}



function render() {
  return menuArray
    .map((dish) => {
      return `<div class="dish-item ">
       <div class="dish-item-inner">
           <img class="item-icon" src="${dish.icon}" alt="${dish.name}">
           <div class="item-inner-content">
               <p class="item-name" >${dish.name}</p>
               <p class="item-desc" >${dish.ingredients.join(",")}</p>
               <p class="item-price">$${dish.price}</p>
           </div>
           <i class="ri-add-circle-line add-btn" id="add-btn" data-itemid=${
             dish.id
           }></i>
       </div>
   </div>`;
    })
    .join(" ");
}

document.getElementById("menu-items").innerHTML = render();


function renderOrderStatus(name) {
  const orderStatusString = `<section id="order-status" class="order-status">
    <p>Thanks, ${name}! Your Order is on its way!</p>
    </section>`;
  document.getElementById("checkout").innerHTML = orderStatusString;
}
document.getElementById("close-modal-btn").addEventListener("click", function () {
  document.getElementById("payment-modal").style.display = "none";
});

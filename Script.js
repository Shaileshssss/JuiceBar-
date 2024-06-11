

document.querySelectorAll('.videomaking .btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const video = document.getElementById('video');
        const closeButton = document.getElementById('closeButton');
        if (video.style.display === 'none') {
            video.style.display = 'block';
            closeButton.style.display = 'block';
        } else {
            video.style.display = 'none';
            closeButton.style.display = 'none';
        }
    });
});

// This is to show and hide the details of nutritions
function showImage() {
    document.getElementById('imageContainer').style.display = 'grid';
    document.getElementById('imageContainer').style.backgroundColor = 'white';
    document.getElementById('imageContainer').style.cursor = 'not-allowed';


}

function hideImage() {
    document.getElementById('imageContainer').style.display = 'none';
}


// Function to get cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Function to set cart items to localStorage
function setCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

// Function to calculate the total amount
function calculateTotalAmount(cartItems) {
    return cartItems.reduce((total, item) => {
        const quantity = item.quantity || 1; // Treat unspecified quantity as 1
        return total + (parseFloat(item.price) * quantity);
    }, 0);
}

// Function to display cart items and total amount
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const totalAmountElement = document.getElementById('total-amount');
    const cartItems = getCartItems();
    cartItemsList.innerHTML = ''; // Clear the list before repopulating

    cartItems.forEach((item, index) => {
        const quantity = item.quantity || 1; // Default to 1 if undefined
        const total = item.price * quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product}</td>
            <td>₹${item.price}</td>
            <td>
                <select id="quantity-${index}" onchange="updateQuantity(${index}, this.value)">
                    ${generateQuantityOptions(quantity)}
                </select>
            </td>
            <td>₹${total}.00</td>
        `;
        cartItemsList.appendChild(row);
    });

    const totalAmount = calculateTotalAmount(cartItems);
    totalAmountElement.textContent = `Total Amount: ₹${totalAmount} -/_`;
}

// Function to generate options for quantity dropdown
function generateQuantityOptions(selectedQuantity) {
    let options = '';
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${selectedQuantity === i ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

// Function to update item quantity
function updateQuantity(index, quantity) {
    const cartItems = getCartItems();
    cartItems[index].quantity = parseInt(quantity);
    setCartItems(cartItems);
    displayCartItems();
}

// Function to add an item to the cart
function addToCart(product, price) {
    const cartItems = getCartItems();
    cartItems.push({ product, price, quantity: 1 }); // Initialize quantity to 1
    setCartItems(cartItems);
    displayCartItems();
}

// Display the cart items and total amount on page load
document.addEventListener('DOMContentLoaded', displayCartItems);

// Initialize cart item count from localStorage
let itemCount = localStorage.getItem('itemCount') ? parseInt(localStorage.getItem('itemCount')) : 0;

// Function to update the cart item count in the UI and localStorage
function updateCart() {
    const cartCount = document.querySelector('.cart_items span');
    if (cartCount) {
        cartCount.textContent = itemCount;
        localStorage.setItem('itemCount', itemCount);
    }
}

// Function to add item to cart
function addToCart(product) {
    // Extract the price from the DOM
    const priceElement = document.querySelector('.price h3');
    const priceText = priceElement.textContent;
    const priceMatch = priceText.match(/₹(\d+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

    itemCount++; // Increment the item count
    updateCart(); // Update the cart item count displayed and localStorage

    // Add the product to cart items in localStorage
    const cartItems = getCartItems();
    cartItems.push({ product, price });
    setCartItems(cartItems);

    // Update the button state
    const cartButton = document.querySelector('.cart');
    if (cartButton) {
        cartButton.style.backgroundColor = 'green'; // Change button color to green
        cartButton.textContent = 'Added!'; // Change button text to "Added!"
        cartButton.disabled = true; // Disable the button
        localStorage.setItem(product + 'AddedToCart', 'true'); // Save button state
    }
}

// Function to check and set the button state on page load
function checkCartState(product) {
    const cartButton = document.querySelector('.cart');
    if (cartButton) {
        if (localStorage.getItem(product + 'AddedToCart') === 'true') {
            cartButton.style.backgroundColor = 'green';
            cartButton.textContent = 'Added!';
            cartButton.disabled = true;
        }
        cartButton.addEventListener('click', () => addToCart(product));
    }
}

// Update the cart item count on page load
updateCart();

document.getElementById('clearCart').addEventListener('click', function () {
    const cartItems = getCartItems(); // Get cart items from localStorage

    if (cartItems.length > 0) {
        // Add quantity property if it's not present
        const formattedCartItems = cartItems.map(item => {
            return {
                ...item,
                quantity: item.quantity || 1
            };
        });

        // Send cart data to the server
        fetch('http://localhost:3000/save-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cartItems: formattedCartItems })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                clearCart(); // Clear cart items and localStorage after saving to backend
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        clearCart(); // Clear cart if there are no items
    }
});


// Function to clear the cart
function clearCart() {
    const confirmation = confirm("Thankyou for shopping");
    if (confirmation) {
        localStorage.removeItem('cartItems'); // Remove cart items from localStorage
        localStorage.removeItem('itemCount'); // Remove itemCount from localStorage
        clearProductAddedKeys(); // Clear all product-added keys
        updateCart(); // Update the cart item count displayed
        // Reload the window after 2 seconds
        setTimeout(function () {
            window.location.reload();
        }, 2000);
    }
}

// Function to clear all product-added keys from localStorage
function clearProductAddedKeys() {
    for (const key in localStorage) {
        if (key.endsWith('AddedToCart')) {
            localStorage.removeItem(key);
        }
    }
}


document.getElementById('clearCart').addEventListener('click', clearCart);

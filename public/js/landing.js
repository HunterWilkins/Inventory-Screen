$(document).ready(function(){

 

    // Data Setup =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/
    let inventories = [];
    let localInv = JSON.parse(localStorage.getItem("inventories"));
    if (localInv !== null) {
        localInv.forEach(item => {
            inventories.push(item);
        });
    }
    
    let localPockets = JSON.parse(localStorage.getItem("pockets"));

    let state = {
        inventory: false,
        slot: "",
        pockets: localPockets,
        updating: false
    }

    if (localPockets === null) {
        state.pockets = [];
    }
    
    state.pockets.forEach(function(item){
        $("#dash").append(
            `
            <div class = "pocket" type = "${item}">
                <img src = "${item}.png">
            </div>
            `
        );
    });
    // =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/
    
    

    $("#inv-items").on("click", ".item", function(){
        state.updating = true;
        $("#modal-back").css("display", "block");
        $("#modal").css("display", "block");
        let editingItemName = $(this).children(".name").text();
        let editingItemPrice = $(this).children(".price").text();
        let editingItemQty = $(this).children(".quantity").text();

        $("#item-name").val(editingItemName);
        $("#item-price").val(editingItemPrice);
        $("#item-quantity").val(editingItemQty);
    });

    $("#inv-button-box").on("click", "button", function() {
        if ($(this).text() === "+") {
            $("#modal-back").css("display", "block");
            $("#modal").css("display", "block");
        }

        if ($(this).text() === "i") {
            showInfo(state.slot);
        }

        if ($(this).attr("id") === "trash") {
            let confirmation = confirm("This will delete this pocket (including all items in it). Continue?");
            if (confirmation) {
                let newInventory = inventories.filter(item => item.type !== state.slot);
                inventories = newInventory;
                localStorage.setItem("inventories", JSON.stringify(inventories));
                
                let newPockets = state.pockets.filter(item => item !== state.slot);
                state.pockets = newPockets;
                localStorage.setItem("pockets", JSON.stringify(state.pockets));

                location.reload();
            }
        }
    });

    $("#dash").on("click", ".pocket", function(){
        $("#inv-items").empty();

        if ($(this).attr("func") === "add"){
            $("#pocket-book").css("display", "block");
            if (state.inventory) {
                toggleInv();
            }
        }

        else {
            state.slot = $(this).attr("type");
            populateInv();
            if (!state.inventory){
                toggleInv();
            }
        }

        $("#inv-title").text(state.slot);

    });

    $("#close-btn").on("click", function() {
        $("#modal-back").css("display", "none");
        $("#modal").css("display", "none");
    });

    $("#close-btn-2").on("click", function(){
        $(this).parent().css("display", "none");
    });

    // Pocket-Adding functionality
    $(".new-pocket").on("click", function() {

        $("#pocket-book").css("display", "none");

        let pocketType = $(this).children("p").text();

        if (state.pockets.indexOf(pocketType) === -1) {
            $("#dash").append(
                `
                <div class = "pocket" type = "${pocketType}">
                    <img src = "${pocketType}.png">
                </div>
                `
            );    

            state.pockets.push(pocketType);
            localStorage.setItem("pockets", JSON.stringify(state.pockets));
        };
    });

    $("#add-qty").on("click", function(){

        if ($("#item-quantity").val() === "") {
            $("#item-quantity").val(1);
        }
        else {
            let oldVal = parseInt($("#item-quantity").val());
            $("#item-quantity").val(oldVal + 1);
        }
    });

    $("#sub-qty").on("click", function() {
        if ($("#item-quantity").val() > 0) {
            let oldVal = parseInt($("#item-quantity").val());
            $("#item-quantity").val(oldVal - 1);
        }
    });

    $("#submit").on("click", function() {

        newItem = {
            name: $("#item-name").val(),
            price: parseFloat($("#item-price").val()),
            quantity: parseInt($("#item-quantity").val()),
            type: state.slot
        };

        if (!newItem.name || newItem.price === "") {
            alert("You must at least put in a Name and Value for your item.");
        }

        else {
            if (state.updating) {
                inventories.forEach(function(item){
                    if (item.name === newItem.name){
                        inventories[inventories.indexOf(item)] = newItem;
                    }
                });
                state.updating = !state.updating;
            }
    
            else {
                inventories.push(newItem);
            }

            updateInv();
        }
    });

    $("#modal").on("click", ".trash", function() {
        let newInventory = inventories.filter(item => item.name !== $("#item-name").val());
        inventories = newInventory;
        updateInv();
    });

    $("#sell-all").on("click", function() {
        let total = 0;
        inventories.forEach(item => {
            total += parseFloat(item.price*item.quantity);
        });

        alert("You've cleared out $" + total.toFixed(2) + " worth of items.");
        localStorage.clear();
        inventories = [];
        location.reload();
    });

    $("#close-inv").on("click", toggleInv);

    function toggleInv() {
        if (!state.inventory){
            $("#inventory").css("left", "0px");
            $("#close-inv").css("display", "block");
            $("#inv-button-box").css("display", "block");
        }

        else {
            $("#inventory").css("left", "-85%");
            $("#inv-button-box").css("display", "none");
            $("#close-inv").css("display", "none");
        }
        state.inventory = !state.inventory;
    }

    function  populateInv() {
       

        relevantInventory = inventories.filter(item => item.type === state.slot);

        for(var i = 0; i < relevantInventory.length; i++) {
            $("#inv-items").append(
                `
                <div class="item">
                    <p class = "name">${relevantInventory[i].name}</p> 
                    <p class = "price">${relevantInventory[i].price}</p> 
                    <p class = "quantity">${relevantInventory[i].quantity}</p>
                </div>
                `
            );
        }
    }

    function showInfo(slot) {
        relevantInventory = inventories.filter(item => item.type === slot);

        let totalItems = 0;
        let totalValue = 0;
        let totalQty = 0;

        relevantInventory.forEach(function(item) {
            totalItems += 1;
            totalValue += parseFloat(item.price * item.quantity);
            totalQty += item.quantity;
        });

    alert(
    `
    ${slot} Pocket Info
    __________________________________
    Number of Items: ${totalItems}
    Total Value of All Items: $${totalValue.toFixed(2)}
    Total Number of All Items: ${totalQty}
    __________________________________
    `
    );
    }
  
    function updateInv() {
        $("#modal").css("display", "none");
        $("#modal-back").css("display", "none");
        localStorage.setItem("inventories", JSON.stringify(inventories));
        $("#inv-items").empty();
        populateInv();
    }

// End of document.ready function    
});
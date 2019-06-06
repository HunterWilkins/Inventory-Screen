$(document).ready(function(){

    // Inventory Setup =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/
    let inventories = [];
    let localInv = JSON.parse(localStorage.getItem("inventories"));
    if (localInv !== null) {
        localInv.forEach(item => {
            inventories.push(item);
        });
    }
    // =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/
    
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
            </div>
            `
        );
    });

    $("#inv-items").on("click", ".item", function(){
        state.updating = true;
        $("#modal").css("display", "block");
        let editingItemName = $(this).children(".name").text();
        let editingItemPrice = $(this).children(".price").text();
        let editingItemQty = $(this).children(".quantity").text();

        $("#item-name").val(editingItemName);
        $("#item-price").val(editingItemPrice);
        $("#item-quantity").val(editingItemQty);
    });

    $("#inv-buttons").on("click", "button", function() {
        if ($(this).text() === "+") {
            $("#modal").css("display", "block");
        }
    });

    $("#dash").on("click", ".pocket", function(){
        $("#inv-items").empty();

        if ($(this).attr("func") === "add"){
            $("#pocket-book").css("display", "block");
            toggleInv();
        }

        else {
            
            toggleInv($(this).attr("type"));

            // $("#inv-buttons").css("display", "block");
            // state.slot = $(this).attr("type");
            // $("#inv-name").text(state.slot);
            // if (state.inventory == false) {
            //     $("#inventory").css("bottom", "0px");
            //     state.inventory = !state.inventory;  
            // }
            state.slot = $(this).attr("type");

            console.log(state);
            console.log($(this).attr("type").toLowerCase());
            console.log(inventories);
            populateInv($(this).attr("type"));
        }

    });

    $("#close-btn").on("click", function() {
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
                </div>
                `
            );    

            state.pockets.push(pocketType);
            localStorage.setItem("pockets", JSON.stringify(state.pockets));
        };
    });

    $("#add-qty").on("click", function(){
        let oldVal = parseInt($("#item-quantity").val());
        $("#item-quantity").val(oldVal + 1);
    });

    $("#submit").on("click", function() {

        newItem = {
            name: $("#item-name").val(),
            price: parseFloat($("#item-price").val()),
            quantity: parseInt($("#item-quantity").val()),
            type: state.slot
        };

        if (state.updating) {
            inventories.forEach(function(item){
                if (item.name === newItem.name){
                    console.log("Updating old item...");
                    inventories[inventories.indexOf(item)] = newItem;
                }
            });
        }

        else {
            inventories.push(newItem);
        }
        
        localStorage.setItem("inventories", JSON.stringify(inventories));

        $("#modal").css("display", "none");

        $("#inv-items").empty();
        console.log("This is what's in your inventory:");
        console.log(inventories);
        populateInv(state.slot);
    });

    $("#sell-all").on("click", function() {
        let total = 0;
        inventories.forEach(item => {
            total += parseFloat(item.price*item.quantity);
        });

        alert("You've gained $" + total + " from your items.");
        localStorage.clear();
        inventories = [];
        location.reload();
    });

    $("#close-inv").on("click", toggleInv);

    // Inventory Toggle Function

    function toggleInv() {
        if (!state.inventory){
            $("#inventory").css("bottom", "0px");
            $("#close-inv").css("display", "block");
            $("#inv-buttons").css("display", "block");
        }

        else {
            $("#inventory").css("bottom", "-80vh");
            $("#inv-buttons").css("display", "none");
            $("#close-inv").css("display", "none");
        }
        state.inventory = !state.inventory;
    }

    function  populateInv(slot) {

        relevantInventory = inventories.filter(item => item.type === slot);
        console.log(relevantInventory);

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
  

// End of document.ready function    
});
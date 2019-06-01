$(document).ready(function(){

    // Inventory Setup =/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/=/
    let populateInv = function(slot) {

        console.log(slot);
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
        pockets: localPockets
    }

    if (localPockets === null) {
        state.pockets = [];
    }

    
    state.pockets.forEach(function(item){
        $("#dash").append(
            `
            <div class = "pocket" type = ${item}>
            </div>
            `
        );
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
        }

        else {
            state.slot = $(this).attr("type");
            $("#inv-name").text(state.slot);
            if (state.inventory == false) {
                $("#inventory").css("bottom", "0px");
            }
            else {
                $("#inventory").css("bottom", "-400px");
            }
    
            state.inventory = !state.inventory;  
            
            populateInv($(this).attr("type").toLowerCase());
            
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

    $("#submit").on("click", function() {
        newItem = {
            name: $("#item-name").val(),
            price: parseFloat($("#item-price").val()),
            quantity: parseInt($("#item-quantity").val()),
            type: state.slot.toLowerCase()
        };
        inventories.push(newItem);

        localStorage.setItem("inventories", JSON.stringify(inventories));

        $("#modal").css("display", "none");

        $("#inv-items").empty();
        populateInv();
    });

    $("#sell-all").on("click", function() {
        let total = 0;
        inventories.forEach(item => {
            total += parseFloat(item.price);
        });

        alert("You've gained $" + total + " from your items.");
        localStorage.clear();
        inventories = [];
        $("#dash")
    });

    $("#close-inv").on("click", toggleInv());

    // Inventory Toggle Function

    function toggleInv() {
        console.log("running...");
    }

// End of document.ready function    
});
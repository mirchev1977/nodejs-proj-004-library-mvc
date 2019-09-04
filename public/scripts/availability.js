var formBookShopAvailability = document.getElementById( 'form__book-shop' );

const errorMessage     = document.getElementById( 'error-message'            );
errorMessage.style.display = "block";

formBookShopAvailability.addEventListener( 'submit', function ( ev ) {
    var amountToLoan    = document.getElementById( 'loan-amount'      );
    var amountAvailable = document.getElementById( 'available-amount' );

    var diff = amountAvailable.innerText - amountToLoan.value;

    if ( diff < 0 ) {
        ev.preventDefault();
        errorMessage.innerText = 'Book Amount loaned canneot be bigger than the amount of the available books.';
        return false; 
    }
} );
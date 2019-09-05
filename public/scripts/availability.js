var formsBookShopAvailability = document.getElementsByClassName( 'form__book-shop' );

const errorMessage     = document.getElementById( 'error-message'            );
errorMessage.style.display = "block";

for ( var i in formsBookShopAvailability ) {
    var formBookShopAvailability = formsBookShopAvailability[ i ];

    var isHtmlElement =
        formBookShopAvailability instanceof HTMLElement;

    if ( !isHtmlElement ) continue;


    formBookShopAvailability.addEventListener( 'submit', function ( ev ) {
        var amountAvailable = ev.target.parentElement
            .parentElement.children[2].innerText;

        var amountToLoan = ev.target.parentElement.parentElement
            .children[4].children[0].children[2].value;


        var diff = ( amountAvailable * 1) 
            - ( amountToLoan * 1);

        if ( diff < 0 ) {
            ev.preventDefault();
            errorMessage.innerText = 'Book Amount loaned canneot be bigger than the amount of the available books.';
            return false; 
        }
    } );
}

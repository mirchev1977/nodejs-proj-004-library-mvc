class Book {
    constructor ( id, title, author, available, issuedon ) {
        this.id         = id;
        this.title      = title;
        this.author     = author;
        this.available = available;

        this.setIssuedOn( issuedon );
    }

    setIssuedOn ( date ) {
        this.issuedon = date;
    }
}
module.exports.Book = Book;

class BookAddedToCart extends Book {
    constructor ( 
        id          = 0, 
        title       = '', 
        author      = '', 
        available   = 0, 
        issuedon    = '01.01.1970', 
        addedToCart = 0 
    ) {
        super( id, title, author, available, issuedon );
        this.addedToCart = addedToCart;
    }
}
module.exports.BookAddedToCart = BookAddedToCart;
const entityBook = require( '../entities/book' );

module.exports.getAll = ( req, res, next ) => {
    entityBook
        .loadBookLibrary( './data/books.txt', { 
            sortBy: ( req.query[ 'sort' ] || 'id' ) 
        } )
        .then( _arrBooksData => {
            res.render( 'bookShop/getAll', { 
                arrBooksData: _arrBooksData,
                sortBy: ( req.query[ 'sort' ] || 'id' )
            } );
        } );
};

module.exports.addToCart = ( req, res, next ) => {
    entityBook.takeFromAvailable( './data/books.txt', req.body ).then( _BookAvailabilityModified => {
        entityBook.addToCart( _BookAvailabilityModified ).then( bookWritten => {
            res.redirect( '/?sort=' + req.body[ 'sortBy' ] );
        } ).catch( err => {
            console.log( 'Error: ', err );
        } );
    } );
};

module.exports.getAddedToCard = ( req, res, next ) => {
    entityBook.readBooksAddedToCard( 
        './data/added_to_cart.txt' 
    ).then( _arrBooksAddedToCard => {
        res.render( 'bookShop/goToCard', { arrBooksData: _arrBooksAddedToCard });
    } );
};
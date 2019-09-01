const modelBook = require( '../entities/book' );

module.exports.getAll = ( req, res, next ) => {
    modelBook
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
    modelBook.takeFromAvailable( './data/books.txt', req.body ).then( _BookAvailabilityModified => {
        modelBook.addToCart( _BookAvailabilityModified ).then( bookWritten => {
            res.redirect( '/?sort=' + req.body[ 'sortBy' ] );
        } ).catch( err => {
            console.log( 'Error: ', err );
        } );
    } );
};
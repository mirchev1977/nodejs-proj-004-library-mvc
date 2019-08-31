const modelBook = require( '../models/book' );

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
    modelBook.addToCart( './data/books.txt', req.body ).then( _arrBooksData => {
        res.redirect( '/?sort=' + req.body[ 'sortBy' ] );
    } );
};
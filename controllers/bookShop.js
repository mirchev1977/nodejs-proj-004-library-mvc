const modelBook = require( '../models/book' );

module.exports.getAll = ( req, res, next ) => {
    modelBook.promArrBooksData.then( _arrBooksData => {
        res.render( 'bookShop/getAll', { arrBooksData: _arrBooksData } );
    } );
};
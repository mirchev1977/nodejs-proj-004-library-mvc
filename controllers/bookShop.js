const modelBook = require( '../models/book' );

module.exports.getAll = ( req, res, next ) => {
    modelBook
        .loadBookLibrary( { 
            sortBy: ( req.query[ 'sort' ] || 'id' ) 
        } )
        .then( _arrBooksData => {
            res.render( 'bookShop/getAll', { arrBooksData: _arrBooksData } );
        } );
};
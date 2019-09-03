const entityBook = require( '../entities/book' );

module.exports.getAll = ( req, res, next ) => {
    entityBook
        .loadBookLibrary( './data/books.txt', { 
            sortBy: ( req.query[ 'sort' ] || 'id' ) 
        } )
        .then( _arrBooksData => {
            res.render( 'admin/getAll', { 
                arrBooksData: _arrBooksData,
                sortBy: ( req.query[ 'sort' ] || 'id' )
            } );
        } );
};

module.exports.postNewBook = ( req, res, next ) => {
    res.render( 'admin/new-book' );
};
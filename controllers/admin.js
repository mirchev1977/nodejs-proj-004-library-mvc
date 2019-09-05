const entityBook = require( '../entities/book' );

module.exports.getAll = getAll;
function getAll ( req, res, next ) {
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
}

module.exports.getNewBook = ( req, res, next ) => {
    res.render( 'admin/new-book' );
};

module.exports.postNewBook = ( req, res, next ) => {
    entityBook.getBooksLastId( 
            './data/booksLastId.txt' 
        ).then( lastId => {
            lastId++;
            return entityBook.appendNewBook( 
                './data/books.txt',
                lastId, 
                req.body[ 'book-title'     ],
                req.body[ 'book-author'    ],
                req.body[ 'book-available' ],
                req.body[ 'book-issuedon'  ],
            ).then( success => {
                return entityBook.writeIncreasedLastId( lastId );
            } );
        } ).then( _increasedId => {
            getAll( req, res, next ); 
        } ); 
};

module.exports.getDeleteBook = ( req, res, next ) => {
    const _bookId = req.query[ 'id' ];

    entityBook.deleteBook( _bookId ).then( _bookId => {
        res.redirect( `/admin/all-books?sort=` + req.query[ 'sort' ] );
    } );
};

module.exports.getEditBook = ( req, res, next ) => {
    const _bookId        = req.query[ 'id'          ];
    const _bookTitle     = req.query[ 'title'       ];
    const _bookAuthor    = req.query[ 'author'      ];
    const _bookAvail     = req.query[ 'available'   ];
    const _bookIssuedOn  = req.query[ 'issuedon'    ];
    const _sortBy        = req.query[ 'sort'        ];

    res.render( `admin/edit-book.pug`, { book: {
        id:        _bookId,
        title:     _bookTitle,
        author:    _bookAuthor,
        available: _bookAvail,
        issuedon:  _bookIssuedOn,
        sortBy:    _sortBy
    } } );
};

module.exports.postEditBook = ( req, res, next ) => {
    entityBook.editBook( req.body ).then( _bookBody => {
        res.redirect( `/admin/all-books?sort=` + req.body[ 'book-sort' ] );
    } );
}

module.exports.getRestore = ( req, res, next ) => {
    entityBook.loadBookLibrary ( 
            './data/books_template.txt', 
            { sortBy: 'id' } 
        ).then( _arrBooksData => {
            return entityBook.writeBookLibrary( './data/books.txt', _arrBooksData );
        } ).then( _result => {
            return entityBook.getBooksLastId( './data/booksLastId_template.txt' );
        } ).then( _lastId => {
            return entityBook.writeIncreasedLastId( _lastId );
        } ).then( _success => {
            return entityBook.emptyCard();
        } ).then( _success => {
            res.redirect( `/admin/all-books?sort=id` );
        } );
};
const fs         = require( 'fs' );
const bookModels = require( './bookModels' );

const Book            = bookModels.Book;
const BookAddedToCart = bookModels.BookAddedToCart;

module.exports.loadBookLibrary = loadBookLibrary;
function loadBookLibrary ( path, opt ) {
    return bookModels.readLibraryBooks( path, opt );
}

module.exports.editBook = editBook;
function editBook ( _bookBody ) {
    const promise = new Promise( ( resolve, reject ) => {
        loadBookLibrary( './data/books.txt', { sortBy: 'id' } ).then( _arrBooksData => {
            debugger;
            resolve( _bookBody );
        } )
    } );
    return promise;
}

module.exports.writeBookLibrary = writeBookLibrary;
function writeBookLibrary ( path, arrBooksData = [] ) {
    const promise = new Promise( ( resolve, reject ) => {
        const _arrBookLines = [ "id;title;author;available;issuedon" ];
        arrBooksData.forEach( _book => {
            const _bookArr = [
                _book[ 'id'        ],
                _book[ 'title'     ],
                _book[ 'author'    ],
                _book[ 'available' ],
                _book[ 'issuedon' ]
            ];
            _arrBookLines.push( _bookArr.join( ';' ) );
        } );

        const _strBookLines = _arrBookLines.join( "\n" );

        fs.writeFile( path, _strBookLines, ( err ) => {
            if ( err ) {
                console.log( err );
                reject( err );
            }

            resolve( arrBooksData );
        } );
    } );

    return promise;
}

module.exports.takeFromAvailable = takeFromAvailable;
function takeFromAvailable( path, body ) {
    const promise = new Promise( ( resolve, reject ) => {
        let _BookAvailabilityModified = new BookAddedToCart();
        loadBookLibrary ( path, { sortBy: 'id' } ).then( _arrBooksData => {
            _arrBooksData.forEach(_book => {
                if ( _book[ 'id' ] === body[ 'id' ] ) {
                    _book[ 'available' ] -= body[ 'amount' ];

                    _BookAvailabilityModified = new BookAddedToCart(
                        _book[ 'id'        ], _book[ 'title'    ], _book[ 'author' ],
                        _book[ 'available' ], _book[ 'issuedon' ], 0
                    );
                    _BookAvailabilityModified[ 'addedToCart' ] = body[ 'amount' ];
                }
            });

            writeBookLibrary( './data/books.txt', _arrBooksData ).then( _arrBooksData => {
                resolve( _BookAvailabilityModified );
            } ).catch( err => {
                reject( err );
            } );
        } ); 
    } );

    return promise;
};

module.exports.addToCart = addToCart;
function addToCart ( book = new BookAddedToCart ) {
    let bookStr;

    const promise = new Promise( ( resolve, reject ) => {
        bookModels.readBooksAddedToCard ( './data/added_to_cart.txt' ).then( _booksAlreadyAdded => {
            let   _bookAlreadyPresent = false;
            const _arrBookLines = [];
            _booksAlreadyAdded.forEach( _bookAlreadyAdded => {
                let _bookArr = Object.values( _bookAlreadyAdded );

                if ( _bookAlreadyAdded[ 'id' ] === book[ 'id' ] ) {
                    _bookAlreadyPresent = true;
                    book[ 'addedToCart' ] =  ( book[ 'addedToCart' ] * 1 ) 
                        + ( _bookAlreadyAdded[ 'addedToCart' ]  * 1);
                    
                    _bookArr = Object.values( book );
                }

                const _bookLine = _bookArr.join( ';' );
                _arrBookLines.push( _bookLine );
            } );

            if ( !_bookAlreadyPresent ) {
                const _bookArr = Object.values( book ); 
                const _bookLine = _bookArr.join( ';' );
                _arrBookLines.push( _bookLine );
            }

            bookStr = _arrBookLines.join( "\n" );

            bookModels.writeBooksToFile( 
                    './data/added_to_cart.txt', 
                    bookStr 
                ).then( success => {} ).catch( err => reject( err ) ); 
        } );

        resolve( bookStr );
    } );

    return promise;
}

module.exports.readBooksAddedToCard = readBooksAddedToCard;
function readBooksAddedToCard ( path ) {
    return bookModels.readBooksAddedToCard( path );
}

module.exports.discardBooksFromCard = discardBooksFromCard;
function discardBooksFromCard ( _arrBooksAddedToCard, _idBookToDiscard ) {
    const promise = new Promise( ( resolve, reject ) => {
        const arrBookDiscarded = _arrBooksAddedToCard.filter( _book => {
            return _book[ 'id' ] !== _idBookToDiscard;
        } );

        bookModels.writeBooksToFile( './data/added_to_cart.txt', bookModels.bookArrToBookStr( arrBookDiscarded ) )
        .then ( success => {
            const _objBookToDiscard = _arrBooksAddedToCard.filter( _book => {
                return _book[ 'id' ] === _idBookToDiscard;
            } )[ 0 ];
            const _bookDiscarded = new Book(
                _objBookToDiscard[ 'id'             ],
                _objBookToDiscard[ 'title'          ],
                _objBookToDiscard[ 'author'         ],
                _objBookToDiscard[ 'availableTotal' ],
                _objBookToDiscard[ 'issuedon'       ]
            );

            const promise = new Promise( ( resolve, reject ) => {
                bookModels.readLibraryBooks ( './data/books.txt', { sortBy: 'id' } ).then( _arrBooksData => {
                    _arrBooksData.forEach( ( _book, i ) => {
                        if ( _book[ 'id' ] === _bookDiscarded[ 'id' ] ) {
                            _arrBooksData[ i ] = _bookDiscarded;
                        }
                    } );

                    const booksStr = 'id;title;author;available;issuedon' 
                        + "\n"
                        + bookModels.bookArrToBookStr( _arrBooksData );
                
                    bookModels.writeBooksToFile(
                            './data/books.txt',
                            booksStr
                        ).then( success => {
                            resolve( success );
                        } );
                } ); 
            } );

            return promise;
        } ).then( success => {
            resolve( arrBookDiscarded ); 
        } ); 
    } );

    return promise;
}

module.exports.getBooksLastId = getBooksLastId;
function getBooksLastId ( path ) {
    let fileStr = '';
    const promise = new Promise( ( resolve, reject ) => {
        fs.readFile( path, ( err, data ) => {
            if ( err ) {
                reject( err );
                return;
            }
            fileStr += data;

            fileStr = fileStr.trim();

            resolve( fileStr );
        } ); 
    } );

    return promise;
}

module.exports.writeIncreasedLastId = writeIncreasedLastId;
function writeIncreasedLastId ( _idIncreased ) {

    const promise = new Promise( ( resolve, reject ) => {
        fs.writeFile( './data/booksLastId.txt', _idIncreased, ( err ) => {
            if ( err ) {
                console.log( err );
                reject( err );
            }

            resolve( _idIncreased );
        } );
    } );

    return promise;
}

module.exports.appendNewBook = appendNewBook;
function appendNewBook ( path, _id, _title, _author, _available, _issuedon ) {
    const _strBookDetails = [
        _id, _title, _author, _available, _issuedon
    ].join( ';' ) + "\n";

    const promise = new Promise( ( resolve, reject ) => {
        fs.appendFile( path, _strBookDetails, err => {
            if ( err ) {
                reject( err );
                return;
            }

            resolve( true );
        } );
    } );

    return promise;
}

module.exports.deleteBook = deleteBook;
function deleteBook ( _bookId ) {
    const promise = new Promise( ( resolve, reject ) => {
        loadBookLibrary ( './data/books.txt', { sortBy: 'id' } ).then( _arrBooks => {
            const _booksFiltered = _arrBooks.filter( _book => {
                return _book[ 'id' ] !== _bookId;
            } );

            const _strBooks = "id;title;author;available;issuedon\n"
                + bookModels.bookArrToBookStr( _booksFiltered )
            bookModels.writeBooksToFile( 
                './data/books.txt', 
                _strBooks
             ).then( success => {
                resolve( _bookId );
             } );

        } );

    } );
    return promise;
}

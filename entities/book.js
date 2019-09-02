const fs         = require( 'fs' );
const bookModels = require( './bookModels' );

const Book            = bookModels.Book;
const BookAddedToCart = bookModels.BookAddedToCart;

module.exports.loadBookLibrary = loadBookLibrary;
function loadBookLibrary ( path, opt ) {
    return bookModels.readLibraryBooks( path, opt );
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
            fs.writeFile( './data/added_to_cart.txt', bookStr, ( err ) => {
                if ( err ) {
                    console.log( err );
                    reject( err );
                }
            } ) 
        } );

        resolve( bookStr );
    } );

    return promise;
}

module.exports.readBooksAddedToCard = readBooksAddedToCard;
function readBooksAddedToCard ( path ) {
    return bookModels.readBooksAddedToCard( path );
}
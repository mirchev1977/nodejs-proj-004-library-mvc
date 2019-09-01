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
    const bookArr = Object.values( book );
    const bookStr = bookArr.join( ';' ) + "\n";

    const promise = new Promise( ( resolve, reject ) => {
        fs.appendFile( './data/added_to_cart.txt', bookStr, ( err ) => {
            if ( err ) {
                console.log( err );
                reject( err );
            }
        } ) 

        resolve( bookStr );
    } );

    return promise;
}
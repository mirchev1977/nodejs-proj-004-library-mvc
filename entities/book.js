const fs = require( 'fs' );

class Book {
    constructor ( id, title, author, available, issuedon ) {
        this.id         = id;
        this.title      = title;
        this.author     = author;
        this.available = available;

        this.setIssuedOn( issuedon );
    }

    setIssuedOn ( date ) {
        this.issuedon = date;
    }
}

class BookAddedToCart extends Book {
    constructor ( 
        id          = 0, 
        title       = '', 
        author      = '', 
        available   = 0, 
        issuedon    = '01.01.1970', 
        addedToCart = 0 
    ) {
        super( id, title, author, available, issuedon );
        this.addedToCart = addedToCart;
    }
}
module.exports.BookAddedToCart = BookAddedToCart;

module.exports.loadBookLibrary = loadBookLibrary;
function loadBookLibrary ( path, opt ) {
    let allBooksStr = '';

    const promise = new Promise( ( resolve, reject ) => {
        fs.readFile( path, ( err, data ) => {
            if ( !err ) {
                allBooksStr += data;

                const _arrBookLines = allBooksStr.split( /\n/ )
                    .filter( line => { if ( line ) return line; } );
                _arrBookLines.shift().split( ';' );

                const _arrBooksData = _arrBookLines.map( line => {
                    const [ _id, _title, _author, _available, _issuedon ] = line.split( ';' );
                    return new Book( _id, _title, _author, _available, _issuedon );
                } );

               _arrBooksData.sort( ( a, b ) => {
                   if ( opt[ 'sortBy' ].match( /id|available/ ) ) {
                    return ( a[ opt[ 'sortBy' ] ] - b[ opt[ 'sortBy' ] ] );
                   } else {
                    return ( a[ opt[ 'sortBy' ] ].localeCompare( b[ opt[ 'sortBy' ] ] )  ); 
                   }
                } );

                resolve( _arrBooksData );
                return;
            }

            reject( err );
        } );
    }  );

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
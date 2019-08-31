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

module.exports.addToCart = addToCart;
function addToCart( path, body ) {
    const promise = new Promise( ( resolve, reject ) => {
        loadBookLibrary ( path, { sortBy: 'id' } ).then( _arrBooksData => {
            _arrBooksData.forEach(_book => {
                if ( _book[ 'id' ] === body[ 'id' ] ) {
                    _book[ 'available' ] -= body[ 'amount' ];
                }
            });

            writeBookLibrary( './data/books.txt', _arrBooksData ).then( _arrBooksData => {
                resolve( _arrBooksData );
            } ).catch( err => {
                reject( err );
            } );
        } ); 
    } );

    return promise;
};
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
module.exports.Book = Book;

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
        this.availableTotal 
            = ( this.available * 1 ) 
                + ( this.addedToCart * 1 );
    }
}
module.exports.BookAddedToCart = BookAddedToCart;


module.exports.readLibraryBooks = readLibraryBooks;
function readLibraryBooks ( path, opt ) {
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
                   } else if ( opt[ 'sortBy' ].match( /issuedon/ ) ) {
                       const [ aDay, aMonth, aYear ] = a.issuedon.split( /\./ );
                       const aTime = new Date( aYear, aMonth, aDay ).getTime();
                       const [ bDay, bMonth, bYear ] = b.issuedon.split( /\./ );
                       const bTime = new Date( bYear, bMonth, bDay ).getTime();

                       return aTime - bTime;
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

module.exports.readBooksAddedToCard = readBooksAddedToCard;
function readBooksAddedToCard ( path ) {
    let allBooksStr = '';
    const promise = new Promise( ( resolve, reject ) => {
        fs.readFile( path, ( err, data ) => {
            if ( !err ) {
                allBooksStr += data;

                const _arrBookLines = allBooksStr.split( /\n/ )
                    .filter( line => { if ( line ) return line; } );

                let _arrBooksData = _arrBookLines.map( line => {
                    const [ _id, _title, _author, _available, _issuedon, _addedToCard ] 
                        = line.split( ';' );
                    return new BookAddedToCart( 
                            _id,        _title,    _author, 
                            _available, _issuedon, _addedToCard 
                        );
                } );

                _arrBooksData.sort( ( a, b ) => {
                   return ( a[ 'id' ] - b[ 'id' ] );
                } );

                _arrBooksData = _arrBooksData || [];
                resolve( _arrBooksData );
                return;
            }

            reject( err );
        } );
    }  );

    return promise;
}

module.exports.bookArrToBookStr = bookArrToBookStr;
function bookArrToBookStr ( _bookArray ) {
    const _arrCardBooksValues = [];
    _bookArray.forEach( _book => {
        _arrCardBooksValues.push( Object.values( _book ).join( ';' ) );
    } );

    return _arrCardBooksValues.join( "\n" );
}

module.exports.writeBooksToFile = writeBooksToFile;
function writeBooksToFile ( path, _strArrBooks ) {
    const promise = new Promise( ( resolve, reject ) => {
        fs.writeFile( path, _strArrBooks, ( err ) => {
            if ( err ) {
                console.log( err );
                reject( err );
            }

            resolve( '1' );
        } ) 
    } );

    return promise;
}
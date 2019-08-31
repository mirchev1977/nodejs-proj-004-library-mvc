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

module.exports.loadBookLibrary = function ( path, opt ) {
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
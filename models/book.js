const fs = require( 'fs' );

class Book {
    constructor ( id, title, author, issuedon ) {
        this.id       = id;
        this.title    = title;
        this.author   = author;

        this.setIssuedOn( issuedon );
    }

    setIssuedOn ( date ) {
        this.issuedon = date;
    }
}

let promArrBooksData = loadBookLibrary();
module.exports.promArrBooksData = promArrBooksData;

function loadBookLibrary () {
    let allBooksStr = '';

    const promise = new Promise( ( resolve, reject ) => {
        fs.readFile( './data/books.txt', ( err, data ) => {
            if ( !err ) {
                allBooksStr += data;

                const _arrBookLines = allBooksStr.split( /\n/ )
                    .filter( line => { if ( line ) return line; } );
                const _arrBookHeaders = _arrBookLines.shift().split( ';' );

                const _arrBooksData = _arrBookLines.map( line => {
                    const [ _id, _title, _author, _issuedon ] = line.split( ';' );
                    return new Book( _id, _title, _author, _issuedon );
                } );

                resolve( _arrBooksData );
                return;
            }

            reject( err );
        } );
    }  );

    return promise;
}

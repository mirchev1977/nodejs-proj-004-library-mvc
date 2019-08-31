const express    = require( 'express'             );
const path       = require( 'path'                );
const bodyParser = require( 'body-parser'         );

const rootDir = require( './utilities/rootDir' );

const app = express();

app.set( 'view engine', 'pug' );
app.set( 'views', 'views'     );


app.use( express.static( path.join( rootDir, 'public' ) ) );
app.use( bodyParser.urlencoded( { extended: false } )     );

app.get( '/', ( req, res, next ) => {
    res.render( 'test' );
} );

app.listen( process.env.PORT || 3000 );
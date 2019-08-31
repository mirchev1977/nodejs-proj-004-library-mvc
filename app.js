const express = require( 'express'             );
const path    = require( 'path'                );
const rootDir = require( './utilities/rootDir' );

const app = express();

app.set( 'view engine', 'pug' );
app.set( 'views', 'views'     );


app.use( express.static( path.join( rootDir, 'public' ) ) );

app.get( '/', ( req, res, next ) => {
    res.render( 'test' );
} );

app.listen( process.env.PORT || 3000 );
const express = require( 'express' );
const path = require( 'path' );
const rootDir = require( './utilities/rootDir' );

const app = express();
app.use( express.static( path.join( rootDir, 'public' ) ) );

app.get( '/', ( req, res, next ) => {
    res.write( '<h1>Hello World</h1>' );
    res.end();
} );

app.listen( process.env.PORT || 3000 );
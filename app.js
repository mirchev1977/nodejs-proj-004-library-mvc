const express = require( 'express' );

const app = express();

app.get( '/', ( req, res, next ) => {
    res.write( '<h1>Hello World</h1>' );
    res.end();
} );

app.listen( process.env.PORT || 3000 );
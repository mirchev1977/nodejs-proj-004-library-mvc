const express = require( 'express' );

const contrBookShop = require( '../controllers/bookShop' );

const router = express.Router();


router.get( '/', contrBookShop.getAll );

module.exports = router;
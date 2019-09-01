const express = require( 'express' );

const contrBookShop = require( '../controllers/bookShop' );

const router = express.Router();


router.get(  '/',            contrBookShop.getAll    );
router.post( '/add-to-cart', contrBookShop.addToCart );

router.get(  '/go-to-card', contrBookShop.getAddedToCard );

module.exports = router;
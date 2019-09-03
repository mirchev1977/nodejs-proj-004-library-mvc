const express = require( 'express' );

const contrAdmin = require( '../controllers/admin' );

const router = express.Router();


router.get(  '/all-books',  contrAdmin.getAll      );

router.get(  '/new-book',   contrAdmin.getNewBook  );
router.post( '/new-book',   contrAdmin.postNewBook );

router.get( '/delete', contrAdmin.deleteBook );

module.exports = router;
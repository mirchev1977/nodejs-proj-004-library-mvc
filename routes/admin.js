const express = require( 'express' );

const contrAdmin = require( '../controllers/admin' );

const router = express.Router();


router.get(  '/all-books',  contrAdmin.getAll      );

router.get(  '/new-book',   contrAdmin.getNewBook  );
router.post( '/new-book',   contrAdmin.postNewBook );

router.get( '/delete', contrAdmin.getDeleteBook );

router.get(  '/edit',   contrAdmin.getEditBook    );
router.post( '/edit',   contrAdmin.postEditBook   );

module.exports = router;
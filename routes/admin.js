const express = require( 'express' );

const contrAdmin = require( '../controllers/admin' );

const router = express.Router();


router.get(  '/all-books', contrAdmin.getAll);
router.get(  '/new-book',  contrAdmin.postNewBook);

module.exports = router;
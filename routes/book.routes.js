const router = require("express").Router();
const Book = require("../models/Book.model.js");

//CREATE
//GET route to display Form to create a book
router.get("/books/create", (req, res, next) => {
  res.render("books/book-create");
});
router.post("/books/create", (req, res, next) => {
  // console.log(req.body);
  const { title, author, description, rating } = req.body;
  Book.create({ title, author, description, rating })
    .then((booksFromDB) => {
      console.log(`New book created: '${booksFromDB}.`);
      res.redirect("/books");
    })
    .catch((error) => next(error));
});

//READ
//GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
  Book.find()
    .then((allTheBooksFromDB) => {
      // console.log('Retrieved books from DB: ', allTheBooksFromDB);
      res.render("books/books-list", { books: allTheBooksFromDB });
    })
    .catch((error) => {
      console.log("Error While getting the books from the DB: ", error);
      next(error);
    });
});

//GET route to retrive details of a book passed in :req.params.bookId
router.get("/books/:bookId", (req, res, next) => {
  const { bookId } = req.params;
  Book.findById(bookId)
    .then((theBook) => {
      // console.log('The ID from the URL is: ', bookId);
      res.render("books/book-details", { book: theBook });
    })
    .catch((error) => {
      console.log("Error while retrieving book details", error);
      next(error);
    });
});


//UPDATE
//GET
router.get('/books/:bookId/edit', (req, res, next) => {
  const {bookId} = req.params;

  Book.findById(bookId)
    .then(bookToEdit => {
      console.log(bookToEdit);
      res.render('books/book-edit', {book: bookToEdit});
    })
    .catch(error => next(error))    
});

router.post('/books/:bookId/edit', (req, res, next) => {
  const {bookId} = req.params;
  const {title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(bookId, {title, description, author, rating}, {new: true})
    .then(updatedBook => {
      res.redirect(`/books/${updatedBook.id}`);  
    })
    .catch(error => next(error));
});

//DELETE
//POST
router.post('/books/:bookId/delete', (req, res, next) => {
  const {bookId} = req.params;

  Book.findByIdAndDelete(bookId)
    .then(() => {
      res.redirect('/books');
  })
    .catch(error => next(error));

});

module.exports = router;

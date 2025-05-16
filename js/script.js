document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

  function addBook() {
      const titleInput = document.getElementById('title');
      const authorInput = document.getElementById('author');
      const yearInput = document.getElementById('year');
      const isReadCheckbox = document.getElementById('isRead');

      const title = titleInput.value;
      const author = authorInput.value;
      const year = yearInput.value;
      const isComplete = isReadCheckbox.checked;

      if (title && author && year) {
          const id = +new Date();
          const book = { id, title, author, year: parseInt(year), isComplete };

          saveBook(book);
          clearForm();
          loadBooks();
      } else {
          alert('Please enter both title, author, and year.');
      }
  }

  function saveBook(book) {
      let unfinishedBooks = JSON.parse(localStorage.getItem('unfinishedBooks')) || [];
      let finishedBooks = JSON.parse(localStorage.getItem('finishedBooks')) || [];

      if (book.isComplete) {
          finishedBooks.push(book);
          localStorage.setItem('finishedBooks', JSON.stringify(finishedBooks));
      } else {
          unfinishedBooks.push(book);
          localStorage.setItem('unfinishedBooks', JSON.stringify(unfinishedBooks));
      }
  }

  function searchBooks() {
      const searchTerm = document.getElementById('search').value.toLowerCase();
      const books = getBooks();

      const searchResult = books.filter(book => book.title.toLowerCase().includes(searchTerm));
      renderBooks(searchResult);
  }

  function resetSearch() {
      const formSearch = document.getElementById('formSearch');
      formSearch.reset();
      loadBooks();
  }

  function renderBooks(books) {
      const unfinishedShelf = document.getElementById('unfinishedBookshelf');
      const finishedShelf = document.getElementById('finishedBookshelf');

      unfinishedShelf.innerHTML = '';
      finishedShelf.innerHTML = '';

      books.forEach(book => {
          const bookElement = createBookElement(book);
          if (book.isComplete) {
              finishedShelf.appendChild(bookElement);
          } else {
              unfinishedShelf.appendChild(bookElement);
          }
      });
  }

  function saveBook(book) {
      let books = getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
  }

  function getBooks() {
      return JSON.parse(localStorage.getItem('books')) || [];
  }

  function loadBooks() {
      const books = getBooks();
      renderBooks(books);
  }

  function createBookElement(book) {
      const bookElement = document.createElement("div");
      bookElement.id = `book-${book.id}`;
      bookElement.classList.add("item");

      const titleElement = document.createElement("div");
      titleElement.classList.add("item-title");
      titleElement.innerHTML = `${book.title} <span>(${book.year})</span>`;

      const authorElement = document.createElement("div");
      authorElement.classList.add("item-writer");
      authorElement.innerText = book.author;

      const actionContainer = document.createElement("div");
      actionContainer.classList.add("item-action");

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;
      deleteBtn.addEventListener("click", () => {
          deleteBook(book.id);
      });

      actionContainer.append(deleteBtn);

      if (book.isComplete) {
          const moveBtn = document.createElement("button");
          moveBtn.classList.add("move-btn");
          moveBtn.innerHTML = `<i class='bx bx-undo'></i>`;
          moveBtn.addEventListener("click", () => {
              moveBook(book.id);
          });

          actionContainer.append(moveBtn);
      } else {
          const finishBtn = document.createElement("button");
          finishBtn.classList.add("done-btn");
          finishBtn.innerHTML = `<i class='bx bx-check'></i>`;
          finishBtn.addEventListener("click", () => {
              moveToFinishedShelf(book.id);
          });

          actionContainer.append(finishBtn);
      }

      bookElement.append(titleElement, authorElement, actionContainer);

      return bookElement;
  }

  function moveToFinishedShelf(bookId) {
      const books = getBooks();
      const updatedBooks = books.map(book => {
          if (book.id === bookId) {
              book.isComplete = true;
          }
          return book;
      });
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      renderBooks(updatedBooks);
  }

  function deleteBook(id) {
      let books = getBooks();
      books = books.filter(book => book.id !== id);
      localStorage.setItem('books', JSON.stringify(books));
      renderBooks(books);
  }

  function moveBook(id) {
      let books = getBooks();
      books = books.map(book => {
          if (book.id === id) {
              book.isComplete = !book.isComplete;
          }
          return book;
      });
      localStorage.setItem('books', JSON.stringify(books));
      renderBooks(books);
  }

  function clearForm() {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('year').value = '';
      document.getElementById('isRead').checked = false;
  }

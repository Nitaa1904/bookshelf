document.addEventListener('DOMContentLoaded', function () {
    const inputForm = document.getElementById('inputBook');
    inputForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function generateId() {
    return +new Date();
  }
  
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }
  
  const books = [];
  const RENDER_EVENT = 'render-book';
  
  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById('incompleteBookshelfList');
    const completeBookList = document.getElementById('completeBookshelfList');
  
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';
  
    for (const book of books) {
      const bookElement = makeBook(book);
      if (!book.isComplete)
        incompleteBookList.append(bookElement);
      else
        completeBookList.append(bookElement);
    }
  });
  
  function makeBook(bookObject) {
    const titleElement = document.createElement('h3');
    titleElement.innerText = bookObject.title;
  
    const authorElement = document.createElement('p');
    authorElement.innerText = `Penulis: ${bookObject.author}`;
  
    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun: ${bookObject.year}`;
  
    const actionElement = document.createElement('div');
    actionElement.classList.add('action');
  
    if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.addEventListener('click', function () {
        undoBookFromComplete(bookObject.id);
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.addEventListener('click', function () {
        deleteBook(bookObject.id);
      });
  
      actionElement.append(undoButton, deleteButton);
    } else {
      const completeButton = document.createElement('button');
      completeButton.classList.add('green');
      completeButton.addEventListener('click', function () {
        completeBook(bookObject.id);
      });
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.addEventListener('click', function () {
        deleteBook(bookObject.id);
      });
  
      actionElement.append(completeButton, deleteButton);
    }
  
    const bookElement = document.createElement('article');
    bookElement.classList.add('book_item');
    bookElement.append(titleElement, authorElement, yearElement, actionElement);
  
    return bookElement;
  }
  
  function completeBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function undoBookFromComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function deleteBook(bookId) {
    const bookTargetIndex = findBookIndex(bookId);
    if (bookTargetIndex === -1) return;
  
    books.splice(bookTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function findBook(bookId) {
    for (const book of books) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }
  
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }
  
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  const SAVED_EVENT = 'saved-book';
  const STORAGE_KEY = 'BOOK_APPS';
  
  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
  
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data!== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const yearInput = document.getElementById('inputBookYear').value;
    const year = parseInt(yearInput);
  
    if (isNaN(year) || year < 0) {
      alert('Nilai tahun tidak valid. Silakan masukkan tahun yang valid.');
      return;
    }
  
    const isComplete = document.getElementById('inputBookIsComplete').checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);
  
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
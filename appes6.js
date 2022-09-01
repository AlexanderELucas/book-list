class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}



class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        //create table row element
        const row = document.createElement('tr');
        //insert cols
        row.innerHTML= `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        
        list.appendChild(row);
    }

    showAlert(message, className) {
        //create div
        const div = document.createElement('div');
        //add class
        div.className = `alert ${className}`;
        //add text
        div.appendChild(document.createTextNode(message));

        //get a parent
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        //insert alert above form
        container.insertBefore(div, form);

        //set timeout
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}



//Local Storage
class Store {
    static getBooks() {
        let books;
        
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    
    static displayBooks() {
        //get stored book list
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;

            //add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        //get stored book list
        const books = Store.getBooks();
        //add new book
        books.push(book);
        //return new stored books to local storage
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        
        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);


// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    //get form values
    const
        title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
    
    //Instantiate book
    const book = new Book(title, author, isbn);
    //Instantiate UI
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || isbn === ''){
        //error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        //Add book to list
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);
        
        //show success
        ui.showAlert('Book Added', 'success');
        //clear fields
        ui.clearFields();
    }
    e.preventDefault();    
});

// event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    //instantiate UI
    const ui = new UI();
    ui.deleteBook(e.target);

    //Remove from Local Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show message
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});

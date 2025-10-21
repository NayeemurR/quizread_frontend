<template>
  <div class="library-page">
    <div class="library-header">
      <h1 class="library-title">Library</h1>
      <button @click="showAddBookModal = true" class="add-book-btn">
        Add book
      </button>
    </div>

    <div class="books-grid" v-if="books.length > 0">
      <div
        v-for="book in books"
        :key="book._id"
        class="book-card"
        @click="selectBook(book)"
      >
        <div class="book-cover">
          <div class="book-placeholder">
            <span class="book-icon">📖</span>
          </div>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-pages">{{ book.totalPages }} pages</p>
        </div>
      </div>
    </div>

    <div v-else class="empty-library">
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>No books yet</h2>
        <p>Add your first book to get started with reading!</p>
        <button @click="showAddBookModal = true" class="add-first-book-btn">
          Add your first book
        </button>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddBookModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Add New Book</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="addBook" class="add-book-form">
          <div class="form-group">
            <label for="bookTitle">Book Title</label>
            <input
              type="text"
              id="bookTitle"
              v-model="newBook.title"
              required
              placeholder="Enter book title"
            />
          </div>
          <div class="form-group">
            <label for="totalPages">Total Pages</label>
            <input
              type="number"
              id="totalPages"
              v-model.number="newBook.totalPages"
              required
              min="1"
              placeholder="Enter total pages"
            />
          </div>
          <div class="form-group">
            <label for="bookFile">Book File</label>
            <input
              type="file"
              id="bookFile"
              @change="handleFileUpload"
              accept=".pdf,.epub,.txt"
              required
            />
            <small>Supported formats: PDF, EPUB, TXT</small>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" :disabled="addingBook" class="submit-btn">
              {{ addingBook ? "Adding..." : "Add Book" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your books...</p>
    </div>
  </div>
</template>

<script>
import { apiService } from "../services/apiService.js";

export default {
  name: "Library",
  data() {
    return {
      books: [],
      loading: false,
      showAddBookModal: false,
      addingBook: false,
      newBook: {
        title: "",
        totalPages: null,
        file: null,
      },
      // For demo purposes, using a hardcoded user ID
      // In a real app, this would come from authentication
      currentUserId: "demo-user-123",
    };
  },
  async mounted() {
    await this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.loading = true;
      try {
        const books = await apiService.library.getUserBooks(this.currentUserId);
        this.books = books;
      } catch (error) {
        console.error("Failed to load books:", error);
        // For demo purposes, show some mock data if API fails
        this.books = [
          {
            _id: "demo-book-1",
            title: "The Great Gatsby",
            totalPages: 180,
            ownerId: this.currentUserId,
            storageUrl: "demo-url-1",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "demo-book-2",
            title: "To Kill a Mockingbird",
            totalPages: 281,
            ownerId: this.currentUserId,
            storageUrl: "demo-url-2",
            createdAt: new Date().toISOString(),
          },
        ];
      } finally {
        this.loading = false;
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newBook.file = file;
        // Generate a mock storage URL for demo purposes
        this.newBook.storageUrl = `gs://quizread-books/${Date.now()}-${
          file.name
        }`;
      }
    },

    async addBook() {
      if (
        !this.newBook.title ||
        !this.newBook.totalPages ||
        !this.newBook.file
      ) {
        alert("Please fill in all fields and select a file");
        return;
      }

      this.addingBook = true;
      try {
        const result = await apiService.library.addBook(
          this.currentUserId,
          this.newBook.title,
          this.newBook.totalPages,
          this.newBook.storageUrl
        );

        // Add the new book to the local list
        const newBook = {
          _id: result.bookId,
          title: this.newBook.title,
          totalPages: this.newBook.totalPages,
          ownerId: this.currentUserId,
          storageUrl: this.newBook.storageUrl,
          createdAt: new Date().toISOString(),
        };

        this.books.unshift(newBook);
        this.closeModal();
        this.resetForm();

        alert("Book added successfully!");
      } catch (error) {
        console.error("Failed to add book:", error);
        alert(
          `Failed to add book: ${error.response?.data?.error || error.message}`
        );
      } finally {
        this.addingBook = false;
      }
    },

    selectBook(book) {
      console.log("Selected book:", book);
      // TODO: Navigate to book reading view
      alert(`Selected: ${book.title}`);
    },

    closeModal() {
      this.showAddBookModal = false;
      this.resetForm();
    },

    resetForm() {
      this.newBook = {
        title: "",
        totalPages: null,
        file: null,
        storageUrl: "",
      };
      // Reset file input
      const fileInput = document.getElementById("bookFile");
      if (fileInput) {
        fileInput.value = "";
      }
    },
  },
};
</script>

<style scoped>
.library-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.library-title {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 300;
}

.add-book-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
}

.add-book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.book-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.book-cover {
  margin-bottom: 1rem;
}

.book-placeholder {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dee2e6;
}

.book-icon {
  font-size: 2rem;
  color: #6c757d;
}

.book-info {
  text-align: center;
}

.book-title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.3;
}

.book-pages {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-library {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.add-first-book-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s;
}

.add-first-book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #2c3e50;
}

.add-book-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #6c757d;
  margin: 0;
}
</style>

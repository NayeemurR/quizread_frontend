<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>Book Cover Component Demo</h1>
      <p>Beautiful closed book graphics that match your website style</p>
    </div>

    <div class="demo-section">
      <h2>Default Variant</h2>
      <div class="book-showcase">
        <BookCover
          title="The Great Gatsby"
          :width="150"
          :height="200"
          variant="default"
        />
        <BookCover
          title="To Kill a Mockingbird"
          :width="150"
          :height="200"
          variant="default"
        />
        <BookCover title="1984" :width="150" :height="200" variant="default" />
      </div>
    </div>

    <div class="demo-section">
      <h2>Gradient Variant</h2>
      <div class="book-showcase">
        <BookCover
          title="Pride and Prejudice"
          :width="150"
          :height="200"
          variant="gradient"
        />
        <BookCover
          title="The Catcher in the Rye"
          :width="150"
          :height="200"
          variant="gradient"
        />
        <BookCover
          title="One Hundred Years of Solitude"
          :width="150"
          :height="200"
          variant="gradient"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>Dark Variant</h2>
      <div class="book-showcase">
        <BookCover
          title="The Lord of the Rings"
          :width="150"
          :height="200"
          variant="dark"
        />
        <BookCover title="Dune" :width="150" :height="200" variant="dark" />
        <BookCover
          title="The Handmaid's Tale"
          :width="150"
          :height="200"
          variant="dark"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>Different Sizes</h2>
      <div class="book-showcase">
        <BookCover
          title="Small Book"
          :width="100"
          :height="140"
          variant="gradient"
        />
        <BookCover
          title="Medium Book"
          :width="150"
          :height="200"
          variant="gradient"
        />
        <BookCover
          title="Large Book"
          :width="200"
          :height="280"
          variant="gradient"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>Long Titles</h2>
      <div class="book-showcase">
        <BookCover
          title="The Very Long Book Title That Should Wrap Nicely"
          :width="150"
          :height="200"
          variant="gradient"
        />
        <BookCover
          title="A Book With An Extremely Long Title That Tests Text Wrapping and Truncation"
          :width="150"
          :height="200"
          variant="default"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BookCover from "../components/BookCover.vue";

export default {
  name: "BookCoverDemo",
  components: {
    BookCover,
  },
};
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.book-showcase {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .book-showcase {
    flex-direction: column;
    align-items: center;
  }

  .demo-page {
    padding: 1rem;
  }

  .demo-section {
    padding: 1.5rem;
  }
}
</style>

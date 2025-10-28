<template>
  <div class="book-cover-container">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 200 280"
      class="book-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Gradient definition -->
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            :style="`stop-color:${gradientStart};stop-opacity:1`"
          />
          <stop
            offset="100%"
            :style="`stop-color:${gradientEnd};stop-opacity:1`"
          />
        </linearGradient>

        <!-- Shadow gradient -->
        <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            style="stop-color: rgba(0, 0, 0, 0.1); stop-opacity: 1"
          />
          <stop
            offset="100%"
            style="stop-color: rgba(0, 0, 0, 0.3); stop-opacity: 1"
          />
        </radialGradient>
      </defs>

      <!-- Book shadow -->
      <ellipse
        cx="100"
        cy="270"
        rx="85"
        ry="8"
        fill="url(#shadowGradient)"
        opacity="0.4"
      />

      <!-- Book cover -->
      <rect
        x="20"
        y="20"
        width="160"
        height="240"
        rx="8"
        ry="8"
        :fill="coverColor"
        stroke="rgba(255, 255, 255, 0.3)"
        stroke-width="1"
      />

      <!-- Book spine -->
      <rect
        x="20"
        y="20"
        width="8"
        height="240"
        :fill="spineColor"
        rx="4"
        ry="4"
      />

      <!-- Book pages edge -->
      <rect x="28" y="20" width="4" height="240" fill="#f8f9fa" opacity="0.9" />

      <!-- Title area background -->
      <rect
        x="40"
        y="60"
        width="120"
        height="80"
        :fill="titleBgColor"
        rx="6"
        ry="6"
        opacity="0.95"
      />

      <!-- Title text with better text wrapping -->
      <foreignObject x="40" y="60" width="120" height="80">
        <div xmlns="http://www.w3.org/1999/xhtml" class="title-container">
          <div class="book-title-text" :style="{ color: titleColor }">
            {{ title }}
          </div>
        </div>
      </foreignObject>

      <!-- Decorative line under title -->
      <line
        x1="60"
        y1="120"
        x2="140"
        y2="120"
        :stroke="titleColor"
        stroke-width="1.5"
        opacity="0.7"
      />

      <!-- Subtle highlight on cover -->
      <rect
        x="25"
        y="25"
        width="150"
        height="230"
        fill="none"
        :stroke="highlightColor"
        stroke-width="1"
        rx="6"
        ry="6"
        opacity="0.4"
      />

      <!-- Corner accent -->
      <circle cx="160" cy="40" r="3" :fill="accentColor" opacity="0.8" />

      <!-- Additional decorative elements -->
      <circle cx="50" cy="200" r="2" :fill="accentColor" opacity="0.5" />
      <circle cx="150" cy="180" r="1.5" :fill="accentColor" opacity="0.4" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "BookCover",
  props: {
    title: {
      type: String,
      default: "Book Title",
    },
    width: {
      type: [String, Number],
      default: 200,
    },
    height: {
      type: [String, Number],
      default: 280,
    },
    variant: {
      type: String,
      default: "default", // default, gradient, dark
      validator: (value) => ["default", "gradient", "dark"].includes(value),
    },
  },
  computed: {
    gradientStart() {
      return "#667eea";
    },
    gradientEnd() {
      return "#764ba2";
    },
    coverColor() {
      switch (this.variant) {
        case "gradient":
          return "url(#bookGradient)";
        case "dark":
          return "#2c3e50";
        default:
          return "#ffffff";
      }
    },
    spineColor() {
      switch (this.variant) {
        case "gradient":
          return "#5a6fd8";
        case "dark":
          return "#1a252f";
        default:
          return "#667eea";
      }
    },
    titleBgColor() {
      switch (this.variant) {
        case "gradient":
          return "rgba(255, 255, 255, 0.95)";
        case "dark":
          return "rgba(255, 255, 255, 0.15)";
        default:
          return "rgba(102, 126, 234, 0.1)";
      }
    },
    titleColor() {
      switch (this.variant) {
        case "gradient":
          return "#2c3e50";
        case "dark":
          return "#ffffff";
        default:
          return "#2c3e50";
      }
    },
    highlightColor() {
      switch (this.variant) {
        case "gradient":
          return "#ffffff";
        case "dark":
          return "#667eea";
        default:
          return "#667eea";
      }
    },
    accentColor() {
      switch (this.variant) {
        case "gradient":
          return "#764ba2";
        case "dark":
          return "#667eea";
        default:
          return "#764ba2";
      }
    },
  },
};
</script>

<style scoped>
.book-cover-container {
  display: inline-block;
  transition: transform 0.3s ease;
}

.book-cover-container:hover {
  transform: translateY(-2px);
}

.book-svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.title-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  box-sizing: border-box;
}

.book-title-text {
  font-family: "Avenir", "Helvetica", "Arial", sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  word-spacing: 0.1em;
  letter-spacing: 0.02em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-height: 60px;
}
</style>

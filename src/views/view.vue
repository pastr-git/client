<template>
  <div class="view">
    <pre><code :class="$store.getters.getLang" ref="highlight">{{content}}</code></pre>
  </div>
</template>

<script>
export default {
  name: "view-paste",
  data() {
    return {
      error: undefined,
      selectedLine: undefined
    };
  },
  computed: {
    content() {
      return this.error !== undefined
        ? this.error
        : this.$store.getters.getPaste.content;
    }
  },
  methods: {
    getElementByQuery() {
      const line = this.getQueryLineNumber();
      if (!line) {
        return;
      }
      setTimeout(() => {
        const elements = document.querySelectorAll(`[data-line-number="${line}"]`);
        this.highlightLine(elements[1]);
      }, 500);
    },
    getQueryLineNumber() {
      let line = this.$route.hash; // eg #L35
      line = line.substr(1); // Remove #
      if (line.length < 1 || line[0].toLowerCase() !== "l") {
        return undefined;
      }
      line = line.substr(1); // Remove L
      return line;
    },
    setHash(lineNumber) {
      if (!lineNumber) {
        history.replaceState(undefined, undefined, " ");
        return;
      }
      history.replaceState(undefined, undefined, "#L" + lineNumber);
    },
    highlightLine(target) {
      const lineNumber = target.dataset.lineNumber;
      target = target.parentElement.parentElement;
      target.classList.add("select-line");
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (this.selectedLine !== undefined) {
        this.selectedLine.classList.remove("select-line");
      }

      if (this.selectedLine === target) {
        this.selectedLine = undefined;
        this.setHash(undefined);
        return;
      }
      this.setHash(lineNumber);
      this.selectedLine = target;
    },
    setupClickHandler() {
      document.addEventListener("click", e => {
        e = e || window.event;
        const target = e.target || e.srcElement;

        if (!target.classList.contains("hljs-ln-n")) {
          return;
        }
        this.highlightLine(target);
      }, false);
    }
  },
  async mounted() {
    try {
      const response = await this.$http.get(this.$route.params.id);
      this.$store.commit("setPaste", response.data);
      document.title = response.data.title + " - Pastr";

      if (this.$route.params.lang)
        this.$store.commit("setLang", this.$route.params.lang);

      this.setupClickHandler();

      this.$nextTick(() => {
        window.hljs.highlightBlock(this.$refs.highlight);
        window.hljs.lineNumbersBlock(this.$refs.highlight);
        this.getElementByQuery();
        
        if (!this.$store.getters.getLang) {
          setTimeout(() => this.$store.commit("setLang", this.$refs.highlight.classList[1]), 500);
        }
      });
    } catch (ex) {
      this.error = "ERROR: " + ex.message;
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/global.scss";

// Highlight.js overrides
.view pre {
  margin: 0;

  code {
    padding: 0;
    margin: 0;
    background-color: map-get($colors, background);

    table {
      width: 100%;

      tbody tr td.hljs-ln-numbers {
        width: 3%;

        .hljs-ln-n {
          margin-right: 10px;
          border-right: 1px solid map-get($colors, linenumber-border);
          padding: 1px 5px;
          cursor: pointer;
        }
      }
    }
  }
}
.select-line td.hljs-ln-line {
  background-color: rgba(255, 224, 0, 0.22);

  div {
    background-color: red;
  }
}
</style>

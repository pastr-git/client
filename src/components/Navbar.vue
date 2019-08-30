<template>
  <div class="navbar">
    <span><h2 class="title xs">{{title}}</h2><div v-show="showOthers"> // {{pasteId}} // {{date}} // {{lang}} // <a :href="apiUrl + pasteId + '/raw/'">Raw</a> // <span class="link" @click="editPaste">Edit</span> // <span class="link" @click="newPaste">Create New</span></div></span>
    <Divider/>
  </div>
</template>

<script>
import Divider from './Divider';
import { apiUrl } from '@/env.js'; 

export default {
  name: 'navbar',
  data() {
    return {
      apiUrl: apiUrl
    }
  },
  components: {
    Divider
  },
  methods: {
    editPaste() {
      this.$store.commit('setCachedPaste', this.$store.getters.getPaste);
      this.$router.push('/');
    },
    newPaste() {
      this.$store.commit('setCachedPaste', {});
      this.$router.push('/');
    }
  },
  props: {
    title: {
      default: undefined,
      type: String
    },
    date: {
      default: undefined,
      type: String
    },
    lang: {
      default: 'auto',
      type: String
    },
    pasteId: {
      default: undefined,
      type: String
    },
    showOthers: {
      default: true,
      type: Boolean
    }
  }
}
</script>

<style lang="scss">
@import "@/scss/global.scss";

.title {
  margin-left: 10px;
  font-family: map-get($fonts, title);
  font-size: 5em;
  font-weight: 300;
  color: white;
  &.small {
    font-size: 3.5em;
  }
  &.sub {
    font-size: 2.5em;
  }
  &.xs {
    margin: 0 0 0 10px;
    font-size: 1.5em;
  }
}
.navbar {
  background: map-get($colors, navbar);
  padding: 5px 0 0;
  margin-bottom: map-get($margins, navbar-bottom);
  span > * {
    display: inline;
  }
}
</style>

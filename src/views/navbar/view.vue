<template>
  <Navbar
    :title="$store.getters.getPaste.title"
    :date="formatDate($store.getters.getPaste.date)"
    :lang="$store.getters.getLang"
    :pasteId="$store.getters.getPaste.id"
    v-show="$store.getters.getPaste.id"
  />
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  name: 'navbar-view',
  components: {
    Navbar
  },
  methods: {
    // moment.js is a pretty big library, so that's a big nono from me.
    appendLeadingZeroes(n) {
      if(n <= 9){
        return '0' + n;
      }
      return n
    },
    formatDate(date) {
      date = new Date(date);
      // YYYY-MM-DD
      return date.getFullYear() + '-' 
      + this.appendLeadingZeroes(date.getMonth() + 1) + '-'
      + this.appendLeadingZeroes(date.getDate()) + '-'

      // HH:MM:SS
      + this.appendLeadingZeroes(date.getHours()) + ':'
      + this.appendLeadingZeroes(date.getMinutes()) + ':'
      + this.appendLeadingZeroes(date.getSeconds())
      + ' UTC'
    },
  }
}
</script>

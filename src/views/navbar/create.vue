<template>
  <Navbar
    title="Create new"
    :showOthers="false"
  />
</template>

<script>
import Navbar from '@/components/Navbar';

export default {
  name: 'navbar-create',
  components: {
    Navbar
  }
}
</script>

<script setup>
import Menu from './components/Menu.vue'
import TheWelcome from "@/components/demo/TheWelcome.vue";

</script>

<template>
  <div>
    <Menu/>
  </div>
  <div>
    <TheWelcome/>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}


</style>

<template>
  <nav class="navbar">
    <div class="container">
    </div>
  </nav>
</template>

<script type="text/javascript">

import UserAvatar from '@/components/user-avatar.vue'
export default {
  name: 'Nav',
  components: {
    'user-avatar': UserAvatar
  },
  data () {
    return {
      userStatus: false,
      user: {}
    }
  }
}
</script>

<style lang="stylus">

.navbar
  width 100%

</style>

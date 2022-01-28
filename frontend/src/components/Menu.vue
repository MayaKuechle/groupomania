<template>
  <div>
    <div>
      <Notifications />
      <ProfileButton />
    </div>
  </div>
</template>

<script>
import ProfileButton from '../components/ProfileButton'
import Notifications from '../components/Notifications'

export default {
  name: 'Menu',
  components: {
    ProfileButton,
    Notifications
  }
}
</script>
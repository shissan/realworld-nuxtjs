<template>
  <button 
    class="btn btn-sm action-btn ng-binding"
    :class="profile.following ? 'btn-secondary' : 'btn-outline-secondary'"
    :disabled="followLoading"
    @click="follow"
  >
    <i class="ion-plus-round"></i>
    &nbsp;
    {{ profile.following ? 'Unfollow ' : 'Follow '}} {{ profile.username }}
  </button>
</template>

<script>
import { addProfilesFollow, deleteProfilesFollow } from '@/api/user'

export default {
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      followLoading: false
    }
  },
  methods: {
    async follow () {
      this.followLoading = true
      const loadFollow = this.profile.following ? deleteProfilesFollow : addProfilesFollow
      await loadFollow(this.profile.username)
      this.profile.following = !this.profile.following
      this.followLoading = false
    }
  }
}
</script>

<style>

</style>
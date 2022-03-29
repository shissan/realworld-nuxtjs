<template>
  <button class="btn btn-outline-primary btn-sm" 
    :class="{ active: article.favorited, 'pull-xs-right': !type }"
    @click="onFavorite(article)"
    :disabled="loading">
    <i class="ion-heart"></i>
    <template v-if="type === 1">
      &nbsp; Favorite Post
      <span class="counter">({{ article.favoritesCount }})</span>
    </template>
    <template v-else>
      {{ article.favoritesCount }}
    </template>
  </button>
</template>

<script>
import { addFavorite, deleteFavorite } from '@/api/article'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    type: {
      type: Number
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onFavorite (article) {
      this.loading = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
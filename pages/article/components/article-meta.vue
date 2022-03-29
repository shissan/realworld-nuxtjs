<template>
  <div class="article-meta">
    <nuxt-link :to="{ name: 'profile', params: { username: author.username } }">
      <img :src="author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author" :to="{ name: 'profile', params: { username: author.username } }">
        {{ author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <template v-if="user.username === author.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{ name: 'editor', params: { slug: article.slug } }">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>

    <template v-else>
      <follow-btn :profile="author" />
      &nbsp;&nbsp;

      <favorite-btn :article="article" :type="1" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deleteArticles } from '@/api/article'
import FollowBtn from '@/components/follow-btn'
import FavoriteBtn from '@/components/favorite-btn'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    },
    author: {
      type: Object,
      required: true,
      default: () => ({ username: '--' })
    }
  },
  components: {
    FollowBtn,
    FavoriteBtn
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async deleteArticle () {
      await deleteArticles(this.article.slug)
      this.$router.push({ name: 'profile', params: { username: this.user.username }})
    }
  }
}
</script>

<style>

</style>
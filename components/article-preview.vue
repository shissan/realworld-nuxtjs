<template>
  <div>
    <div class="article-preview" v-for="article in articles" :key="article.slug">
      <div class="article-meta">
        <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }">
          <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
          <nuxt-link :to="{ name: 'profile', params: { username: article.author.username } }" class="author">
            {{ article.author.username }}
          </nuxt-link>
          <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>

        <favorite-btn :article="article" />
      </div>
      <nuxt-link class="preview-link" :to="{ name: 'article', params: { slug: article.slug } }">
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
      </nuxt-link>
    </div>

    <div class="article-preview" v-if="!loading && articles.length === 0">
      No articles are here... yet.
    </div>
    <div class="article-preview" v-if="loading && articles.length === 0">
      Loading articles...
    </div>
  </div>
</template>

<script>
import FavoriteBtn from '@/components/favorite-btn'

export default {
  name: 'ArticlePreview',
  props: {
    articles: {
      type: Array,
      required: true
    },
    author: {
      type: Object,
      required: true,
      default: () => ({ username: '--' })
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  components: {
    FavoriteBtn
  }
}
</script>

<style>

</style>
<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        
        <article-meta :article="article" :author="article.author" />
      </div>
    </div>

    <!-- 文章内容 -->
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />
      <div class="article-actions">
        <article-meta :article="article" :author="article.author" />
      </div>

      <!-- 评论 -->
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'

export default {
  name: "ArticleIndex",
  components: {
    ArticleMeta,
    ArticleComments
  },
  data () {
    return {
      article: {}
    }
  },
  methods: {
    async reqArticle () {
      const params = this.$route.params
      const { data } = await getArticle(params.slug)
      const { article } = data
      const md = new MarkdownIt()
      article.body = md.render(article.body)
      this.article = article
    }
  },
  created () {
    this.reqArticle()
  },
  // 设置页面meta优化seo
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description }
      ]
    }
  }
};
</script>

<style>
</style>
<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <!-- tab -->
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  class="nav-link" 
                  :class="{ active: tab === 'your_feed' }"
                  exact
                  :to="{ name: 'home', query: { tab: 'your_feed'} }"
                  >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{ active: tab === 'global_feed' }"
                  exact
                  :to="{ name: 'home', query: { tab: 'global_feed'} }"
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item" v-show="tab === 'tag'">
                <nuxt-link 
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  exact
                  :to="{ name: 'home', query: { tab: 'tag', tag: tag } }"
                ># {{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 列表 -->
          <article-preview :articles="articles" :author="articles.author" :loading="loading" />

          <!-- 分页 -->
          <nav v-if="!loading">
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link 
                  class="page-link" 
                  :to="{ name: 'home', query: { page: item, tab: $route.query.tab, tag: $route.query.tag } }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link 
                class="tag-pill tag-default" 
                v-for="item in tags" 
                :key="item"
                :to="{ name: 'home', query: { tab: 'tag', tag: item } }"
              >{{ item }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getTags, getYourFeedArticles } from '@/api/article'
import { mapState } from 'vuex'
import ArticlePreview from '@/components/article-preview'

export default {
  name: "HomeIndex",
  // async asyncData ({ query }) {
  //   const page = +query.page || 1
  //   const limit = 2
  //   const tag = query.tag
  //   const tab = query.tab || 'global_feed'
  //   let loading = true

  //   const [ articleRes, tagRes ] = await Promise.all([
  //     getArticles({
  //       limit,
  //       offset: (page - 1) * limit,
  //       tag
  //     }),
  //     getTags()
  //   ])

  //   const { articles, articlesCount } = articleRes.data
  //   const { tags } = tagRes.data
  //   loading = false
    
  //   return {
  //     articles,
  //     articlesCount,
  //     limit,
  //     page,
  //     tags,
  //     tab,
  //     tag,
  //     loading
  //   }
  // },
  components: {
    ArticlePreview
  },
  data () {
    return {
      articles: [],
      articlesCount: 0,
      limit: 2,
      page: 1,
      tags: [],
      tag: '',
      tab: '',
      loading: true
    }
  },
  // watchQuery: ['page', 'tag'],
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  watch: {
    '$route.query.page' (curVal, oldVal) {
      this.articles = []
      curVal && this.reqArticle()
    },
    '$route.query.tag' (curVal, oldVal) {
      curVal && this.reqArticle()
    },
    '$route.query.tab' (curVal, oldVal) {
      this.articles = []
      curVal && this.reqArticle()
    }
  },
  methods: {
    async reqArticle () {
      const query = this.$route.query
      this.page = +query.page || 1
      this.tab = query.tab || 'global_feed'
      this.tag = query.tag
      this.loading = true

      const loadArticles = this.tab === 'global_feed' ? getArticles : getYourFeedArticles

      const { data } = await loadArticles({
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        tag: this.tag
      })

      // data.articles.forEach(article => article.favoriteDisabled = false)
      
      this.articles = data.articles
      this.articlesCount = data.articlesCount
      this.loading = false
    },
    async reqTags () {
      const { data } = await getTags()
      this.tags = data.tags
    }
  },
  created () {
    this.reqTags()
    this.reqArticle()
  }
};
</script>

<style>
</style>
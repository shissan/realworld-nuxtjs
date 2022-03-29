<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>

            <nuxt-link v-if="user.username === profile.username" to="/settings" class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>

            <follow-btn v-else :profile="profile" />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <!-- tab -->
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{ active: tab === 'my_articles' }"
                  exact
                  :to="{ name: 'profile', query: { tab: 'my_articles'} }"
                  >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link" 
                  :class="{ active: tab === 'fa_articles' }"
                  exact
                  :to="{ name: 'profile', query: { tab: 'fa_articles'} }"
                  >Favorited Articles</nuxt-link>
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
                  :to="{ name: 'profile', query: { page: item, tab: $route.query.tab } }"
                >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfiles } from '@/api/user'
import { getArticles } from '@/api/article'
import ArticlePreview from '@/components/article-preview'
import FollowBtn from '@/components/follow-btn'
import { mapState } from 'vuex'

export default {
  middleware: 'authenticated',
  name: "UserProfile",
  components: {
    ArticlePreview,
    FollowBtn
  },
  data () {
    return {
      profile: {},
      limit: 2,
      page: 1,
      tab: '',
      articles: [],
      articlesCount: 0,
      loading: true
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watch: {
    '$route.query.tab' (curVal, oldVal) {
      this.articles = []
      curVal && this.reqArticle()
    },
    '$route.query.page' (curVal, oldVal) {
      this.articles = []
      curVal && this.reqArticle()
    },
    '$route.params.username' (curVal, oldVal) {
      this.articles = []
      if (curVal) {
        this.reqProfiles()
        this.reqArticle()
      }
    }
  },
  methods: {
    async reqProfiles () {
      const params = this.$route.params
      const { data } = await getProfiles(params.username)
      this.profile = data.profile
    },
    async reqArticle () {
      const query = this.$route.query
      const params = this.$route.params
      this.page = +query.page || 1
      this.tab = query.tab || 'my_articles'
      this.loading = true

      const { data } = await getArticles({
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        author: this.tab === 'my_articles' ? params.username : undefined,
        favorited: this.tab === 'my_articles' ? undefined : params.username
      })

      // data.articles.forEach(article => article.favoriteDisabled = false)
      
      this.articles = data.articles
      this.articlesCount = data.articlesCount
      this.loading = false
    }
  },
  created () {
    this.reqProfiles()
    this.reqArticle()
  }
};
</script>

<style>
</style>
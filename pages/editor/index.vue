<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">{{ field }} {{ message }}</li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tagVal"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keyup="$event.keyCode == 13 && addTag()"
                />
                <div class="tag-list">
                  <span v-for="(tag, index) in article.tagList" :key="tag" class="tag-default tag-pill ng-binding ng-scope">
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticles, updateArticles, getArticle } from '@/api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: "EditorIndex",
  data () {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      errors: {},
      tagVal: '',
      articleDetails: null
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.articleDetails 
          ? await updateArticles(this.articleDetails.slug, { article: this.article }) 
          : await addArticles({ article: this.article })
        this.$router.push({ name: 'article', params: { slug: data.article.slug } })
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
    addTag () {
      if (!this.article.tagList.includes(this.tagVal)) {
        this.article.tagList.push(this.tagVal)
        this.tagVal = ''
      }
    },
    async removeTag (index) {
      this.article.tagList.splice(index, 1)
    },
    async reqArticle (slug) {
      const { data } = await getArticle(slug)
      this.articleDetails = data.article
      this.article.title = this.articleDetails.title
      this.article.description = this.articleDetails.description
      this.article.body = this.articleDetails.body
      this.article.tagList = this.articleDetails.tagList
    }
  },
  created () {
    const params = this.$route.params
    params.slug && this.reqArticle(params.slug)
  }
};
</script>

<style>
</style>
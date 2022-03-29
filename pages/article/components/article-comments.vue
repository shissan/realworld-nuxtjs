<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment.body"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="user.image"
          class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary" @click.prevent="submitComment">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{ name: 'profile', params: { username: comment.author.username } }">
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{ name: 'profile', params: { username: comment.author.username } }">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>

        <span class="mod-options" v-if="comment.author.username === user.username">
          <i class="ion-trash-a" @click="deleteCb(index, comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComments } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      comment: {
        body: ''
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    article (curVal, oldVal) {
      curVal && this.reqComments()
    }
  },
  methods: {
    async reqComments () {
      if (!this.article.slug) {
        return
      }
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async submitComment () {
      try {
        const { data } = await addComments(this.article.slug, { comment: this.comment })
        this.comment.body = ''
        this.comments.unshift(data.comment)
      } catch (err) {

      }
    },
    async deleteCb (index, id) {
      await deleteComments(this.article.slug, id)
      this.comments.splice(index, 1)
    }
  },
  mounted () {
    this.reqComments()
  }
}
</script>

<style>

</style>
<template>
  <div>
    <NavBar/>
    <b-col>
      <b-row>
        <b-col></b-col>
        <b-col cols="9">
          <b-row class="mt-20">
            <b-col cols="8">
              <h2>{{title}}</h2>
              <p><small class="text-muted">Posted on: {{createdDate}}</small></p>
              <p class="mt-20">{{content}}</p>
            </b-col>
            <b-col cols="4">
              <comment v-if="ready" class="mt-50" :blog="blog" />
            </b-col>
          </b-row>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-col>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Comment from '~/components/Comment.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    Comment
  },
  data() {
    return {
      ready: false,
      blog: 0,
      title: '',
      content: '',
      createdDate: ''
    }
  },
  mounted() {
    this.getBlogPost()
  },
  methods: {
    async getBlogPost() {
      const blog = await this.$api.blog.get()
      this.blog = blog[0].id
      this.title = blog[0].title || ''
      this.content = blog[0].content || ''
      this.createdDate = this.formatDate(blog[0].created_at) || ''
      this.ready = true
    },
    formatDate(date: string) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
      return new Date(date).toLocaleDateString('en', options)
    },
  }
})
</script>

<template>
  <div>
    <b-row>
      <b-col>
        <b-card id="comment-container">
          <h6>Comments <small class="text-muted">({{responses.length}})</small></h6>
          <b-alert v-show="responses.length <= 0" variant="light">Light Alert</b-alert>
          <b-col v-if="responses.length > 0">
              <!-- level 1 -->
            <p v-for="response1 in level1responses" :key="response1.id">
              <strong>{{response1.name}}</strong> 
              <small class="reply-button">
                <b-link @click="toggleCommentBox(2, response1.id, response1.name)">Reply</b-link>
              </small><br/>
              {{response1.comment}}
              <!-- level 2 -->
              <b-col v-if="level2responses.length > 0">
                <b-col class="npr" v-for="response2 in level2responses" :key="response2.id">
                  <p v-if="response2.parent === response1.id">
                    <strong>{{response2.name}}</strong>
                    <small class="reply-button">
                      <b-link @click="toggleCommentBox(3, response2.id, response2.name)">Reply</b-link>
                    </small><br/>
                    {{response2.comment}}
                    <!-- level 3 -->
                    <b-col v-if="level3responses.length > 0">
                      <b-col class="npr" v-for="response3 in level3responses" :key="response3.id">
                        <p v-if="response3.parent === response2.id">
                          <strong>{{response3.name}}</strong><br/>
                          {{response3.comment}}
                        </p>
                      </b-col>
                    </b-col>
                  </p>
                </b-col>
              </b-col>
            </p>
          </b-col>
        </b-card>
        <b-button squared right class="mt-10" v-show="!showComment" @click="toggleCommentBox(1, 0)">Post a comment</b-button>
      </b-col>
    </b-row>

    <b-form class="mt-10" v-show="showComment" @reset="cancel">
      <p v-if="replyingTo" class="reply-to-text">You are replying to <strong>{{replyingTo}}</strong>'s comment</p>
      <b-row>
        <b-col cols="9">
            <b-form-input
                id="name"
                v-model="name"
                placeholder="Comment as"
                required
            ></b-form-input>
            <b-form-textarea
                id="reply"
                v-model="reply"
                placeholder="Start typing here..."
                rows="3"
                max-rows="6"
                required
            ></b-form-textarea>
        </b-col>
        <b-col>
            <b-button block type="button" variant="outline-primary" @click="save">Submit</b-button>
            <b-button block type="reset" variant="outline-danger">Cancel</b-button>
        </b-col>
        </b-row>
    </b-form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CommentComponent',
  data() {
    return {
      currentBlog: null,
      responses: [],
      level1responses: [],
      level2responses: [],
      level3responses: [],
      parent: 0,
      name: '',
      reply: '',
      level: 1,
      showComment: false,
      replyingTo: ''
    }
  },
  props: {
    blog: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.getComments()
  },
  methods: {
    async getComments() {
      const response = await this.$api.comment.get(this.blog)
      if (Object.keys(response).length) {
        this.responses = response
        // reset all
        this.level1responses = []
        this.level2responses = []
        this.level3responses = []
        const _self = this
        this.responses.map(function(item){
            switch (item.level) {
                case 1:
                    _self.level1responses.push(item)
                    break;
                case 2:
                    _self.level2responses.push(item)
                    break;
                case 3:
                    _self.level3responses.push(item)
                    break;
                default:
                    break;
            }
        })
      }
    },
    async save() {
      if (!this.reply && !this.name) return
      const payload = {
        blog: this.blog,
        parent: this.parent,
        level: this.level,
        name: this.name,
        comment: this.reply
      }
      const response = await this.$api.comment.save(payload)
      this.getComments()
      this.cancel()
    },
    cancel() {
      this.parent = 0
      this.level = 1
      this.name = ''
      this.reply = ''
      this.showComment = false
      this.replyingTo = ''
    },
    toggleCommentBox(level: number, parent: number, replyingTo: string) {
      this.replyingTo = replyingTo
      this.level = level,
      this.parent = parent
      this.showComment = true
    }
  }
})
</script>

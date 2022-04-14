import createBlogPost from '~/api/blog'
import createComment from '~/api/comment'

export default ({ $axios }, inject) => {
  inject('api', {
    blog: createBlogPost($axios),
    comment: createComment($axios)
  })
}

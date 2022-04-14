export default $axios => ({
    get(blogID) {
        return $axios.$get(`/api/comment/${blogID}`)
    },

    save(payload) {
        return $axios.$post(`/api/comment/`, payload)
    }
})

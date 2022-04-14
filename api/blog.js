export default $axios => ({
    get() {
        return $axios.$get(`/api/blog/`)
    }
})

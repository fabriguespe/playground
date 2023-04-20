export default {
  ssr:false,
  head: {
    title: 'Depost',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {rel: 'stylesheet', type: 'text/css', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'}
    ]
  },
  css:[
    '~/assets/main.css'
  ],
  router: {
    base: ''
  },
  build: {
    extend (config, { isDev, isClient }) {
       config.node = {
            fs: 'empty'
        }
 
       // ....
    }
  },
  components: true
}
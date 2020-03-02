import Main from '../components/Main'

export default [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: Main,
    children: [
      {
        path: '',
        name: 'Index',
        // eslint-disable-next-line
        component: () => import('./../views/Home')
      },
      {
        path: '/Content',
        name: 'Content',
        // eslint-disable-next-line
        component: () => import('./../views/Home')
      }
    ]
  }
]

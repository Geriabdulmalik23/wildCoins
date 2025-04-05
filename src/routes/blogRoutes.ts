import { Hono } from 'hono'
import { getPosts, createPost, getPostById, deletePostById, updatePost } from '../controllers/postController'

const blogRoutes = new Hono()

blogRoutes.get('/:id', (c) => getPostById(c))
blogRoutes.delete('/:id', (c) => deletePostById(c))
blogRoutes.get('/', (c) => getPosts(c))
blogRoutes.post('/', (c) => createPost(c))
blogRoutes.patch('/:id', (c) => updatePost(c))

export default blogRoutes
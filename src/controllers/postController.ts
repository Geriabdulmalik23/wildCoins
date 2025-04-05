
//Import Context
import { Context } from 'hono';

//Import Prism Client
import prisma from '../../prisma/client';

/** 
 * 
 * Getting All Posts
 * 
*/
export const getPosts = async (c : Context) => {
    
    try{
        
        //Get all posts
        const post = await prisma.post.findMany({ orderBy: {id: 'desc' }});

        return c.json({
            success : true,
            message : 'List Data Posts',
            data    : post
        },200);

    }catch(e : unknown){
        console.error(`Error getting posts: ${e}`);
    }
}

//Insert Post blog
export const createPost = async (c : Context) => {
    try{

        //get body request
        const body = await c.req.parseBody();

        //Check if title and content is string
        const title     = typeof body['title'] === 'string' ? body['title'] : ''
        const content   = typeof body['content'] === 'string' ? body['content'] : ''

        //create post
        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                slug : title.replaceAll(' ','-').toLocaleLowerCase()
              }
        })

        //return JSON
        return c.json({
            success: true,
            message: 'Post Created Successfully!',
            data: post
        }, 201);

    }catch(e : unknown){
        console.error(`Error creating post ${e}`);
    }
}

/**
 * Getting a post by ID
 */
export const getPostById = async (c : Context) => {
    try{
    
        //convert type_id to a number
        const postId = parseInt(c.req.param('id'));

        //get post by id
        const post = await prisma.post.findUnique({
            where: {
                id : postId
            }
        })

        //Check if id is available
        if(!post){
            return c.json({
                success: false,
                message: 'Data post is unvailable',
                data: post
            }, 404);
        }

        return c.json({
            success: true,
            message: 'Data is Successfully!',
            data: post
        }, 200);

    }catch(e : unknown){
        console.error(`Error getting post ${e}`)
    }   
}

export const deletePostById = async (c : Context) => {
    try{
        
        const postId = parseInt(c.req.param('id'))

        //get post by id
        const checkIfIdHasDeleted = await prisma.post.findUnique({
            where: {
                    id : postId
                }
            })
        if(checkIfIdHasDeleted == null){
            return c.json({
                success: false,
                message: 'Post is already deleted',
            }, 200);
        }
        await prisma.post.delete({
            where:{
                id : postId
            }
        })

        return c.json({
            success: true,
            message: 'Delete data is success!',
        }, 200);


    }catch(e : unknown){
        console.error(`Error getting post ${e}`);
    }
}

/**
 * Updating a post
 */
export async function updatePost(c: Context) {
    try {

        // Konversi tipe id menjadi number
        const postId = parseInt(c.req.param('id'));

        //get body request
        const body = await c.req.parseBody();

        //check if title and content is string
        const title = typeof body['title'] === 'string' ? body['title'] : '';
        const content = typeof body['content'] === 'string' ? body['content'] : '';

        //update post with prisma
        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                title: title,
                content: content,
                updatedAt: new Date(),
            },
        });

        //return JSON
        return c.json({
            success: true,
            message: 'Post Updated Successfully!',
            data: post
        }, 200);

    } catch (e: unknown) {
        console.error(`Error updating post: ${e}`);
    }
}

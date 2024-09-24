import conf from '../conf/conf'
import { Client,ID,Databases,Storage,Query } from 'appwrite'
function sanitizeSlug(slug) {
    return slug
        .toLowerCase()
        .replace(/[^a-z0-9\-_\.]/g, '-')  // Replace invalid characters with hyphen
        .substring(0, 36);  // Limit to 36 characters
}
export class Service{
    client= new Client ();
    databases;
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    
    async createPost({title,slug,content,feturedImage,status,userId}){
        try {
            let sanitizedSlug = slug && slug.trim() !== '-' ? sanitizeSlug(slug) : sanitizeSlug(title);

            // If sanitizedSlug is still empty after sanitation, generate a random ID
            if (!sanitizedSlug) {
                sanitizedSlug = ID.unique();
            }
    
            console.log("Original Slug: ", slug);
            console.log("Sanitized Slug: ", sanitizedSlug);
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                sanitizedSlug,
                {
                    title,
                    content,
                    feturedImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error",error);
            
        }
    }
    async updatePost(slug,{title,content,feturedImage,status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    feturedImage,
                    status
                }
            )
        } catch (error) {
            console.log("Apprite service :: updatePost :: error", error);
            
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: getPost :: error",error);
            return false;
        }
    }
    async getPosts(queries= [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
                
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    //File upload service
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error ",error);
            return false;
        }
    }

    getFilePreview(fileId) {
        if (!fileId || typeof fileId !== 'string') {
            console.error("Invalid fileId provided:", fileId);
            throw new Error("Invalid fileId");
        }
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId,
        );
    }
}

const service= new Service()
export default service;
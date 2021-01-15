const express = require('express');

const blogRouter = express.Router();
const blogController = require('../controller/blogsController');

// blogRouter.route('/getAllBlogs')
//     .get(blogController.getAllBlogs);

blogRouter.route('/tag/:tag')
    .get(blogController.getBlogByTag);

blogRouter.route('/crawlBlogs')
    .post(blogController.crawlBlogs);



module.exports = blogRouter;

const pool = require('../db');
const cheerio = require('cheerio');
const request = require('request');



var blogsTitle = [];
var blogsCreator = [];
var blogsDetails = [];
var blog;
var blogs = [];
const tagService = tag => 
    new Promise((resolve, rejext) => {
        function tagProvider(tag) {
           
            request(`https://medium.com/tag/${tag}`, (err, response, html) => {
                if (!err && response.statusCode == 200) {
                    const $ = cheerio.load(html);

                    var blogContent = $('.postArticle');
                    $(blogContent).each((i, content) => {
                    //blog title
                    const title = $(content).find('h3').text();
                    blogsTitle.push(title);

                    //blog creator
                    const blogCreator = $(content).find('.ds-link').text();
                    blogsCreator.push(blogCreator);

                    //blog datetime
                    const details = $(content).find('a').find('time').text();
                    console.log(details);
                    //blog reading time
                    const readingTime = $(content).find('.readingTime').attr('title');
                    const fullDetails = details + ', ' + readingTime;
                    blogsDetails.push(details + ', ' + readingTime);

                    //blog Tags
                    const blogUrl = $(content)
                        .find('.postArticle-readMore')
                        .find('a')
                        .attr('href');
                    // console.log(blogUrl);
                    blog = {
                        title: title,
                        author: blogCreator,
                        details: fullDetails,
                        url: blogUrl,
                    };
                    blogs.push(blog);
                    resolve(blog);
                    });
                }
            });
        }
        tagProvider(tag);
});





const service = url =>

  new Promise((resolve, reject) => {
    function s(url) {
        var blogTitle = [];
        var blogtags = [];
        var blogPara = [];
        var singleBlog;
      var blogUrl = url;
      const service = request(`${blogUrl}`, async (err, response, html) => {
        if (!err && response.statusCode == 200) {
          var title;
          var tags;
          var paragrapghs;

          const $ = cheerio.load(html);

          var content = $('.aj');
          // console.log(content.text());
          $(content)
            .find('h1')
            .each((i, titles) => {
              title = $(titles).text();
              blogTitle.push(title);
            });
          for (var i = 1; i < blogTitle.length; i++) {
             blogTitle.pop();
          }
          $(content)
            .find('p')
            .each((i, paragrapgh) => {
              paragrapghs = $(paragrapgh).text();
              blogPara.push(paragrapghs);
            });
          $('li').each((i, tag) => {
            tags = $(tag).find('a').text();
            if (tags !== '') blogtags.push(tags);
          });
          // console.log(tags);
          singleBlog = {
            title: blogTitle[0],
            paragraph: blogPara,
            tags: blogtags,
          };

          resolve(singleBlog);
        }
      });
    }
    s(url);
  });

exports.crawlBlogs = async (req, res, next) => {
  const { blogUrl } = req.body;
  service(blogUrl).then(crawlBlog => {
    // console.log(crawlBlog);
    try {
      res.status(201).json({
        status: 'succeess',
        data: crawlBlog,
      });
      
      console.log("sliving data");
      console.log(crawlBlog);
    } catch (err) {
      res.status(400).json({
        message: 'failed',
        error: err,
      });
      console.log(err);
    }
  });
  // await sleep(2000);
};


exports.getBlogByTag = async (req, res, next) => {
  try {
    const tag = req.params.tag;
    tagService(tag).then(async tagData => {
        // console.log(tagData);
        for (var i = 0; i < blogs.length; i++) {
            var blogData = await pool.query(
              'INSERT INTO mediumBlogs (title,creator,details,blogUrl,tag) VALUES($1,$2, $3, $4, $5) ON CONFLICT (title) DO NOTHING',
              [
                blogs[i]['title'],
                blogs[i]['author'],
                blogs[i]['details'],
                blogs[i]['url'],
                tag,
              ] 
              
            );
          }
          await pool.query(
            'SELECT * FROM mediumBlogs WHERE tag =$1',
            [tag],
            (err, result) => {
              if (err) {
                throw err;
              }
              res.status(200).json({
                status: 'success',
                data: result.rows,
              });
            }
          );
    });
    
    
  } catch (err) {
    res.status(400).json({
      message: 'failed',
      error: err,
    });
    console.log(err);
  }
};

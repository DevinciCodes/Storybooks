const express = require('express');
const router = express.Router();
// const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Story = require('../models/story')


module.exports = (app) => {

//Show ad page
app.get('/stories/add',   (req,res) =>{
    res.render('stories/add')
})
  


//Process ad form
app.post('/stories',   async (req,res) =>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    };
});
//Show all stories
app.get('/stories',  async (req,res) =>{
    try {
        const stories = await Story.find ({ status: 'public'})
            .populate('user')
            .sort({ createdAt: 'desc'})
            .lean();

        res.render('stories/index',{stories})
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
});

//Show single story
app.get('/stories/:id',  async (req,res) =>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story){
            return res.render('error/404')
        }

        res.render('stories/show', {story})
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})
  


//Show edit page
app.get('/stories/edit/:id',  async (req,res) =>{
try {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit', story)
    }
    
} catch (err) {
        console.error(err)
        return res.render('error/500')  
}

    
    
});

//Update Story
app.put('/stories/:id',  async (req,res) =>{

    try {
        let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })
        res.redirect('/dashboard')
    }
    } catch (err) {
        console.error(err)
        return res.render('error/500')  
    }
    

})

//Delete Story
app.delete('/stories/:id',   async (req,res) =>{
    try {
        await Story.remove({ _id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//User stories
app.get('/stories/user/:userId',   async (req,res) =>{
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean();

        res.render('stories/index', {stories})
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
  


  
};

// module.exports = router;
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
main().catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
  }
//TODO
const articleSchema=new mongoose.Schema({
    title:String,
    content:String
})

const Article=mongoose.model("Article",articleSchema)
async function getarticles(){
    const Articledocs=await Article.find({})
    return Articledocs
}
async function getspecificarticle(query){
    const Articledocs=await Article.findOne({title:query})
    return Articledocs
}
// route for all articles documents
app.route("/articles")
.get(function(req,res){
    getarticles().then(function(founditems){
        res.send(founditems)
    })
})
.post(function(req,res){
    const titlename=req.body.title
    const contentdisciption=req.body.content
    const Articledocument=new Article({title:titlename,content:contentdisciption})
    Articledocument.save(function(err){
        if(err){
            res.send(err)
        }else{
            res.send("something happened")
        }
    });
})
.delete(function(req,res){
    Article.deleteMany().then(function(err){
     if(err){
         res.send("Deleted")
     }else{
         res.send("something happened")
     }
 })
 });

// route for all articles documents
app.route("/articles/:document").get(function(req,res){
    const articlequery=req.params.document
    getspecificarticle(articlequery).then(function(founditems){
        res.send(founditems)
    })
})
.post(function(req,res){
    Article.replaceOne({title:req.params.document},{title:req.body.title}).then(function(done){
        res.send(done)
    })
})
.patch(function(req,res){
    Article.updateOne({title:req.params.document},{$set:req.body}).then(function(done){
        res.send(done)
    })
})   
.delete(function(req,res){
    Article.findOneAndDelete({title:req.params.document}).then(function(done){
        res.send(done)
    })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
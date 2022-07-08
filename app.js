const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const _=require('lodash');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname));
mongoose.connect("mongodb://localhost:27017/Todolist");
const itemschema={
    name:String
}
const Item=mongoose.model("Item",itemschema);
const item=new Item({
    name:"Welcome"
});
const item1=new Item({
    name:"Add a new item by clicking +"
});
const item2=new Item({
    name:"Delete an item by checkbox"
});
const defaultitem=[item,item1,item2];
const listschema={
    name:String,
    items:[itemschema]
};
const List=mongoose.model("List",listschema);
app.get('/',function(req, res){
    Item.find({},function(err,element){
        if(element.length===0){
            Item.insertMany(defaultitem,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("success");
                }
                res.redirect('/');
            });
        }else{
            res.render('list',{day:"Today",newitem:element});
        }
            
        })
   

} )
app.get("/:topic",function(req,res){
    var topic= _.capitalize(req.params.topic);
    List.findOne({name:topic},function(err,found){
        if(!err){
            if(!found){
                const list=new List({
                    name:topic,
                    items:defaultitem
                })
                list.save();
                res.redirect("/"+topic);
            }else{
                res.render('list',{day:topic,newitem:found.items});
            }
        }
    })
})

app.get('/about',function(req, res){
    res.render("about");
})
app.post("/",function(req, res){
    var a=req.body.item;
    var listname=req.body.list;
        const item4=new Item({
            name:a
        });
    if(listname==="Today"){
            item4.save();
        res.redirect("/");
    }else{
        List.findOne({name:listname},function(err,foundlist){
            foundlist.items.push(item4);
            foundlist.save();
            res.redirect("/"+listname);
        })
    }
    
})
app.post("/delete",function(req,res){
    const checkedid=req.body.checkbox;
    const listnames=req.body.listitems;
    if(listnames==="Today"){
        Item.deleteOne({_id:checkedid},function(err){
            if(err){
                console.log(err);
            }else{
                console.log("success delete");
            }
        })
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listnames},{$pull:{items:{_id:checkedid}}},function(err,foundlist){
            if(!err){
                res.redirect("/"+ listnames);
            }else{
                console.log(err);
            }
        });
    }
    
})

app.listen(3000,function(){
    console.log("started");
})
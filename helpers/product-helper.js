let db=require('../config/connection')
let collection=require('../config/collections')
let objectid = require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
    
    db.get().collection('product').insertOne(product).then((data)=>{
    console.log(data)
    callback(data.insertedId)
})
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectid(prodId)}).then((response)=>{
            resolve(response)
            })
        })
    }
}
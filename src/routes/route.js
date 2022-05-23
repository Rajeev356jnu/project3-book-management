const express = require('express');
const router = express.Router();
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const reviewController=require('../controller/reviewController')
const mid = require("../middleware/allMiddleware")
const aws = require("aws-sdk")




//aws.........................................................
aws.config.update(
    {
        accessKeyId: "AKIAY3L35MCRVFM24Q7U",
        secretAccessKey: "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",
        region: "ap-south-1"
    }
)

let uploadFile = async (file) => {
    return new Promise( function(resolve, reject) {
       
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }) 
        
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", 
            Key: "Rajeev/" + file.originalname, 
            Body: file.buffer
        }

      s3.upload(uploadParams, function (err, data) {
            if (err) { 
                return reject({ "error": err }) 
            }

            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location)
          }
        )

   
    }
    )
}

router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}
)



router.post('/register',userController.createUser);

router.post('/login',userController.loginUser);

router.post('/books',bookController.bookCreation);

router.get("/books",mid.authentication, bookController.getBooks)

router.get("/books/:bookId",mid.authentication, bookController.getBookById)

router.put('/books/:bookId',mid.authentication,mid.authorization1, bookController.updateBooks)

router.delete('/books/:bookId',mid.authentication,mid.authorization1,bookController.deleteBook)

router.post('/books/:bookId/review',reviewController.bookReview)

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

module.exports = router

let firebase = require('./firebase')



// functional, but need to make base javascript able to use it correctly


exports.handler = async function (event) {
    let db = firebase.firestore()
    let likesData = []

    let likesQuery = await db.collection('liked Cocktails').get()
    // console.log(likesQuery)
    let likes = likesQuery.docs
    // console.log(likes.size)

    for (let i = 0; i < likes.length; i++) {
        // console.log(likes[i])
        let likeId = likes[i].id
        let cocktailId = likes[i].cocktailId
        let cocktailData = likes[i].data()
        console.log(likeId)

        // console.log(likeId.cocktailName)

        let likesQuantity = await db.collection('liked Cocktails').where('likedById', '==', cocktailData.likedById).get()
    // let likesQuantity = await db.collection('liked Cocktails').where('cocktailId', '==', cocktailId).get()
// console.log(likesQuantity)
// console.log(likesQuantity.size)



    likesData.push({
            likedBy: cocktailData.likedById,
            likesNum: likesQuantity.size
        })
}

     console.log(likesData)

    return {
        statusCode: 200,
        body: JSON.stringify(likesData)

    }
}
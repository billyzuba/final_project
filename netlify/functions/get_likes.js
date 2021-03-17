let firebase = require('./firebase')



// still not fullly functional.exports.exports.exports.error with where callout

exports.handler = async function(event) {
let db = firebase.firestore()
let likesData = []

let likesQuery = await db.collection('liked Cocktails').orderBy('cocktailId').get()

let likes = likesQuery.docs

for (let i=0; i<likes.length; i++) {
    let cocktailId = likes[i].cocktailId
    let cocktailData = likes[i].data()

    let likesQuantity = await db.collection('liked Cocktails').where('cocktailId', '==', cocktailId).get()
    
    likesData.push({
        drinkId: cocktailId,
        likesNum: likesQuantity.size
    })
}

return {
    statusCode: 200,
    body: JSON.stringify(likesData)

}
}
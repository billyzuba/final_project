
let firebase = require('./firebase')

exports.handler = async function (event) {

  let cocktailDb = firebase.firestore()
  let post = JSON.parse(event.body)

  // variable naming from dislike button click
  let cocktailName = post.cocktailName
  let cocktailId = post.cocktailId
  let likedByName = post.likedByName
  let likedById = post.likedById
  let likedByEmail = post.likedByEmail

  let dislikedQuery = await cocktailDb.collection('disliked Cocktails').where('cocktailId', '==', cocktailId).get()
  console.log(dislikedQuery.size)


  // check if post was already like and add it to database if not
  if (dislikedQuery.size == 0) {
    await cocktailDb.collection('disliked Cocktails').add({
      cocktailName: cocktailName,
      cocktailId: cocktailId,
      likedByName: likedByName,
      likedById: likedById,
      likedByEmail: likedByEmail
    })
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    }
  } else {
    return {
      statuscode: 403,
      body: JSON.stringify({ success: false, error: 'Cocktail already liked' })
    }
  }
}



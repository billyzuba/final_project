
let firebase = require('./firebase')

exports.handler = async function (event) {

  // let currentuser = firebase.auth().currentuser

  let cocktailDb = firebase.firestore()
  let post = JSON.parse(event.body)

  // variable naming from like button click
  let cocktailName = post.cocktailName
  let cocktailId = post.cocktailId
  let likedByName = post.likedByName
  let likedById = post.likedById
  let likedByEmail = post.likedByEmail

  let buyQuery = await cocktailDb.collection('Cocktails to Buy').where('cocktailId', '==', cocktailId).get()
  console.log(buyQuery.size)


  // check if post was already like and add it to database if not
  if (buyQuery.size == 0) {
    await cocktailDb.collection('Cocktails to Buy').add({
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
  }

    
  }


let firebase = require('./firebase')

exports.handler = async function(event) {
  // let data = [] // sample only...

  let currentuser = firebase.auth().currentuser

let cocktailDb = firebase.firestore()
let post = JSON.parse(event.body)

// variable naming from like button click
  let  cocktailName = post.cocktailName
  let  cocktailId = post.cocktailId
   let likedByName = post.likedByName
   let likedById = post.likedById
   let likedByEmail = post.likedByEmail

let likedQuery = await cocktailDb.collection('liked Cocktails').where('cocktailId', '==', cocktailId).get()
console.log(likedQuery.size)
                

// check if post was already like and add it to database if not
if (likedQuery.size == 0){
  await cocktailDb.collection('liked Cocktails').add({
    cocktailName: cocktail.strDrink,
    cocktailId: cocktail.idDrink,
    likedByName: user.displayName,
    likedById: user.uid,
    likedByEmail: user.email
  })
  return {
    statusCode: 200,
    body: JSON.stringify({success: true})
  }

  else {
    return {
      statuscode: 403,
      body: JSON.stringify({success: false, error: 'Cocktail already liked'})
    }
}


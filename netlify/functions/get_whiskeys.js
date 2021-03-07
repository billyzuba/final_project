// API url to this lambda funtion: /.netlify/functions/get_posts
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                             // define a variable so we can use Firestore
  let whiskeyData = []                                        // an empty Array

  let whiskeyList = await db.collection('whiskeys')             // posts from Firestore
                           .orderBy('created')              // ordered by created
                           .get()
  let whiskeyPosted = whiskeyList.docs                               // the post documents themselves

  // loop through the post documents
  for (let i=0; i<whiskeyPosted.length; i++) {
    let whiskeyId = whiskeyPosted[i].id                                // the ID for whiskey posted
    let postedData = whiskeyPosted[i].data()                          // the rest of the whiskey data
    let likesQuery = await db.collection('whiskeys')           // likes from Firestore
                             .where('whiskeyId', '==', whiskeyId) // for the given postId
                             .get()

    // add a new Object of our own creation to the postsData Array
    whiskeyData.push({
      id: postId,                                           // the post ID
      imageUrl: postedData.imageUrl,                          // the image URL
      username: postedData.username,                          // the username
      likes: likesQuery.size                                // number of likes
    })
  }

  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(postsData)
  }
}
// API url to this lambda funtion: /.netlify/functions/add_whiskey
let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()

  // 🔥🔥🔥 Lab
  // Step 2:  Parse out the post data, i.e. the event.body – pull out
  //          the user ID, username, and image URL that is provided
  //          in the POST request, and assign to variables. Use
  //          console.log if necessary, to ensure the values are what
  //          you're expecting.
  console.log(event.body)
  let whiskeys = JSON.parse(event.body)
  console.log(whiskeys)
  let userId = whiskeys.userId
  let userName = whiskeys.userName
  let whiskeyUrl = whiskeys.whiskeyUrl

  // Step 3:  Construct an object of data which you will send to Firestore
  //          in step 4 – this object should include the user ID, username,
  //          image URL, and a "created" timestamp – use the built-in
  //          function for this:
  //          firebase.firestore.FieldValue.serverTimestamp()

let addedWhiskey = {
userId: userId,
userName: userName,
whiskeyUrl: whiskeyUrl,
created: firebase.firestore.FieldValue.serverTimestamp()
}

  // Step 4:  Add the post to Firestore using the .add() function.
 
   let docRef = await db.collection('whiskeys').add({
      userId: userId,
      userName: userName,
      whiskeyUrl: whiskeyUrl,
      created: firebase.firestore.FieldValue.serverTimestamp()
    })

  // Step 5:  Assign the newly created post's auto-generated ID as an
  //          id attribute of the object you created in step 3 - to assign
  //          an attribute use: object.attribute = value
  //          Also add a likes attribute to the object with a value of 0
  //          (since a new post has 0 likes to start) - return the entire
  //          object as the body in the return value, using JSON.stringify()

addedWhiskey.id = docRef.id

  return {
    statusCode: 200,
    body: JSON.stringify(newPost)
  }

}


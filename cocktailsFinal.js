//window.addEventListener('DOMContentLoaded', async function(event) 

firebase.auth().onAuthStateChanged(async function (user) {
  let db = firebase.firestore()
  console.log(db)
  //let apiKey = '1'
  let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=Cocktail_glass`)
  let json = await response.json()
  let cocktails = json.drinks
  console.log(cocktails)


  if (user) {

    let userEmail = user.email
    let userName = user.displayName
    let userID = user.uid
    // let likesJSON = await fetch('http://localhost:8888/.netlify/functions/get_likes')
    // let numLikes =  await likesJSON.json()

    // let likeDisplay = 0
    // // console.log(likeDisplay)
    let numLikes = 0
    console.log(numLikes)





    let numDislikes = 0

    db.collection('users').doc(user.uid).set({
      userID: userID,
      email: userEmail
    })
    console.log(`${user.uid}`)

    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <a> ${userName} is signed in </a>
      <button class="text-white-500 underline sign-out">Sign Out</button>
      `
    document.querySelector('.sign-in-or-sign-out').addEventListener('click', function (event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })

    //   document.querySelector('.sign-in-or-sign-out').insertAdjacentHTML('beforeend', `
    //   <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
    //  Liked Cocktails
    //   <div class="liked-Cocktails"> ❤️ </div> 
    //   <span class="likes-counter">${likeDisplay}</span>
    //   </div> 

    //  <div class="text-center text-3xl md:mx-0 mx-4 w-1/3"> Disliked Cocktails
    //         <button class="disliked-Cocktails">👎</button>
    //         <span class="dislikes-counter">0</span> 
    //         </div>

    //   `)

    //   for (let j = 0; j < numLikes.length; j++ ){
    //     if (numLikes[j].likedBy == userID) {

    //       document.querySelector('.likes-counter').innerHTML = likeDisplay + 1

    //     } else{
    //     }
    //   }


    for (let i = 0; i < cocktails.length; i++) {
      let cocktail = cocktails[i]


      document.querySelector('.cocktails').insertAdjacentHTML('beforeend', `
         <div class="w-1/5 p-4 cocktail-${cocktail.idDrink}">
         <div class="text-center font-bold">${cocktail.strDrink}</div>
           <img src="${cocktail.strDrinkThumb}" class="w-full">
           <div class="md:flex">

          <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
           <button class="like-button-for-${cocktail.idDrink}"> ❤️ </button> 
           <span class="likes-for-${cocktail.idDrink}">${numLikes}</span>
           </div> 
          <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
          <button class="dislike-button-for-${cocktail.idDrink}">👎</button>
          <span class="dislikes-for-${cocktail.idDrink}">${numDislikes}</span> 
          </div>
         
           <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
           <button class="buy-button-for-${cocktail.idDrink} text-center text-white text-xl font-bold bg-green-500 border pl-6 pr-6 pt-1 pb-1 my-1 border-green-400 rounded"> Buy </button> 
           </div>

           </div>
           </div>
       `)

      // old button counters

      // 

      // old code for buy button (converted from link to button) like and dislike button <a href="cocktailDetails.html" class="buy-button text-center text-white text-xl text-strong bg-green-500 border border-gray-400 mt-1 px-1 py-2.5 w-1/3 rounded">Buy</a>

      let likeButton = document.querySelector(`.like-button-for-${cocktail.idDrink}`)

      likeButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`${user.displayName} liked ${cocktail.strDrink}`)

        let likeResponse = await fetch('http://localhost:8888/.netlify/functions/like_button', {
          method: 'POST',
          body: JSON.stringify({
            cocktailName: cocktail.strDrink,
            cocktailId: cocktail.idDrink,
            likedByName: user.displayName,
            likedById: user.uid,
            likedByEmail: user.email
          })
        })
        console.log(likeResponse)
        if (likeResponse.ok) {

          let numLikes = document.querySelector(`.likes-for-${cocktail.idDrink}`).innerHTML
          let newNumLikes = parseInt(numLikes) + 1
          document.querySelector(`.likes-for-${cocktail.idDrink}`).innerHTML = newNumLikes
          console.log(newNumLikes)
        } else {
          console.log(`Cocktail was already liked by ${user.displayName}`)
        }
      })


      let dislikeButton = document.querySelector(`.dislike-button-for-${cocktail.idDrink}`)
      dislikeButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`${user.displayName} disliked ${cocktail.strDrink}`)

        let dislikeResponse = await fetch('http://localhost:8888/.netlify/functions/dislike_button', {
          method: 'POST',
          body: JSON.stringify({
            cocktailName: cocktail.strDrink,
            cocktailId: cocktail.idDrink,
            likedByName: user.displayName,
            likedById: user.uid,
            likedByEmail: user.email
          })
        })
        console.log(dislikeResponse)
        if (dislikeResponse.ok) {
          let numDislikes = document.querySelector(`.dislikes-for-${cocktail.idDrink}`).innerHTML
          let newNumDislikes = parseInt(numDislikes) + 1
          document.querySelector(`.dislikes-for-${cocktail.idDrink}`).innerHTML = newNumDislikes
          console.log(newNumDislikes)

        } else {
          console.log(`Cocktail was already disliked by ${user.displayName}`)
        }
      })

      let buyButton = document.querySelector(`.buy-button-for-${cocktail.idDrink}`)
      buyButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`You want to buy ${cocktail.strDrink}`)

        // let currentuser = firebase.auth().currentuser
        // await db.collection('Cocktails to Buy').add({
        //   cocktailName: cocktail.strDrink,
        //   cocktailId: cocktail.idDrink,
        //   buyerName: user.displayName,
        //   buyerId: user.uid,
        //   buyerEmail: user.email

        let buyResponse = await fetch('http://localhost:8888/.netlify/functions/buy_button', {
          method: 'POST',
          body: JSON.stringify({
            cocktailName: cocktail.strDrink,
            cocktailId: cocktail.idDrink,
            likedByName: user.displayName,
            likedById: user.uid,
            likedByEmail: user.email

          })
        })
      })
    }
  } else {
    console.log('signed out')
    let ui = new firebaseui.auth.AuthUI(firebase.auth())
    console.log(ui)
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessURL: 'index.html'
    }
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }



})

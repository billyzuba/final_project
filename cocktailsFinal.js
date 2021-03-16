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
    let postNumberOfLikes = 0

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
      document.location.href = 'cocktailsFinal.html'
    })

    // Listen for the form submit and create/render the new post
    //document.querySelector('form').addEventListener('submit', async function(event) {
    //event.preventDefault()
    //let postUsername = user.displayName
    //let postCocktailUrl = document.querySelector('#added-cocktail').value

    //let response = await fetch('/.netlify/functions/add_cocktail', {
    //method: 'POST',
    //body: JSON.stringify({
    // userId: user.uid,
    //cocktailUrl: postCocktailUrl,
    //userName: postUsername
    //})
    //})


    //let cocktailJson = await response.json(
    //console.log(cocktailJson))

    for (let i = 0; i < cocktails.length; i++) {
      let cocktail = cocktails[i]
      //console.log(cocktail)
      let docRef = await db.collection('watched').doc(`${cocktails.strDrinkThumb}-${userID}`).get()
      //console.log(docRef)
      let addedCocktail = docRef.data()
     
      let opacityClass = ''
      if (addedCocktail) {
        opacityClass = 'opacity-20'
      }
    
      document.querySelector('.cocktails').insertAdjacentHTML('beforeend', `
         <div class="w-1/5 p-4 cocktail-${cocktail.idDrink}">
         <div class="text-center font-bold">${cocktail.strDrink}</div>
           <img src="${cocktail.strDrinkThumb}" class="w-full">
           <div class="md:flex">
        


          <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
           <button class="like-button-for-${cocktail.idDrink}"> ❤️ </button> 
           <span class="likes">${postNumberOfLikes}</span>
           </div> 
          <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
          <button class="dislike-button-for-${cocktail.idDrink}">👎</button>
          <span class="dislikes">${postNumberOfLikes}</span> 
          </div>
         
           <div class="text-center text-3xl md:mx-0 mx-4 w-1/3">
           <button class="buy-button-for-${cocktail.idDrink} text-center text-white text-xl font-bold bg-green-500 border pl-6 pr-6 pt-1 pb-1 my-1 border-green-400 rounded"> Buy </button> 
           </div>

           </div>
           </div>
       `)

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


      // let likeResponse = await fetch('http://localhost:8888/.netlify/functions/like', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //      cocktailName: cocktail.strDrink,
      //      cocktailId: cocktail.idDrink,
      //      likedByName: user.displayName,
      //      likedById: user.uid,
      //      likedByEmail: user.email
      //   })
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

        // let currentuser = firebase.auth().currentuser
        // await db.collection('disliked Cocktails').add({
        //   cocktailName: cocktail.strDrink,
        //   cocktailId: cocktail.idDrink,
        //   dislikedByName: user.displayName,
        //   dislikedById: user.uid,
        //   dislikedByEmail: user.email
        })

      })
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
      signInSuccessURL: 'cocktailsFinal.html'
    }
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }



})

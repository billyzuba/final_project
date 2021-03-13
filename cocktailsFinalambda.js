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

    for (let i = 0; i < cocktails.length; i++) {
      let cocktail = cocktails[i]
      //console.log(cocktail)
      let docRef = await db.collection('watched').doc(`${cocktails.strDrinkThumb}-${userID}`).get()
      //console.log(docRef)
      let addedCocktail = docRef.data()
      //console.log(watchedMovie)
      let opacityClass = ''
      if (addedCocktail) {
        opacityClass = 'opacity-20'
      }

      document.querySelector('.cocktails').insertAdjacentHTML('beforeend', `
         <div class="w-1/5 p-4 cocktail-${cocktail.idDrink}">
           <img src="${cocktail.strDrinkThumb}" class="w-full">
           <div class="flex">
          

           
         

          <div class="text-3xl md:mx-0 mx-4 ">
           <button class="like-button-for-${cocktail.idDrink}"> ❤️ </button> 
           </div> 
          <div class="text-3xl md:mx-0 mx-4">
          <button class="dislike-button-for-${cocktail.idDrink}">👎</button> 
          </div>
         
           <div class="text-3xl md:mx-0 mx-4">
           <button class="buy-button-for-${cocktail.idDrink} text-center text-white text-xl text-strong bg-green-500 border border-green-400 rounded"> Buy </button> 
           </div>

           </div>
           </div>
       `)

      // old code for buy button (converted from link to button) like and dislike button <a href="cocktailDetails.html" class="buy-button text-center text-white text-xl text-strong bg-green-500 border border-gray-400 mt-1 px-1 py-2.5 w-1/3 rounded">Buy</a>

      let likeButton = document.querySelector(`.like-button-for-${cocktail.idDrink}`)

      likeButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`${user.displayName} liked ${cocktail.idDrink}`)

        let currentuser = firebase.auth().currentuser
        await db.collection('liked Cocktails').add({
          cocktailName: cocktail.strDrink,
          cocktailId: cocktail.idDrink,
          likedByName: user.displayName,
          likedById: user.uid,
          likedByEmail: user.email
        })

      })

      let dislikeButton = document.querySelector(`.dislike-button-for-${cocktail.idDrink}`)
      dislikeButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`${user.displayName} disliked ${cocktail.idDrink}`)

        let currentuser = firebase.auth().currentuser
        await db.collection('disliked Cocktails').add({
          cocktailName: cocktail.strDrink,
          cocktailId: cocktail.idDrink,
          dislikedByName: user.displayName,
          dislikedById: user.uid,
          dislikedByEmail: user.email
        })

      })

      let buyButton = document.querySelector(`.buy-button-for-${cocktail.idDrink}`)
      buyButton.addEventListener('click', async function (event) {
        event.preventDefault()
        console.log(`you want to buy ${cocktail.idDrink}`)

        let currentuser = firebase.auth().currentuser
        await db.collection('Cocktails to Buy').add({
          cocktailName: cocktail.strDrink,
          cocktailId: cocktail.idDrink,
          buyerName: user.displayName,
          buyerId: user.uid,
          buyerEmail: user.email
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

async function renderPost(cocktailName, cocktailId, likedbyId) {
  document.querySelector('.likes').insertAdjacentHTML('beforeend', `
    <div class="post-${cocktailId} md:mt-16 mt-8 space-y-8">
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-xl">${cocktailName}</span>
      </div>
  
      <div>
        <img src="${postImageUrl}" class="w-full">
      </div>
  
      <div class="text-3xl md:mx-0 mx-4">
        <button class="like-button">❤️</button>
        <span class="likes">${postNumberOfLikes}</span>
      </div>
    </div>
  `)


  document.querySelector(`.post-$${cocktail.idDrink}.like-button`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`post ${cocktail.idDrink} like button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let querySnapshot = await db.collection('likes')
      .where('postId', '==', likedbyId)
      .where('userId', '==', currentUserId)
      .get()

    if (querySnapshot.size == 0) {
      await db.collection('likes').add({
        cocktailName: cocktail.strDrink,
        cocktailId: cocktail.idDrin
      })
      let existingNumberOfLikes = document.querySelector(`.post-${cocktail.idDrink} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.post-${cocktail.idDrink} .likes`).innerHTML = newNumberOfLikes
    }
    
  })
}

//



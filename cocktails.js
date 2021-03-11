  
 // window.addEventListener('DOMContentLoaded', async function(event) {
  
  firebase.auth().onAuthStateChanged(async function (user){
    let db = firebase.firestore()
    console.log(db)
    //let apiKey = '1'
    let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic`)
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
      document.querySelector('.sign-in-or-sign-out').addEventListener('click', function(event) {
        console.log('sign out clicked')
        firebase.auth().signOut()
        document.location.href = 'cocktails.html'
      })

      for (let i=0; i<cocktails.length; i++) {
        let cocktail = cocktails[i]
        //console.log(cocktail)
        let docRef = await db.collection('watched').doc(`${cocktail.strDrink}-${userID}`).get()
        //console.log(docRef)
        let watchedMovie = docRef.data()
        //console.log(watchedMovie)
        let opacityClass = ''
        if (watchedMovie) {
          opacityClass = 'opacity-20'
        }
    
        document.querySelector('.cocktails').insertAdjacentHTML('beforeend', `
          <div class="w-1/5 p-4 cocktail-${cocktail.strDrink}-${userID} ${opacityClass}">
            <img src="${cocktail.strDrinkThumb}" class="w-full">
            <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
          </div>
        `)
    
        document.querySelector(`.cocktail-${cocktail.strDrink}-${userID}`).addEventListener('click', async function(event) {
          event.preventDefault()
          let movieElement = document.querySelector(`.cocktail-${cocktail.strDrink}-${UserID}`)
          movieElement.classList.add('opacity-20')
          await db.collection('watched').doc(`${cocktail.strDrink}-${userID}`).set({})
        }) 

    // Listen for the form submit and create/render the new post
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      let postUsername = user.displayName
      let postCocktailUrl = document.querySelector('#added-cocktail').value
     
      let response = await fetch('/.netlify/functions/add_cocktail', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.uid,
          cocktailUrl: postCocktailUrl,
          userName: postUsername
        })
      })
    

      let cocktailJson = await response.json(
        console.log(cocktailJson))

      

    document.querySelector('#image-url').value = '' // clear the image url field
      renderPost( postId, postUsername, postImageUrl, numberOfLikes )
    })

    
   }} else {
      console.log('signed out')
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      console.log(ui)
      let authUIConfig = {
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInSuccessURL: 'cocktails.html'
      }
      ui.start('.sign-in-or-sign-out', authUIConfig)
    }
      
  
  
  })

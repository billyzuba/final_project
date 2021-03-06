  //window.addEventListener('DOMContentLoaded', async function(event) 
  
  firebase.auth().onAuthStateChanged(async function (user){
    let db = firebase.firestore()
    console.log(db)
    let apiKey = '657128272c528825d4a3b01a7668bcb0'
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
    let json = await response.json()
    let whiskeys = json.results
    console.log(whiskeys)
  
  
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
        document.location.href = 'whiskeys.html'
      })


    for (let i=0; i<whiskeys.length; i++) {
      let whiskey = whiskeys[i]
      //console.log(whiskeys)
      let docRef = await db.collection('watched').doc(`${whiskey.id}-${userID}`).get()
      //console.log(docRef)
      let watchedMovie = docRef.data()
      //console.log(watchedMovie)
      let opacityClass = ''
      //if (watchedMovie) {
        //opacityClass = 'opacity-20'
      //}
    
      document.querySelector('.whiskeys').insertAdjacentHTML('beforeend', `
        <div class="w-1/5 p-4 movie-${whiskey.id}-${userID} ${opacityClass}">
          <img src="https://image.tmdb.org/t/p/w500${whiskey.poster_path}" class="w-full">
          <div class="flex">
          <a href="whiskeyDetails.html" class="buy-button text-center text-white text-xs bg-green-500 border border-gray-400 mt-1 px-1 py-1 w-1/3 rounded">Buy</a>
          <a href="#" class="sell-button text-center text-white text-xs bg-green-500 border border-gray-400 mt-1 px-1 py-1 w-1/3 rounded">Sell</a>
          <a href="#" class="trade-button text-center text-white text-xs bg-green-500 border border-gray-400 mt-1 px-1 py-1 w-1/3 rounded">Trade</a>
          </div>
          </div>
      `)
  
      document.querySelector(`.movie-${whiskey.id}-${userID}`).addEventListener('click', async function(event) {
        event.preventDefault()
        let whiskeyElement = document.querySelector(`.movie-${whiskey.id}-${UserID}`)
        whiskeyElement.classList.add('opacity-20')
        await db.collection('watched').doc(`${whiskey.id}-${userID}`).set({})
      }) 
    }} else {
      console.log('signed out')
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      console.log(ui)
      let authUIConfig = {
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInSuccessURL: 'whiskeys.html'
      }
      ui.start('.sign-in-or-sign-out', authUIConfig)
    }
      
  
  
  })

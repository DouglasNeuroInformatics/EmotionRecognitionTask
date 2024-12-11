export const addContinueButton = () => {
    let divContainer = document.createElement('div')
    let continueButton = document.createElement('button')

    divContainer.style.alignContent = "center"

    continueButton.style.alignContent = "center"
    continueButton.style.justifyContent = "center"
    continueButton.style.position = "flex"
    continueButton.style.display = "None"
    continueButton.style.margin = "0"
    continueButton.className = "btn btn-primary"
    continueButton.textContent = "Continue"
    
    return continueButton
  }

 export const createContinueButtonDiv = (continueButton: HTMLButtonElement) => {
    let continueButtonDiv = document.createElement('div')
    continueButtonDiv.style.justifyContent = "center"
    continueButtonDiv.style.alignItems = "center"
    continueButtonDiv.style.display = "flex"
    continueButtonDiv.appendChild(continueButton)

    return continueButtonDiv

  }

  export const revealEmotionButtons = () => {

    let emotionButtons = document.getElementsByName('custom-button-div')

    for(let i = 0 ; i < emotionButtons.length; i ++){
      emotionButtons[i].style.display = 'flex'
    }
  }

  export const addBootstrapScripts = () => {
    let link = document.createElement('link')
    let ajaxScript = document.createElement('script')
    let bootstrapScript = document.createElement('script')

    link.rel = "stylesheet"
    link.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"

    ajaxScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
    bootstrapScript.src = "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"

    document.head.appendChild(link)
    document.head.appendChild(ajaxScript)
    document.head.appendChild(bootstrapScript)
  }
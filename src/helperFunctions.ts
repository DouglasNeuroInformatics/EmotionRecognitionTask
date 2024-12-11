export const addContinueButton = () => {
    const divContainer = document.createElement('div')
    const continueButton = document.createElement('button')

    divContainer.style.alignContent = "center"

    continueButton.style.alignContent = "center"
    continueButton.style.justifyContent = "center"
    continueButton.style.position = "flex"
    continueButton.style.display = "None"
    continueButton.style.margin = "0"
    continueButton.className = "btn btn-primary btn-lg"
    continueButton.textContent = "Continue"
    
    return continueButton
  }

 export const createContinueButtonDiv = (continueButton: HTMLButtonElement) => {
    const continueButtonDiv = document.createElement('div')
    continueButtonDiv.style.justifyContent = "center"
    continueButtonDiv.style.alignItems = "center"
    continueButtonDiv.style.display = "flex"
    continueButtonDiv.appendChild(continueButton)

    return continueButtonDiv

  }

  export const revealEmotionButtons = () => {

    const emotionButtons = document.getElementsByName('custom-button-div')

    for(let i = 0 ; i < emotionButtons.length; i ++){
      emotionButtons[i].style.display = 'flex'
    }
  }

  export const addBootstrapScripts = () => {
    const link = document.createElement('link')
    const bootstrapScript = document.createElement('script')

    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"

    
    bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"

    document.head.appendChild(link)
    document.head.appendChild(bootstrapScript)
  }

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
    const Csslink = document.createElement('link')
    const bootstrapScript = document.createElement('script')

    link.rel = "stylesheet"
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"

    Csslink.rel = "stylesheet"
    Csslink.href = "src/style.css"

    
    bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"

    document.head.appendChild(link)
    document.head.appendChild(Csslink)
    document.head.appendChild(bootstrapScript)
    
  }


  export const videoCoverHtmlGenerator = (filepath:string) => {
    return `
     
    <div class="video-container">
        <div class="video-overlay" id="overlay">
          <svg id="overlay-cross" height="100" width="100" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="0" x2="50" y2="100" style="stroke:white;stroke-width:18" />
            <line x1="0" y1="50" x2="100" y2="50" style="stroke:white;stroke-width:18" />
            Sorry, your browser does not support inline SVG.
          </svg>
        </div>
        <video id="video" preload="auto" src=${filepath}>
        </video>
        
    </div>
    `;
  }
  
  

  export const audioHtmlGenerator = (filepath:string) => {
    return ` 
      <svg id="audioIcon" xmlns="http://www.w3.org/2000/svg" style="align-content: center;" version="1.0" width="200" height="200" viewBox="10 0 45 120">
            <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style="stroke:#111;stroke-width:5;stroke-linejoin:round;fill:#111;"/>
            <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"/>
        </svg>
        <audio id="audioContent" preload="auto">
            <source src=${filepath} type="audio/mpeg">
        </audio>
          `;
  } 

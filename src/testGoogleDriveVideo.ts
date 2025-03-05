

export function googleDriveVideo() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://drive.google.com/file/d/1Vv2I5FDLwVtCnR9nZND3FHkijDKH5r-V/preview';
    iframe.width = "640";
    iframe.height = "360";
    iframe.allow = "autoplay";

    document.body.appendChild(iframe);

    iframe.addEventListener('onclick', () => {

    })
}
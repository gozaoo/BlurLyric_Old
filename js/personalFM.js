var personalFMimformation = []
var usingPersonalFM = false
async function personalFM() {
    await fetch(cloud + 'personal_fm?' + (Number(new Date())))
    .then (r=>r.json).then(res=>{
        personalFMImformation = res.data
        
    })
}

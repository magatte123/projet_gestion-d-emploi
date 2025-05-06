document.addEventListener("DOMContentLoaded", () =>{
    //initialisation de la base donnée simulé
    let user = JSON.parse(localStorage.getItem("users"))||[];
    //Gestion d'inscription
    document.getElementById("formInscrip").addEventListener("submit",function(e){
        e.preventDefault();
        //recuperation des champs
        const userName = document.getElementById("userName").value;
        const email = document.getElementById("mail").value;
        const motDePasse = document.getElementById("mdp").value;
        //verifier si l'email exixte deja
        let EmailExiste = user.find((u) => u.email === email);
        if(EmailExiste){
            alert("email existe deja");
            
        }else{
            const newUser = {userName,email,motDePasse};
            user.push(newUser);
            localStorage.setItem("users", JSON.stringify(user));
            alert("Inscription reussit");
        }	
        console.log(userName, email, motDePasse);
        const newUser = {userName,email,motDePasse};
        user.push(newUser);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Inscription reussit");
    
        
    })





    //Gestion connexion
    document.getElementById("formConnexion").addEventListener("submit",function(e){
        e.preventDefault();
        //recuperation des champs
        const email = document.getElementById("mailConnexion").value;
        const motDePasse = document.getElementById("mdpConnexion").value;
        //console.log(userName, email, motDePasse);
        //const newUser = {userName,email,motDePasse};
        const userFound = user.find((u) => u.email === email && u.motDePasse ===motDePasse);
        if(userFound){
            alert("connexion reussit");
            window.location.href = "index.html";

        }else{
            alert("email ou mot de passe incorrect");
        }
        
        
        }) 
    })
   

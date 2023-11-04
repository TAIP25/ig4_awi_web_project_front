import "./Signup.scss";



function Signup() {


    return (
        <div className="form-container">
            <form className="form">
                <h1 className="form-title">Signup</h1>
                <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input className="form-control" type="nom" id="nom" name="nom" placeholder="Nom de famille" />
                </div>
                <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input className="form-control" type="prenom" id="prenom" name="prenom" placeholder="Prénom" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input className="form-control" type="email" id="email" name="email" placeholder="Email" />
                </div>
                <div className="form-group">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input className="form-control" type="pseudo" id="pseudo" name="pseudo" placeholder="Pseudo" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input className="form-control" type="password" id="password" name="password" placeholder="Password" />
                </div>
                <div className="form-group">
                    <label htmlFor="password-confirm">Confirm password</label>
                    <input className="form-control" type="password" id="password-confirm" name="password-confirm" placeholder="Confirm password" />
                </div>
                
                <button className="btn btn-primary" type="submit">Signup</button>
                
            </form> 
        </div>
    )
}

export default Signup;
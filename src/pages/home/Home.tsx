import "./Home.scss"

export default function Home(){
    return(
        <div className="home">
            <h1>Home</h1>
            <a href="/login">Login</a>
            <a href="/signup">Signup</a>
            <a href="/dashboard">Dashboard</a>
        </div>
    )
}
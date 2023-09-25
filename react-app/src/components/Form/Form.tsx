import {FormEvent, useState} from "react";
    
const Form = () => {
    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (event: FormEvent)  => {
        event.preventDefault()
        console.log('Submitted')
    }   

    return (
        <>
            <form onSubmit={handleSubmit}> 
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    onChange={(event) => setUser({...user, email: event.target.value})}
                />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" 
                    className="form-control" 
                    id="exampleInputPassword1" 
                    onChange={(event) => setUser({...user, password: event.target.value})}
                />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}
export default Form; // Fixed the component's export name to match the declaration

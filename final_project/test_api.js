const axios = require('axios');

async function test() {
    try {
        let register = await axios.post('http://localhost:5000/register', {username: "User1", password: "Pass1"});
        console.log("REGISTER:");
        console.log(register.data);
    } catch (e) { console.log(e.response ? e.response.data : e.message); }

    try {
        let login = await axios.post('http://localhost:5000/customer/login', {username: "User1", password: "Pass1"});
        console.log("LOGIN:");
        console.log(login.data);
        console.log("Cookie:", login.headers['set-cookie']);
        
        let cookie = login.headers['set-cookie'][0].split(';')[0];
        
        let addRev = await axios.put('http://localhost:5000/customer/auth/review/1', {review: "Great book!"}, {
            headers: { Cookie: cookie }
        });
        console.log("ADD REVIEW:");
        console.log(addRev.data);

        let delRev = await axios.delete('http://localhost:5000/customer/auth/review/1', {
            headers: { Cookie: cookie }
        });
        console.log("DELETE REVIEW:");
        console.log(delRev.data);
    } catch (e) {
        console.log(e.response ? e.response.data : e.message);
    }
}
test();
